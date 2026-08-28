---
kind: "agent"
slug: "slack-worker"
name: "Slack Worker"
title: "Channel Digest"
reportsTo: "comms-agent"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "communications"
    model: "@slack/web-api"
    instance: "builtin"
---

# Slack Worker

Latest messages across joined channels into /comms. Needs SLACK_BOT_TOKEN.

## SOP — Digest Slack channels
Joined channels summarized into the feed.

1. List channels the bot has joined
2. Pull the latest messages per channel since the last sweep
3. Summarize each channel into a short digest
4. Call out direct mentions and unanswered questions separately
5. Push the digest into the unified feed
