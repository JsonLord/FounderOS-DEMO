---
name: "sales-second-brain"
description: "Maintain a compounding, source-aware sales intelligence layer that agents and dashboards can reliably act on."
metadata:
  paperclip:
    tags: ["sales", "knowledge", "crm", "intelligence"]
  founderos:
    owner: "evidence-steward"
    source: "transcript_04.txt"
---

# Sales second brain

## Outcome
Current canonical sales context for prospects, deals, calls, campaigns, ICP, offer, positioning and process, with source links and freshness.

## Operating model
Raw sales tools remain systems of record. Reconcile relevant changes into markdown/context records; do not dump everything. Skills and dashboards read the canonical layer, and completed actions feed back into it.

## Required routines
- Morning reconciliation and call preparation.
- CRM/proposal/source synchronization and hygiene.
- Stale/conflicting deal detection.
- Campaign and call learning.
- Periodic sales synthesis.

## Rule
Context should compound, but stale context is dangerous. Record last-verified time and flag contradictions rather than silently merging them.