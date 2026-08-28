---
kind: "task"
slug: "audit-the-vector-index"
name: "Audit the vector index"
assignee: "vector-auditor"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "tech"
---

Embeddings in Supabase must mirror brain-store.

1. Ping the Supabase Second Brain project (free tier pauses on idle)
2. Wake the database and wait until it accepts queries before comparing
3. Compare pgvector chunk counts against brain-store files
4. Flag drift and paused-tier warnings on the /brain doctor card
5. Trigger ZeroEntropy re-embeds for drifted documents and verify counts after
