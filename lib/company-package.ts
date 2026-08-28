// Exports the FounderOS board as a Paperclip-native Agent Company package
// (`agentcompanies/v1`) — see spec.md and the Paperclip repo's
// docs/companies/companies-spec.md. Larp-first, real-ready: this module only
// READS through the existing repo layer (lib/db.ts). It adds no tables, and
// it never reads runtime environment variables or lib/creds.ts — connector
// credentials are declared by NAME only (TOOL_ENV_KEYS below), never by value.
import type { FounderDb } from '@/lib/db';
import {
  AgentPackageDocSchema,
  CompanyPackageDocSchema,
  PaperclipSidecarSchema,
  ProjectPackageDocSchema,
  SkillPackageDocSchema,
  TaskPackageDocSchema,
  TeamPackageDocSchema,
  type Agent,
  type PaperclipAgentExtension,
  type PaperclipRoutine,
  type Skill,
  type SopTask,
} from '@/lib/schemas';
import { toFrontmatterDoc, toYamlDocument } from '@/lib/yaml';

export interface PackageFile {
  path: string;
  content: string;
}

export interface CompanyPackageSlugs {
  departments: Record<string, string>;
  agents: Record<string, string>;
  people: Record<string, string>;
  skills: Record<string, string>;
  sopTasks: Record<string, string>;
}

export interface CompanyPackage {
  files: PackageFile[];
  slugs: CompanyPackageSlugs;
}

const COMPANY_SLUG = 'founder-os';
const CONDUCTOR_ID = 'conductor';

function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'item';
}

function dedupeSlug(base: string, used: Set<string>): string {
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

// Connector credential NAMES only (env var names), never values. Only tools
// that map to a real lib/connectors/* integration with a documented env var
// get an entry; local/read-only/no-API tools (whatsapp, wispr, gbrain's
// Supabase key, tmux, …) are honestly left with no secret requirement.
const TOOL_ENV_KEYS: Record<string, string[]> = {
  zernio: ['ZERNIO_API_KEY'],
  attio: ['ATTIO_API_KEY'],
  arcads: ['ARCADS_API_KEY'],
  miro: ['MIRO_ACCESS_TOKEN'],
  notion: ['NOTION_API_KEY'],
  slack: ['SLACK_BOT_TOKEN'],
  imap: ['INBOX_1_HOST', 'INBOX_1_USER', 'INBOX_1_PASS'],
  gmail: ['INBOX_1_HOST', 'INBOX_1_USER', 'INBOX_1_PASS'],
  stripe: ['STRIPE_SECRET_KEY'],
  ghl: ['GHL_API_KEY', 'GHL_LOCATION_ID'],
  manychat: ['MANYCHAT_API_KEY'],
  trakyo: ['TRAKYO_API_KEY'],
  webinarjam: ['WEBINARJAM_API_KEY'],
};

function toolEnvKeys(tool: string): string[] {
  return TOOL_ENV_KEYS[tool] ?? [];
}

function numberedSteps(steps: string[]): string[] {
  return steps.map((step, i) => `${i + 1}. ${step}`);
}

function sopBody(sop: SopTask): string[] {
  return ['', `## SOP — ${sop.title}`, sop.summary, '', ...numberedSteps(sop.steps)];
}

// lib/seed.ts's skillDoc() generates a full SKILL.md — its own
// `---\n...\n---\n\nbody` — for every seeded skill. Strip that doc's own
// frontmatter so we can re-render it (with our metadata.paperclip /
// metadata.founderos extensions added) instead of nesting two `---` blocks.
function skillBody(skill: Skill): string {
  const markdown = skill.markdown;
  if (!markdown.startsWith('---\n')) return markdown.trim() || skill.description;
  const closeIndex = markdown.indexOf('\n---\n', 4);
  if (closeIndex === -1) return markdown.trim();
  return markdown.slice(closeIndex + '\n---\n'.length).replace(/^\s+/, '');
}

export function buildCompanyPackage(db: FounderDb): CompanyPackage {
  const departments = db.departments.all();
  const agents = db.agents.all();
  const people = db.people.all();
  const sopTasks = db.sopTasks.all();
  const skills = db.skills.all();
  const roadmap = db.roadmap.all();

  if (!agents.some((a) => a.id === CONDUCTOR_ID)) {
    throw new Error(`company-package: expected an agent with id "${CONDUCTOR_ID}" as the org root`);
  }

  const agentById = new Map(agents.map((a) => [a.id, a]));
  for (const a of agents) {
    if (a.parentId && !agentById.has(a.parentId)) {
      throw new Error(`company-package: agent "${a.id}" reports to unknown parent "${a.parentId}"`);
    }
  }

  // ── slugs — the portable identity layer, not FounderOS's dept-*/person-* db ids ──
  const deptSlugs: Record<string, string> = {};
  for (const d of departments) deptSlugs[d.id] = d.slug; // already canonical + unique

  const usedAgentSlugs = new Set<string>();
  const agentSlugs: Record<string, string> = {};
  for (const a of agents) agentSlugs[a.id] = dedupeSlug(slugify(a.id), usedAgentSlugs);

  const usedPersonSlugs = new Set<string>();
  const personSlugs: Record<string, string> = {};
  for (const p of people) personSlugs[p.id] = dedupeSlug(slugify(p.name), usedPersonSlugs);

  const usedSkillSlugs = new Set<string>();
  const skillSlugs: Record<string, string> = {};
  for (const s of skills) skillSlugs[s.id] = dedupeSlug(slugify(s.name), usedSkillSlugs);

  const usedTaskSlugs = new Set<string>();
  const taskSlugs: Record<string, string> = {};
  for (const t of sopTasks) taskSlugs[t.id] = dedupeSlug(slugify(t.title), usedTaskSlugs);

  function reportsTo(agent: Agent): string | null {
    if (agent.id === CONDUCTOR_ID) return null;
    if (agent.parentId) return agentSlugs[agent.parentId];
    return agentSlugs[CONDUCTOR_ID];
  }

  // The pillar's TEAM.md manager: Conductor when it sits in this department
  // (TECH — it's the org root, per CLAUDE.md's operator → Conductor → 5
  // pillars tree), else the department's sole top-level agent, else the
  // first by slug so the choice stays deterministic.
  function deptManager(deptId: string): Agent | null {
    const roots = agents.filter((a) => a.departmentId === deptId && a.parentId === null);
    if (roots.length === 0) return null;
    const conductor = roots.find((a) => a.id === CONDUCTOR_ID);
    if (conductor) return conductor;
    if (roots.length === 1) return roots[0];
    return [...roots].sort((a, b) => agentSlugs[a.id].localeCompare(agentSlugs[b.id]))[0];
  }

  const requiredSecrets = new Set<string>();
  const collectSecrets = (tools: string[]) => {
    for (const tool of tools) for (const key of toolEnvKeys(tool)) requiredSecrets.add(key);
  };
  for (const a of agents) collectSecrets(a.tools);
  for (const p of people) collectSecrets(p.tools);
  for (const s of skills) collectSecrets(s.tools);

  const files: PackageFile[] = [];

  // ── COMPANY.md ──────────────────────────────────────────────────────────
  const companyDoc = CompanyPackageDocSchema.parse({
    schema: 'agentcompanies/v1',
    kind: 'company',
    slug: COMPANY_SLUG,
    name: 'Founder OS',
    description: 'Personal operating system — an AI-agent company across six pillars.',
    version: '1.0.0',
    license: 'MIT',
    authors: [{ name: 'Alex Rivera' }],
    goals: [
      'Run sales, growth, tech, finance, comms, and client ops as one agent fleet.',
      ...departments.map((d) => `${d.name}: ${d.tagline}`),
    ],
    requirements: requiredSecrets.size ? { secrets: [...requiredSecrets].sort() } : undefined,
  });
  files.push({
    path: 'COMPANY.md',
    content: toFrontmatterDoc(companyDoc, [
      '# Founder OS',
      '',
      'Personal OS / AI agent command center, exported from the FounderOS board as a',
      'Paperclip-native Agent Company package. Six pillars — Sales, Marketing/Growth,',
      'TECH, Finances, Communications, Clients — each run by an agent fleet reporting',
      'up to Conductor, the broadcast & orchestration root.',
    ]),
  });

  // ── teams/<slug>/TEAM.md ────────────────────────────────────────────────
  for (const dept of departments) {
    const manager = deptManager(dept.id);
    if (!manager) continue; // no lead agent seeded for this pillar yet
    const includes = agents
      .filter((a) => a.departmentId === dept.id && a.id !== manager.id)
      .map((a) => `../../agents/${agentSlugs[a.id]}/AGENTS.md`);
    const teamDoc = TeamPackageDocSchema.parse({
      kind: 'team',
      slug: dept.slug,
      name: dept.name,
      description: dept.tagline || undefined,
      manager: `../../agents/${agentSlugs[manager.id]}/AGENTS.md`,
      includes: includes.length ? includes : undefined,
      tags: ['team', dept.slug],
    });
    files.push({
      path: `teams/${dept.slug}/TEAM.md`,
      content: toFrontmatterDoc(teamDoc, [`# ${dept.name}`, '', dept.tagline]),
    });
  }

  // ── agents/<slug>/AGENTS.md + sopTasks folded into each agent's body ────
  const sopByAssignee = new Map<string, SopTask[]>();
  for (const t of sopTasks) {
    const key = `${t.assigneeKind}:${t.assigneeId}`;
    const list = sopByAssignee.get(key) ?? [];
    list.push(t);
    sopByAssignee.set(key, list);
  }

  for (const a of agents) {
    const slug = agentSlugs[a.id];
    const dept = departments.find((d) => d.id === a.departmentId);
    const ownedSkills = skills.filter((s) => s.ownerAgentId === a.id).map((s) => skillSlugs[s.id]);
    const agentDoc = AgentPackageDocSchema.parse({
      kind: 'agent',
      slug,
      name: a.name,
      title: a.role || undefined,
      reportsTo: reportsTo(a),
      status: a.status,
      skills: ownedSkills.length ? ownedSkills : undefined,
      metadata: {
        founderos: {
          tier: a.tier,
          department: dept?.slug ?? null,
          model: a.model || undefined,
          instance: a.instance,
        },
      },
    });
    const sops = sopByAssignee.get(`agent:${a.id}`) ?? [];
    files.push({
      path: `agents/${slug}/AGENTS.md`,
      content: toFrontmatterDoc(agentDoc, [
        `# ${a.name}`,
        '',
        a.description || a.role,
        ...sops.flatMap(sopBody),
      ]),
    });
  }

  // People ride in as agents flagged `metadata.founderos.human: true` —
  // Paperclip's org tree is agent-only, and this keeps the tree complete
  // while letting an importer skip humans via the entity checkbox UI.
  for (const p of people) {
    const slug = personSlugs[p.id];
    const manager = deptManager(p.departmentId);
    const dept = departments.find((d) => d.id === p.departmentId);
    const agentDoc = AgentPackageDocSchema.parse({
      kind: 'agent',
      slug,
      name: p.name,
      title: p.role,
      reportsTo: manager ? agentSlugs[manager.id] : null,
      metadata: { founderos: { human: true, department: dept?.slug ?? null } },
    });
    const sops = sopByAssignee.get(`person:${p.id}`) ?? [];
    files.push({
      path: `agents/${slug}/AGENTS.md`,
      content: toFrontmatterDoc(agentDoc, [`# ${p.name}`, '', p.role, ...sops.flatMap(sopBody)]),
    });
  }

  // ── skills/<slug>/SKILL.md — kept in plain Agent Skills shape ───────────
  for (const s of skills) {
    const slug = skillSlugs[s.id];
    const skillDoc = SkillPackageDocSchema.parse({
      name: slug,
      description: s.description,
      metadata: {
        paperclip: { tags: [s.category.toLowerCase()] },
        founderos: { owner: s.ownerAgentId ? (agentSlugs[s.ownerAgentId] ?? null) : null, status: s.status },
      },
    });
    // s.markdown is already a full SKILL.md (its own frontmatter + body,
    // generated by lib/seed.ts's skillDoc()) — reuse its body rather than
    // nesting a second frontmatter block inside ours.
    files.push({ path: `skills/${slug}/SKILL.md`, content: toFrontmatterDoc(skillDoc, [skillBody(s)]) });
  }

  // ── projects/roadmap/PROJECT.md ──────────────────────────────────────────
  const projectDoc = ProjectPackageDocSchema.parse({
    kind: 'project',
    slug: 'roadmap',
    name: 'Founder OS Roadmap',
    description: 'Seed project grouping the standing SOPs every pillar runs today.',
    owner: agentSlugs[CONDUCTOR_ID],
  });
  files.push({
    path: 'projects/roadmap/PROJECT.md',
    content: toFrontmatterDoc(projectDoc, [
      '# Founder OS Roadmap',
      '',
      ...roadmap.map((r) => `- **${r.quarter}** [${r.status}] ${r.title} — ${r.description}`),
    ]),
  });

  // ── projects/roadmap/tasks/<slug>/TASK.md — one per SOP, all recurring ──
  for (const t of sopTasks) {
    const slug = taskSlugs[t.id];
    const assigneeSlug = t.assigneeKind === 'agent' ? agentSlugs[t.assigneeId] : personSlugs[t.assigneeId];
    if (!assigneeSlug) {
      throw new Error(`company-package: sop task "${t.id}" has unknown assignee "${t.assigneeId}"`);
    }
    const dept = departments.find((d) => d.id === t.departmentId);
    const taskDoc = TaskPackageDocSchema.parse({
      kind: 'task',
      slug,
      name: t.title,
      assignee: assigneeSlug,
      project: 'roadmap',
      recurring: true,
      metadata: { founderos: { department: dept?.slug ?? null } },
    });
    files.push({
      path: `projects/roadmap/tasks/${slug}/TASK.md`,
      content: toFrontmatterDoc(taskDoc, [t.summary, '', ...numberedSteps(t.steps)]),
    });
  }

  // ── .paperclip.yaml — adapter config, env inputs, routine triggers ─────
  const sidecarAgents: Record<string, PaperclipAgentExtension> = {};
  for (const a of agents) {
    const envKeys = [...new Set(a.tools.flatMap(toolEnvKeys))];
    const env = envKeys.length
      ? Object.fromEntries(
          envKeys.map((key) => [
            key,
            {
              kind: 'secret' as const,
              requirement: (a.status === 'active' ? 'required' : 'optional') as 'required' | 'optional',
            },
          ]),
        )
      : undefined;
    sidecarAgents[agentSlugs[a.id]] = {
      adapter: {
        type: a.instance === 'builtin' ? 'claude_local' : 'openclaw',
        config: a.instance === 'builtin' ? undefined : { instance: a.instance },
      },
      inputs: env ? { env } : undefined,
    };
  }

  const sidecarRoutines: Record<string, PaperclipRoutine> = {};
  for (const t of sopTasks) {
    if (t.assigneeKind !== 'agent') continue;
    const crons = db.agentCrons.byAgent(t.assigneeId);
    if (!crons.length) continue;
    sidecarRoutines[taskSlugs[t.id]] = {
      triggers: crons.map((c) => ({ kind: 'schedule' as const, cronExpression: c.schedule })),
    };
  }

  const sidecar = PaperclipSidecarSchema.parse({
    schema: 'paperclip/v1',
    agents: Object.keys(sidecarAgents).length ? sidecarAgents : undefined,
    routines: Object.keys(sidecarRoutines).length ? sidecarRoutines : undefined,
  });
  files.push({ path: '.paperclip.yaml', content: toYamlDocument(sidecar) });

  return {
    files: files.sort((x, y) => x.path.localeCompare(y.path)),
    slugs: {
      departments: deptSlugs,
      agents: agentSlugs,
      people: personSlugs,
      skills: skillSlugs,
      sopTasks: taskSlugs,
    },
  };
}
