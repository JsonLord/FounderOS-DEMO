---
kind: "agent"
slug: "gmail-worker"
name: "Gmail Worker"
title: "IMAP Inboxes ×4"
reportsTo: "comms-agent"
status: "planned"
skills:
  - "inbox-triage"
metadata:
  founderos:
    tier: "worker"
    department: "communications"
    model: "imapflow"
    instance: "builtin"
---

# Gmail Worker

Pulls unread counts and recent mail from up to four IMAP inboxes into /comms. Activates when INBOX_* creds land.

## SOP — Triage the four Gmail inboxes
IMAP slots 1–4 read, classified, escalated.

1. Connect the four configured IMAP inboxes on the sync cadence
2. Pull unread counts and every thread newer than the last sweep
3. Classify each thread: urgent, reply-needed, waiting-on-us, FYI
4. Draft suggested replies for reply-needed threads in Alex voice
5. Hand urgent threads to the escalation queue with a one-line summary
6. Surface anything from a client domain to the Clients pillar too
