---
kind: "task"
slug: "digest-slack-channels"
name: "Digest Slack channels"
assignee: "slack-worker"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "communications"
---

Joined channels summarized into the feed.

1. List channels the bot has joined
2. Pull the latest messages per channel since the last sweep
3. Summarize each channel into a short digest
4. Call out direct mentions and unanswered questions separately
5. Push the digest into the unified feed
