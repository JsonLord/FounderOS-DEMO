import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, test } from 'vitest';
import { openDb, type FounderDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { buildCompanyPackage } from '@/lib/company-package';

let db: FounderDb;

afterEach(() => {
  db?.close();
});

function seeded(): FounderDb {
  const d = openDb(':memory:');
  seedDatabase(d);
  return d;
}

describe('buildCompanyPackage — coverage', () => {
  test('every agent yields exactly one AGENTS.md', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const agentFiles = pkg.files.filter((f) => f.path.startsWith('agents/') && f.path.endsWith('/AGENTS.md'));
    expect(agentFiles.length).toBe(db.agents.all().length + db.people.all().length);
  });

  test('every skill yields exactly one SKILL.md', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const skillFiles = pkg.files.filter((f) => f.path.startsWith('skills/') && f.path.endsWith('/SKILL.md'));
    expect(skillFiles.length).toBe(db.skills.all().length);
  });

  test('every sop task yields exactly one TASK.md', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const taskFiles = pkg.files.filter((f) => f.path.endsWith('/TASK.md'));
    expect(taskFiles.length).toBe(db.sopTasks.all().length);
  });

  test('every department with a lead agent yields a TEAM.md', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const teamFiles = pkg.files.filter((f) => f.path.endsWith('/TEAM.md'));
    expect(teamFiles.length).toBe(db.departments.all().length);
  });

  test('emits COMPANY.md, one PROJECT.md, and .paperclip.yaml', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    expect(pkg.files.some((f) => f.path === 'COMPANY.md')).toBe(true);
    expect(pkg.files.filter((f) => f.path.endsWith('/PROJECT.md')).length).toBe(1);
    expect(pkg.files.some((f) => f.path === '.paperclip.yaml')).toBe(true);
  });
});

describe('buildCompanyPackage — org integrity', () => {
  test('conductor is the unique agent with no reportsTo', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const agentDocs = pkg.files.filter((f) => f.path.startsWith('agents/') && f.path.endsWith('/AGENTS.md'));
    const roots = agentDocs.filter((f) => f.content.includes('reportsTo: null'));
    expect(roots.length).toBe(1);
    expect(roots[0]?.path).toBe('agents/conductor/AGENTS.md');
  });

  test('every reportsTo slug resolves to an emitted agent, with no cycles', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const agentDocs = pkg.files.filter((f) => f.path.startsWith('agents/') && f.path.endsWith('/AGENTS.md'));
    const bySlug = new Map<string, string | null>();
    for (const f of agentDocs) {
      const slug = f.path.split('/')[1];
      const match = f.content.match(/reportsTo: (null|"[^"]+")/);
      expect(match).not.toBeNull();
      const value = match![1] === 'null' ? null : JSON.parse(match![1]);
      bySlug.set(slug, value);
    }
    for (const [slug, parent] of bySlug) {
      const seen = new Set<string>();
      let cursor: string | null = slug;
      while (cursor !== null) {
        expect(seen.has(cursor)).toBe(false); // no cycles
        seen.add(cursor);
        if (cursor !== slug) expect(bySlug.has(cursor)).toBe(true); // resolves
        cursor = cursor === slug ? parent : (bySlug.get(cursor) ?? null);
      }
    }
  });
});

describe('buildCompanyPackage — slugs', () => {
  test('agent, person, skill, and task slugs are unique and url-safe', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const map of [pkg.slugs.agents, pkg.slugs.people, pkg.slugs.skills, pkg.slugs.sopTasks]) {
      const values = Object.values(map);
      expect(new Set(values).size).toBe(values.length);
      for (const slug of values) expect(slug).toMatch(slugPattern);
    }
  });

  test('slugs are stable across two builds from the same seed', () => {
    db = seeded();
    const first = buildCompanyPackage(db);
    const second = buildCompanyPackage(db);
    expect(first.slugs).toEqual(second.slugs);
  });
});

describe('buildCompanyPackage — spec conformance', () => {
  test('every file has valid YAML frontmatter fences (or is the plain .paperclip.yaml)', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    for (const f of pkg.files) {
      if (f.path === '.paperclip.yaml') {
        expect(f.content.startsWith('---')).toBe(false);
        continue;
      }
      expect(f.content.startsWith('---\n')).toBe(true);
      expect(f.content.indexOf('\n---\n', 4)).toBeGreaterThan(0);
    }
  });

  test('SKILL.md carries no Paperclip-required top-level field beyond name/description/metadata', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const skillFiles = pkg.files.filter((f) => f.path.endsWith('/SKILL.md'));
    expect(skillFiles.length).toBeGreaterThan(0);
    for (const f of skillFiles) {
      const fence = f.content.split('---\n')[1];
      const keys = [...fence.matchAll(/^(\w+):/gm)].map((m) => m[1]);
      for (const key of keys) expect(['name', 'description', 'metadata']).toContain(key);
    }
  });

  test('.paperclip.yaml never carries secretId or a secret_ref shape', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const sidecar = pkg.files.find((f) => f.path === '.paperclip.yaml')!;
    expect(sidecar.content).not.toContain('secretId');
    expect(sidecar.content).not.toContain('secret_ref');
  });

  test('COMPANY.md requirements.secrets lists only names, never values', () => {
    db = seeded();
    const pkg = buildCompanyPackage(db);
    const company = pkg.files.find((f) => f.path === 'COMPANY.md')!;
    if (company.content.includes('requirements:')) {
      const secretsBlock = company.content.split('requirements:')[1];
      const names = [...secretsBlock.matchAll(/- "([^"]+)"/g)].map((m) => m[1]);
      for (const name of names) expect(name).toMatch(/^[A-Z][A-Z0-9_]*$/);
    }
  });
});

describe('buildCompanyPackage — secrets never leak', () => {
  test('lib/company-package.ts never reads process.env or lib/creds', () => {
    const here = fileURLToPath(new URL('.', import.meta.url));
    const modulePath = fs.realpathSync(`${here}/../lib/company-package.ts`);
    const source = fs.readFileSync(modulePath, 'utf8');
    expect(source).not.toContain('process.env');
    expect(source).not.toContain("from '@/lib/creds'");
  });
});
