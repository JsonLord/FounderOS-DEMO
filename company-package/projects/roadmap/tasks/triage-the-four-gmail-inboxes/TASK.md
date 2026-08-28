---
kind: "task"
slug: "triage-the-four-gmail-inboxes"
name: "Triage the four Gmail inboxes"
assignee: "gmail-worker"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "communications"
---

IMAP slots 1–4 read, classified, escalated.

1. Connect the four configured IMAP inboxes on the sync cadence
2. Pull unread counts and every thread newer than the last sweep
3. Classify each thread: urgent, reply-needed, waiting-on-us, FYI
4. Draft suggested replies for reply-needed threads in Alex voice
5. Hand urgent threads to the escalation queue with a one-line summary
6. Surface anything from a client domain to the Clients pillar too
