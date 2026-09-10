---
name: "browser-capability-routing"
description: "Use an interactive browser only when the job requires browser state/interaction; prefer simpler fetch/API paths and serialize shared browser work."
metadata:
  paperclip:
    tags: ["browser", "automation", "research", "capabilities"]
  founderos:
    owner: "stack-monitor"
    source: "browser-use/browser-harness SKILL.md (external repo referenced by transcript_06.txt)"
---

# Browser capability routing

## Outcome
Choose the least-privileged, lowest-complexity web capability that can complete the authorized job.

## Routing
1. Use API/connector/plain fetch for public data when interaction is unnecessary.
2. Escalate to browser control only for interaction, JS-rendered state, an authorized logged-in session, or a flow that cannot be inspected otherwise.
3. Before a site-specific browser job, load any approved domain-specific operating guidance rather than improvising brittle selectors/flows.
4. Treat a local browser as a shared mutable lane; serialize agent interactions unless isolated sessions are explicitly provisioned.
5. Verify each consequential action from resulting page state, not from a click command succeeding.
6. Stop at login/MFA/consent/account ambiguity unless the run's authorization explicitly covers the step.

## Guardrails
Browser access can expose private session state. Never infer permission to submit transactions, send messages, create accounts, bypass access controls/CAPTCHAs, or collect restricted data. Keep logs and close task-created state when appropriate.