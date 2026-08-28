---
kind: "task"
slug: "mirror-the-notion-workspace"
name: "Mirror the Notion workspace"
assignee: "notion-sync"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "tech"
---

Shared pages flow into the knowledge core.

1. List pages shared with the integration token
2. Diff each page against the last synced version
3. Pull changed blocks and normalize to markdown
4. Index the fresh content into the knowledge core
5. Record the sync watermark so the next run only pulls deltas
