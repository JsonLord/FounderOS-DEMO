---
kind: "agent"
slug: "sales-calls-data"
name: "Sales Calls Data"
title: "Call Intelligence"
reportsTo: "sales-agent"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "sales"
    model: "fathom + crm"
    instance: "builtin"
---

# Sales Calls Data

Sales calls data lane for recordings, notes, outcomes, and follow-up context.

## SOP — Mine sales-call recordings
Every Fathom call becomes CRM intelligence.

1. Ingest Fathom notes after each recorded call
2. Extract objections, commitments and next steps
3. Write the extract back to the Attio record
4. Tag calls where pricing or competitors came up
5. Feed recurring patterns into the pipeline brief
