// Minimal, dependency-free YAML emitter for the Paperclip company package.
// Scoped to exactly what lib/company-package.ts needs to write: scalars,
// arrays of scalars, arrays of objects, and nested objects — always
// double-quoting string scalars (JSON.stringify escaping is a valid YAML
// double-quoted scalar) so we never have to reason about YAML's plain-scalar
// ambiguity rules. `undefined` values and empty arrays/objects are omitted,
// which is how the exporter honors "omit empty/default fields".

// Callers pass Zod-parsed data (already shape-checked upstream), so this
// stays loosely typed on `unknown` rather than re-deriving a closed
// recursive union — only string/number/boolean/null/array/plain-object
// values are ever produced by the exporter that calls into this module.
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function yamlScalar(value: string | number | boolean | null): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  return JSON.stringify(value);
}

function yamlLines(value: unknown, indent: number): string[] {
  const pad = '  '.repeat(indent);
  const lines: string[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (isPlainObject(item)) {
        const entries = Object.entries(item).filter(([, v]) => v !== undefined);
        entries.forEach(([key, v], i) => {
          const prefix = i === 0 ? `${pad}- ` : `${pad}  `;
          if (isPlainObject(v)) {
            if (Object.keys(v).length === 0) return;
            lines.push(`${prefix}${key}:`);
            lines.push(...yamlLines(v, indent + 2));
          } else if (Array.isArray(v)) {
            if (v.length === 0) return;
            lines.push(`${prefix}${key}:`);
            lines.push(...yamlLines(v, indent + 2));
          } else {
            lines.push(`${prefix}${key}: ${yamlScalar(v as string | number | boolean | null)}`);
          }
        });
      } else {
        lines.push(`${pad}- ${yamlScalar(item as string | number | boolean | null)}`);
      }
    }
    return lines;
  }

  if (isPlainObject(value)) {
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) {
        if (v.length === 0) continue;
        lines.push(`${pad}${key}:`);
        lines.push(...yamlLines(v, indent + 1));
      } else if (isPlainObject(v)) {
        if (Object.keys(v).length === 0) continue;
        lines.push(`${pad}${key}:`);
        lines.push(...yamlLines(v, indent + 1));
      } else {
        lines.push(`${pad}${key}: ${yamlScalar(v as string | number | boolean | null)}`);
      }
    }
    return lines;
  }

  return lines;
}

/** A standalone YAML document — used for the `.paperclip.yaml` sidecar. */
export function toYamlDocument(doc: Record<string, unknown>): string {
  return `${yamlLines(doc, 0).join('\n')}\n`;
}

/** A markdown file with YAML frontmatter — used for every package doc. */
export function toFrontmatterDoc(doc: Record<string, unknown>, bodyLines: string[]): string {
  const frontmatter = yamlLines(doc, 0).join('\n');
  const body = bodyLines.join('\n');
  return `---\n${frontmatter}\n---\n\n${body}\n`;
}
