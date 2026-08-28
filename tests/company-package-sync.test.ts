import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { buildCompanyPackage } from '@/lib/company-package';

// company-package/ is committed to the repo (not .gitignored, not a build
// artifact) because a GitHub-native Paperclip import resolves repo + ref +
// path — COMPANY.md has to actually live in the git tree, not just be
// generated on demand by `npm run export:company` or GET /api/company-package.
// This test is the tripwire that keeps the committed copy from drifting out
// of sync with the seeded org: run `npm run export:company` and commit the
// diff whenever agents/skills/SOPs/departments change.
const PACKAGE_ROOT = path.join(process.cwd(), 'company-package');

let db: FounderDb;

afterEach(() => {
  db?.close();
});

describe('committed company-package/', () => {
  test('matches what buildCompanyPackage generates from the seeded org', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const pkg = buildCompanyPackage(db);

    for (const file of pkg.files) {
      const committedPath = path.join(PACKAGE_ROOT, file.path);
      expect(
        fs.existsSync(committedPath),
        `company-package/${file.path} is missing — run "npm run export:company" and commit the result`,
      ).toBe(true);
      const committed = fs.readFileSync(committedPath, 'utf8');
      expect(committed, `company-package/${file.path} is stale — run "npm run export:company" and commit the result`).toBe(
        file.content,
      );
    }
  });

  test('has no extra files beyond what the builder generates', () => {
    db = openDb(':memory:');
    seedDatabase(db);
    const pkg = buildCompanyPackage(db);
    const expected = new Set(pkg.files.map((f) => f.path));

    const found: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else found.push(path.relative(PACKAGE_ROOT, full));
      }
    };
    walk(PACKAGE_ROOT);

    for (const relPath of found) {
      expect(expected.has(relPath), `company-package/${relPath} is stale/orphaned`).toBe(true);
    }
  });
});
