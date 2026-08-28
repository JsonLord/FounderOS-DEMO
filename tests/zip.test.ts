import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { createZipArchive } from '@/lib/zip';

describe('createZipArchive', () => {
  test('round-trips through the system unzip tool', () => {
    const entries = [
      { path: 'COMPANY.md', content: '---\nname: "Founder OS"\n---\n\n# Founder OS\n' },
      { path: 'agents/conductor/AGENTS.md', content: '---\nname: "Conductor"\n---\n\nBody.\n' },
    ];
    const zipBuf = createZipArchive(entries);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'founderos-zip-'));
    const zipPath = path.join(dir, 'package.zip');
    fs.writeFileSync(zipPath, zipBuf);

    execFileSync('unzip', ['-o', '-q', zipPath, '-d', dir]);

    for (const entry of entries) {
      const extracted = fs.readFileSync(path.join(dir, entry.path), 'utf8');
      expect(extracted).toBe(entry.content);
    }

    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('produces a valid archive for zero entries', () => {
    const zipBuf = createZipArchive([]);
    expect(zipBuf.length).toBe(22); // just the end-of-central-directory record
  });
});
