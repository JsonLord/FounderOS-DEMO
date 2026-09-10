---
name: "open-source-capability-evaluation"
description: "Evaluate external repositories as optional capabilities before adding them to the Founder OS stack."
metadata:
  paperclip:
    tags: ["open-source", "tools", "security", "architecture"]
  founderos:
    owner: "stack-monitor"
    source: "transcript_06.txt; transcript_08.txt; transcript_05.txt; transcript_09.txt"
---

# Open-source capability evaluation

## Outcome
A documented ADOPT / PILOT / WATCH / REJECT recommendation for an external repository.

## Review
Confirm exact upstream identity; license; maintenance/activity; scope and dependencies; data/secrets handled; permissions; network/browser access; deployment burden; costs of external APIs; failure/rollback path; overlap with current stack; and the concrete Founder OS job it improves.

Inspect README/docs and relevant code/config before installation when the capability is high-impact. Prefer an optional adapter over vendor lock-in.

## Rules
Do not import a repository based only on a video name that cannot be uniquely identified. Do not enable stealth, access-control bypass, CAPTCHA circumvention or other behavior merely because a browser tool supports it.