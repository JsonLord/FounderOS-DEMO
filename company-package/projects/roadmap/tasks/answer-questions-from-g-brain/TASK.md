---
kind: "task"
slug: "answer-questions-from-g-brain"
name: "Answer questions from G-Brain"
assignee: "data-agent"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "tech"
---

Hybrid search over the second brain, honest fallbacks.

1. Parse the incoming question into a gbrain query
2. Run gbrain hybrid search (--no-expand) against Supabase
3. Fall back to local brain-store grep when the database is paused
4. Rank passages and keep only the ones that actually answer the question
5. Return cited passages with their source notes, never invented ones
6. Log unanswerable questions as gaps for the Markdown Auditor to fill
