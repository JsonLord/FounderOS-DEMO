---
kind: "agent"
slug: "vector-auditor"
name: "Vector Auditor"
title: "pgvector / Supabase Health"
reportsTo: "data-agent"
status: "active"
metadata:
  founderos:
    tier: "worker"
    department: "tech"
    model: "gbrain doctor"
    instance: "builtin"
---

# Vector Auditor

Runs gbrain doctor: connection to Supabase pgvector, embedding checks, health score. Works today.

## SOP — Audit the vector index
Embeddings in Supabase must mirror brain-store.

1. Ping the Supabase Second Brain project (free tier pauses on idle)
2. Wake the database and wait until it accepts queries before comparing
3. Compare pgvector chunk counts against brain-store files
4. Flag drift and paused-tier warnings on the /brain doctor card
5. Trigger ZeroEntropy re-embeds for drifted documents and verify counts after
