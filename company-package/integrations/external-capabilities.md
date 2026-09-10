# External capability evaluations from transcript sources

External repositories are optional capabilities, not automatic dependencies. Evaluate them with `open-source-capability-evaluation` before installation and re-check the upstream when a pilot begins.

## Browser Use / Browser Harness — PILOT

Source transcript: `transcript_06.txt`.

Verified upstream: https://github.com/browser-use/browser-harness

Repository inspection shows an MIT-licensed Python browser-agent harness designed to connect an LLM to a real browser over CDP. Its README describes an agent workflow that can add reusable local helpers while working, ships a `SKILL.md`, and exposes browser control through an MCP server.

Potential Founder OS jobs: permissioned web research, repetitive browser QA of fake doors, verifying public web flows, gathering structured evidence from sites that permit it, and executing operator-authorized browser tasks that lack APIs.

Risk/guardrails: browser access may expose logged-in sessions and private data. Do not enable stealth, CAPTCHA bypass, access-control circumvention, bulk scraping contrary to site rules, or unapproved transactions/account changes. Prefer API/connectors where available. Pilot in a restricted profile/workspace with explicit task scope and logs.

## OpenSEO — PILOT

Source transcript: `transcript_08.txt`.

Verified upstream: https://github.com/every-app/open-seo

Repository inspection describes OpenSEO as an open-source alternative to Semrush/Ahrefs with agent-oriented MCP and skills. Listed workflows include keyword research, rank tracking, competitor insights, backlinks, site audits and AI visibility. Its self-hosted mode depends on a DataForSEO API key; Docker and Cloudflare deployment paths are documented.

Potential Founder OS jobs: ground search-demand hypotheses in current keyword data, analyze competitor ranking pages/backlinks, run site audits and feed SEO experiment results into GTM evidence.

Risk/guardrails: external data has cost and freshness limits; search volume does not prove willingness to pay. Keep DataForSEO/API spend budgeted, preserve query/source metadata, and connect SEO outputs to qualified actions/customers rather than traffic alone.

## Gogh design-judgment vault — PILOT / ADVISORY

Source transcript: `transcript_05.txt`.

Verified upstream: https://github.com/AgriciDaniel/gogh

Repository inspection confirms an Apache-2.0 source-cited Obsidian operating brain for six frontend design skills. Gogh's own documentation treats the six skills as different mechanisms rather than interchangeable prompts, keeps dated source evidence in a ledger, preserves conflicts instead of hiding them, keeps raw source captures immutable, and uses explicit maturity/audit gates.

Two particularly useful patterns are adopted into Founder OS's local `design-judgment-stack`: make a written aesthetic-direction commitment before implementation, and run a distinctiveness gate after mechanical quality checks so a compliant but generic page does not pass merely because it has no obvious defects.

Potential Founder OS jobs: advise fake-door and landing-page direction, select appropriate design mechanisms for a brief, preserve source attribution and conflicts across design rules, provide pre-flight/audit discipline, and help agents avoid generic template-like output before a market experiment is launched.

Risk/guardrails: Gogh is advisory and should not become a hidden dependency for validation. Its practitioner findings, versioned rule claims and design heuristics must retain their provenance and freshness state. Do not import private venture/customer data or credentials into an external vault without explicit approval. Design quality remains separate from customer-demand evidence.

## Frontend design skill mentioned in CRM video — UNRESOLVED REPOSITORY

Source transcript: `transcript_09.txt`.

The transcript says the author installs a GitHub frontend-design skill but does not provide a unique repository name or URL. Search surfaces multiple plausible repositories, so Founder OS does not guess. The general principle—use curated design judgment and review generated UI—is integrated without a dependency.