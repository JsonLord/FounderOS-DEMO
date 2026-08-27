import { describe, expect, test } from 'vitest';
import { toFrontmatterDoc, toYamlDocument } from '@/lib/yaml';

describe('toFrontmatterDoc', () => {
  test('wraps frontmatter in --- fences with a blank line before the body', () => {
    const out = toFrontmatterDoc({ kind: 'agent', name: 'Conductor' }, ['# Conductor', '', 'Body text.']);
    expect(out).toBe('---\nkind: "agent"\nname: "Conductor"\n---\n\n# Conductor\n\nBody text.\n');
  });

  test('double-quotes strings so colons and quotes never break the YAML', () => {
    const out = toFrontmatterDoc({ description: 'Sales: "closing" & deals' }, []);
    expect(out).toContain('description: "Sales: \\"closing\\" & deals"');
  });

  test('omits undefined fields and empty arrays/objects', () => {
    const out = toFrontmatterDoc(
      { name: 'X', title: undefined, skills: [], metadata: {} },
      [],
    );
    expect(out).not.toContain('title');
    expect(out).not.toContain('skills');
    expect(out).not.toContain('metadata');
  });

  test('renders arrays of scalars as a block sequence', () => {
    const out = toFrontmatterDoc({ tags: ['a', 'b'] }, []);
    expect(out).toContain('tags:\n  - "a"\n  - "b"');
  });

  test('renders arrays of objects (e.g. authors) as a block sequence of mappings', () => {
    const out = toFrontmatterDoc({ authors: [{ name: 'Alex Rivera' }] }, []);
    expect(out).toContain('authors:\n  - name: "Alex Rivera"');
  });

  test('renders nested objects with increasing indent', () => {
    const out = toFrontmatterDoc({ requirements: { secrets: ['A_KEY'] } }, []);
    expect(out).toContain('requirements:\n  secrets:\n    - "A_KEY"');
  });

  test('renders null and boolean scalars without quoting', () => {
    const out = toFrontmatterDoc({ reportsTo: null, recurring: true }, []);
    expect(out).toContain('reportsTo: null');
    expect(out).toContain('recurring: true');
  });
});

describe('toYamlDocument', () => {
  test('has no --- fences and no body', () => {
    const out = toYamlDocument({ schema: 'paperclip/v1' });
    expect(out).toBe('schema: "paperclip/v1"\n');
    expect(out).not.toContain('---');
  });
});
