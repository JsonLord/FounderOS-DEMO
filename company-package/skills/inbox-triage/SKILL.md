---
name: "inbox-triage"
description: "Sorts the four inboxes into work / personal / misc and flags priority."
metadata:
  paperclip:
    tags:
      - "ops"
  founderos:
    owner: "gmail-worker"
    status: "live"
---

# Inbox triage

Sorts the four inboxes into work / personal / misc and flags priority.

## When to use
Reach for this when the ops flow needs to inbox triage. It runs on `gmail`.

## Status
Live in production. The owning agent runs this today.

