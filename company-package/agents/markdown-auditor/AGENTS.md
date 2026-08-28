---
kind: "agent"
slug: "markdown-auditor"
name: "Markdown Auditor"
title: "brain-store Health"
reportsTo: "data-agent"
status: "active"
metadata:
  founderos:
    tier: "worker"
    department: "tech"
    model: "fs walk"
    instance: "builtin"
---

# Markdown Auditor

Walks the markdown brain-store: page counts per folder, strays at the root, empty folders. Works today.

## SOP — Audit brain-store markdown health
Keep the knowledge base clean and linkable.

1. Walk every markdown file in knowledge/brain-store
2. Flag broken wiki-links, orphan notes and stale frontmatter
3. Check generated org docs still match the live agents, SOPs and tools
4. Write the health report with per-folder scores
5. Queue fix-ups for the worst offenders and track them to done
