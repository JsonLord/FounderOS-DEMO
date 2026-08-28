import path from 'node:path';
import fs from 'node:fs';
import { openDb } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { buildCompanyPackage } from '../lib/company-package';

const dbPath = process.env.FOUNDER_OS_DB ?? path.join(process.cwd(), 'data', 'founder-os.db');
if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = openDb(dbPath);
if (db.departments.all().length === 0) seedDatabase(db);

const pkg = buildCompanyPackage(db);

// Committed at repo root (not .gitignored) — a GitHub-native Paperclip import
// resolves repo + ref + path, so COMPANY.md has to actually live in the git
// tree. `npm test` fails if this drifts from the seeded org (see
// tests/company-package-sync.test.ts); re-run this script and commit the
// diff whenever agents/skills/SOPs/departments change.
const outDir = process.env.COMPANY_PACKAGE_OUT ?? path.join(process.cwd(), 'company-package');
fs.rmSync(outDir, { recursive: true, force: true });
for (const file of pkg.files) {
  const filePath = path.join(outDir, file.path);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, file.content, 'utf8');
}

console.log('Exported Paperclip company package (agentcompanies/v1):');
console.log(`  files: ${pkg.files.length}`);
console.log(`  dir:   ${outDir}`);
console.log('Commit the result: git add company-package && git commit');
db.close();
