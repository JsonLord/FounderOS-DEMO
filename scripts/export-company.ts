import path from 'node:path';
import fs from 'node:fs';
import { openDb } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { buildCompanyPackage } from '../lib/company-package';
import { createZipArchive } from '../lib/zip';

const dbPath = process.env.FOUNDER_OS_DB ?? path.join(process.cwd(), 'data', 'founder-os.db');
if (dbPath !== ':memory:') fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = openDb(dbPath);
if (db.departments.all().length === 0) seedDatabase(db);

const pkg = buildCompanyPackage(db);

const outDir = process.env.COMPANY_PACKAGE_OUT ?? path.join(process.cwd(), 'out', 'company-package');
fs.rmSync(outDir, { recursive: true, force: true });
for (const file of pkg.files) {
  const filePath = path.join(outDir, file.path);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, file.content, 'utf8');
}

const zipPath = `${outDir}.zip`;
fs.writeFileSync(zipPath, createZipArchive(pkg.files));

console.log('Exported Paperclip company package (agentcompanies/v1):');
console.log(`  files: ${pkg.files.length}`);
console.log(`  dir:   ${outDir}`);
console.log(`  zip:   ${zipPath}`);
db.close();
