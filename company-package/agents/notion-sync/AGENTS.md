---
kind: "agent"
slug: "notion-sync"
name: "Notion Sync"
title: "Workspace Reader"
reportsTo: "data-agent"
status: "planned"
metadata:
  founderos:
    tier: "specialist"
    department: "tech"
    model: "@notionhq/client"
    instance: "builtin"
---

# Notion Sync

Recently edited pages shared with the integration. Needs NOTION_API_KEY.

## SOP — Mirror the Notion workspace
Shared pages flow into the knowledge core.

1. List pages shared with the integration token
2. Diff each page against the last synced version
3. Pull changed blocks and normalize to markdown
4. Index the fresh content into the knowledge core
5. Record the sync watermark so the next run only pulls deltas
