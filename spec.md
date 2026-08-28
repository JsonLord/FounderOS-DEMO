# SPEC — FounderOS → Paperclip Native Company Package

Status: **P1 + P2 implemented** · Owner: FounderOS · Target format: `agentcompanies/v1`
(Paperclip [Agent Companies Specification](https://github.com/jsonlord/paperclip/blob/master/docs/companies/companies-spec.md))

## 0. What this is

Adapt **FounderOS-DEMO** so its live org — the five (six) pillars, the ~30
agents, the people, the skills, and the per-role SOPs — can be exported as a
**Paperclip-native Agent Company package** and imported into Paperclip as a
real company setup.

Today FounderOS is a self-contained Next.js console whose data flows through a
repository layer (`lib/db.ts`, seeded by `lib/seed.ts`). Paperclip is an
open-source control plane for AI-agent companies that ingests companies in two
ways:

1. **Markdown-first package import** (primary) — a folder/repo of `COMPANY.md`,
   `TEAM.md`, `AGENTS.md`, `PROJECT.md`, `TASK.md`, `SKILL.md` plus an optional
   `.paperclip.yaml` sidecar, imported via `POST /api/companies/import` or the
   `paperclipai company import <path|url>` CLI.
2. **Programmatic setup API** (fallback) — the bootstrap sequence in Paperclip's
   `doc/API.md` (`POST /api/companies` → `/goals` → `/agents` → `/projects` →
   `/issues` → budgets → wakeup).

This spec defines the entity mapping, the emitted package layout, the new
FounderOS code that produces it, and the import path on the Paperclip side. The
package format is the contract; the two import methods are alternative
consumers of the same generated data.

> **Assumption.** The request ("import b…") is read as *import the FounderOS
> board into Paperclip as a native company*. If the intent was a one-way
> programmatic push instead of a portable package, §7.2 covers that path and
> the same mapping (§3) still holds.

## 1. Design rules (carried from FounderOS)

FounderOS's load-bearing rule — **larp-first, real-ready, everything through
the repo layer** — is preserved. The exporter is a *reader* over the existing
repos. It never queries SQLite directly and never invents "connected" state.

- New data path = new repo method + Zod schema + seed entry + test. The
  exporter adds **no** new tables; it only reads.
- TDD: failing test first (`tests/company-package.test.ts`), then the module.
- Zod-validate the emitted package shape on the way out, mirroring the way
  `lib/schemas.ts` validates rows on the way out of the DB.
- Secrets are **never** emitted. Credential *names* may be declared as required
  inputs; values stay in `.env.local` / Alex's canonical files (see
  `lib/creds.ts`). This matches Paperclip's export rule "omit secret values".
- Honest status only. A `planned` agent or a `needs-config` connector exports as
  such; nothing is upgraded to "active" for the package.

## 2. Target package layout

The exporter writes a self-contained package tree to **`company-package/` at
the repo root — committed, not `.gitignored`.** This is deliberate, not an
oversight: `sources[]`/`includes` in the spec resolve `repo + ref + path`, and
Paperclip's own CLI resolves a GitHub source the same way (`paperclipai
company import owner/repo/path --ref <branch>`, or a `github.com/...` URL
with a `?path=` query param — see `cli/src/commands/client/company.ts` in the
Paperclip repo). None of that works unless `COMPANY.md` actually lives in the
git tree; a build artifact that only exists locally or behind the live API
route is invisible to a GitHub-native import. `tests/company-package-sync.test.ts`
is the tripwire — `npm test` fails if `company-package/` drifts from what
`buildCompanyPackage` generates from the current seed, so `npm run
export:company` has to be re-run and the diff committed whenever
agents/skills/SOPs/departments change (the same discipline `npm run seed`
would need if `data/founder-os.db` were committed — it isn't, but this is,
because portability is the whole point here). The live `GET
/api/company-package` route (JSON manifest, or `?format=zip` for a
downloadable archive) still builds on demand from the DB and is unaffected —
it's for pulling the package out of a *running* FounderOS instance, which is
a different use case from GitHub-native import.

```text
founder-os/
├── COMPANY.md                      # root: company identity, goals, requirements
├── .paperclip.yaml                 # vendor sidecar: adapters, env inputs, routines
├── README.md                       # generated overview + Mermaid org chart
├── teams/
│   ├── sales/TEAM.md
│   ├── marketing-growth/TEAM.md
│   ├── tech/TEAM.md
│   ├── finances/TEAM.md
│   ├── communications/TEAM.md
│   └── clients/TEAM.md
├── agents/
│   ├── conductor/AGENTS.md         # 1 file per seeded agent (~30)
│   ├── comms-agent/AGENTS.md
│   ├── gmail-worker/AGENTS.md
│   └── …
├── skills/
│   ├── cold-outbound/SKILL.md      # 1 file per seeded skill (Agent Skills shape)
│   ├── reply-qualification/SKILL.md
│   └── …
└── projects/
    └── roadmap/
        ├── PROJECT.md              # from lib/seed.ts roadmap
        └── tasks/
            ├── broadcast-directives/TASK.md   # SOPs → recurring starter tasks
            └── …
```

Rules from the spec that this layout honors:

- Only markdown files are canonical content; `assets/`/`scripts/` allowed but
  unused for v1.
- Slugs and relative paths are the portable identity layer — **not** FounderOS's
  `dept-*` / `person-*` DB ids (§4).
- `.paperclip.yaml` is a sidecar; the base package must read correctly without it.

## 3. Entity mapping

FounderOS repo (`lib/db.ts`) → Agent Companies v1 package.

| FounderOS source | Package artifact | Notes |
|---|---|---|
| *(synthesized)* company identity | `COMPANY.md` | name **Founder OS**, slug `founder-os`, `schema: agentcompanies/v1`, `goals` from mission, `requirements.secrets` = union of connector cred names (§6). |
| `departments` (6 pillars) | `teams/<slug>/TEAM.md` | `slug` reused (`sales`, `tech`, …); `tagline` → `description`; `manager` → the pillar's lead agent (the `tier: 'lead'`, `parentId: null` row for that dept). |
| `agents` (`tier: lead`) | `agents/<slug>/AGENTS.md` | `reportsTo: conductor` (the org root super-agent); pillar leads are the team `manager`. |
| `agents` (`tier: worker`) | `agents/<slug>/AGENTS.md` | `reportsTo` = slug of `parentId` agent. |
| `agents[].role`/`.description` + matching `sopTasks` body | `AGENTS.md` **body** | Canonical instruction content = role + description + the SOP `summary`/`steps` for that agent, rendered as markdown. |
| `agents[].tools` | `AGENTS.md` frontmatter `skills` **and** `.paperclip.yaml` inputs | Tool → skill shortname where a skill owns it; raw connector tools become env-input declarations (§6). |
| `agents[].model`/`.instance` | `.paperclip.yaml` `agents.<slug>.adapter` | `instance: builtin` → placeholder adapter; real host bindings map to adapter type/config. Never a secret. |
| `people` (Marco, Nadia, Mia, Dana, Rae) | `agents/<slug>/AGENTS.md` | Exported as agents with `metadata.founderos.human: true` and `reportsTo` = pillar lead. Paperclip is agent-only; humans ride in as flagged agents so the org tree stays complete. Importer may skip them (checkbox). |
| `skills` (12 seeded, with `markdown`) | `skills/<slug>/SKILL.md` | Already Agent-Skills-shaped: `name`, `description`, body = `markdown`; `metadata.paperclip.tags` from `category`; `ownerAgentId` recorded in `metadata`. |
| `sopTasks` (one per agent/person) | `projects/roadmap/tasks/<slug>/TASK.md` | `recurring: true`; `assignee` = agent slug; body = `summary` + numbered `steps`; `project: roadmap`. |
| `roadmap` / `phases` | `projects/roadmap/PROJECT.md` + `COMPANY.md` `goals` | Roadmap items become the seed project; quarter/status ride in `metadata`. |
| `agentCrons` | `.paperclip.yaml` `routines.<task>.triggers` | Schedule fidelity for recurring SOP tasks (cron + timezone). |
| `tools` registry, `metrics`, `funnel`, `social`, … | *(not exported)* | Runtime/telemetry, out of scope for a portable company definition. |

### 3.1 Slug derivation

- Departments/agents/skills already carry human slugs or kebab-able names.
  Canonical rule: `slug = kebab-case(name)`, de-duplicated, URL-safe, stable.
- Strip FounderOS id prefixes: `dept-tech` → team `tech`; `person-marco` →
  agent `marco`; `sop-conductor` → task `broadcast-directives` (from title).
- Maintain an explicit `id → slug` map inside the exporter and assert
  uniqueness in tests so re-seeds stay deterministic.

### 3.2 Org root

Seeded pillar leads all have `parentId: null`. Paperclip wants a single org
root (a CEO/root agent). **Conductor** is that root: it already owns
broadcast/orchestration across the fleet. Export sets every pillar lead's
`reportsTo: conductor`, and Conductor's `reportsTo: null`. The human operator
(Alex) is represented as `COMPANY.md` ownership/authorship, not an agent row.

## 4. File contracts (concrete)

### COMPANY.md

```yaml
---
schema: agentcompanies/v1
kind: company
slug: founder-os
name: Founder OS
description: Personal operating system — an AI-agent company across six pillars.
version: 1.0.0
license: MIT
authors:
  - name: Alex Rivera
goals:
  - Run sales, growth, tech, finance, comms, and client ops as one agent fleet.
requirements:
  secrets:
    - ZERNIO_API_KEY
    - ATTIO_API_KEY
    - STRIPE_API_KEY
    # …union of connector cred names, honest per lib/connectors/*
---
```

Body: short company overview (pillars, operator console, G-Brain memory).

### teams/tech/TEAM.md

```yaml
---
kind: team
slug: tech
name: TECH
description: AI & automations · G-Brain.
manager: ../../agents/conductor/AGENTS.md
includes:
  - ../../agents/data-agent/AGENTS.md
  - ../../agents/markdown-auditor/AGENTS.md
  # … worker agents in this pillar
---
```

### agents/gmail-worker/AGENTS.md

```yaml
---
kind: agent
slug: gmail-worker
name: Gmail Worker
title: IMAP Inboxes ×4
reportsTo: comms-agent
status: planned
skills:
  - inbox-triage
metadata:
  founderos:
    tier: worker
    department: communications
---

Pulls unread counts and recent mail from up to four IMAP inboxes into /comms.

## SOP — Triage the four inboxes
1. …   # from the matching sopTasks.steps
```

### skills/inbox-triage/SKILL.md — verbatim Agent Skills shape

```yaml
---
name: inbox-triage
description: Sorts the four inboxes into work / personal / misc and flags priority.
metadata:
  paperclip:
    tags: [ops]
  founderos:
    owner: gmail-worker
---
```

Body = the seeded skill `markdown`. **Do not** add Paperclip-required top-level
fields — `SKILL.md` stays owned by the Agent Skills spec.

### projects/roadmap/tasks/broadcast-directives/TASK.md

```yaml
---
kind: task
slug: broadcast-directives
name: Broadcast directives across the fleet
assignee: conductor
project: roadmap
recurring: true
---

One message in, every agent briefed, replies collected.

1. Receive the directive from the operator console
2. …
```

## 5. `.paperclip.yaml` sidecar

Vendor fidelity that must not pollute the base package:

```yaml
schema: paperclip/v1
agents:
  conductor:
    adapter:
      type: openclaw          # or claude_local for builtin fan-out
      config: {}
    inputs:
      env:
        OPENCLAW_HOST:
          kind: plain
          requirement: optional
routines:
  broadcast-directives:
    triggers:
      - kind: schedule
        cronExpression: "*/5 * * * *"   # from agentCrons when present
        timezone: America/Chicago
```

Export rules honored: no `secretId`/`type: secret_ref`; env inputs as portable
`required`/`optional` declarations; warn on absolute paths; omit
empty/default fields.

## 6. Secrets & connector inputs

`requirements.secrets` (COMPANY.md) and `.paperclip.yaml` `inputs.env` are
built from `lib/connectors/*` and `lib/creds.ts` — by **name only**. Rules:

- Emit the credential's env-var name and whether the connector treats it as
  required vs optional (from each connector's honest `ConnectorStatus`).
- Never read or emit a value. Never copy from `~/knowledge/.env.agents`,
  `~/.config/*`, or `.env.local`.
- A `LIVE` connector still exports its key as a required input — the package is
  portable, so the importer supplies its own credentials.

## 7. Import into Paperclip

### 7.1 Markdown package import (primary)

1. From a local clone: `paperclipai company import ./company-package`.
   Directly from GitHub, no clone needed:
   `paperclipai company import JsonLord/FounderOS-DEMO/company-package --ref main`
   (or the equivalent `POST /api/companies/import/preview` then `POST
   /api/companies/import`, pointing at the same repo + ref + path).
2. Paperclip builds the import graph from `COMPANY.md` → teams → agents →
   projects → tasks → skills, renders the tree with entity-level checkboxes,
   and applies collision strategy.
3. `.paperclip.yaml` supplies adapter/routine fidelity; unknown extension keys
   are ignored per spec.

Mapping on the Paperclip side (from its `companies-spec.md` §19): `COMPANY.md`
→ company metadata, `TEAM.md` → org subtree, `AGENTS.md` → agent identity +
instructions, `TASK.md` (`recurring: true`) → recurring task template,
`SKILL.md` → imported skill.

### 7.2 Programmatic setup API (fallback)

For environments driving the REST bootstrap directly, the same exporter model
feeds the sequence in Paperclip `doc/API.md`:

| Order | Endpoint | Fed from |
|---|---|---|
| Company | `POST /api/companies` | `COMPANY.md` |
| Secrets | `POST /api/companies/:id/secrets` | operator-supplied (names from `requirements.secrets`) |
| Goals | `POST /api/companies/:id/goals` | `COMPANY.md` `goals` |
| Agents | `POST /api/companies/:id/agents` | `agents/*` with `reportsTo` resolved to created ids (parents first) |
| Projects | `POST /api/companies/:id/projects` | `projects/roadmap/PROJECT.md` |
| Issues | `POST /api/companies/:id/issues` | `TASK.md` files (recurring → routine) |

Agents must be created parents-first so `reportsTo` resolves; the exporter emits
a topologically ordered agent list to make this trivial.

## 8. New code in FounderOS

All additive, all through the repo layer. **Shipped:**

- `lib/company-package.ts` — pure builder. Input: `FounderDb` repos. Output: an
  in-memory package model (`{ files: PackageFile[] }`) plus the `id → slug` map.
  No fs, no DB, no fetch, no env reads — unit-testable in `:memory:`.
- `lib/yaml.ts` — dependency-free YAML frontmatter emitter (`toFrontmatterDoc`,
  `toYamlDocument`) the builder serializes through.
- `lib/zip.ts` — dependency-free ZIP (store method) writer, timestamps pinned
  to the MS-DOS epoch instead of the real build time.
- `lib/schemas.ts` — Zod schemas for the emitted frontmatter shapes
  (`CompanyPackageDocSchema`, `TeamPackageDocSchema`, `AgentPackageDocSchema`,
  `ProjectPackageDocSchema`, `TaskPackageDocSchema`, `SkillPackageDocSchema`,
  `PaperclipSidecarSchema`). Every emitted doc is parsed against its schema
  before it's serialized.
- `scripts/export-company.ts` + `npm run export:company` — writes the tree to
  `company-package/` at the repo root. Not idempotent-and-forgettable like
  `npm run seed`: the output is committed, so re-run it and `git add
  company-package && git commit` whenever the seeded org changes.
- `app/api/company-package/route.ts` — `GET` returns the file manifest as
  JSON; `?format=zip` streams a downloadable archive, built on demand from
  the DB (not from the committed directory). Reads through `getDb()` repos
  only; registered in the route smoke test.

**Not yet shipped (P3):** the generated `README.md` + Mermaid org chart, and a
verified round-trip import into a local Paperclip instance.

## 9. Test plan (TDD)

`tests/company-package.test.ts`, `FOUNDER_OS_DB=:memory:` pattern:

1. **Coverage** — every `agents` row and every `people` row yields exactly one
   `AGENTS.md`; every `skills` row → one `SKILL.md`; every `sopTasks` row →
   one `TASK.md`. (Mirrors the existing `seed.test.ts` 1:1 invariants.)
2. **Org integrity** — every `reportsTo` resolves to an emitted agent slug;
   Conductor is the unique root; no cycles.
3. **Slugs** — unique, URL-safe, stable across two builds from the same seed.
4. **Schema** — all emitted frontmatter passes the new Zod schemas; parsing a
   round-trip of the YAML reproduces the model.
5. **Secrets** — assert no credential value from `lib/creds.ts` / env appears
   anywhere in the emitted bytes; only names appear.
6. **Spec conformance** — `SKILL.md` files carry no Paperclip-required
   top-level field; `.paperclip.yaml` omits `secretId`/`secret_ref`.
7. **Committed-copy sync** (`tests/company-package-sync.test.ts`) — every file
   `buildCompanyPackage` generates exists under `company-package/` with
   byte-identical content, and `company-package/` has no orphaned files the
   builder no longer generates. This is what makes GitHub-native import
   trustworthy: without it, the committed directory could silently drift
   from the seeded org and nobody would notice until an import failed.

`npm test && npm run typecheck` must stay green before hand-off. Implemented
in `tests/company-package.test.ts` (coverage, org integrity, slug stability,
spec conformance, secrets-never-leak), plus `tests/yaml.test.ts` and
`tests/zip.test.ts` for the two serialization helpers.

## 10. Phasing

- **P1 — done.** Builder + schemas + tests + `export:company` script (offline
  package, no API). Ships the contract.
- **P2 — done.** `GET /api/company-package` route + ZIP stream.
- **P3 — open.** README/Mermaid generator, and a verified round-trip: import
  the emitted package into a local Paperclip (`pnpm dev`,
  `paperclipai company import`), recorded in `docs/`.

## 11. Out of scope (v1)

Runtime telemetry (`metrics`, `funnel`, `social`, `agentRuns`), live connector
state, and any secret material. The package describes the *company* — org,
agents, skills, recurring work — not FounderOS's dashboards.
