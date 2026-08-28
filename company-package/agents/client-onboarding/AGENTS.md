---
kind: "agent"
slug: "client-onboarding"
name: "Onboarding Agent"
title: "Closed-Won to Kickoff"
reportsTo: "client-roster"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "clients"
    model: "attio + slack + notion"
    instance: "builtin"
---

# Onboarding Agent

Runs the onboarding SOP end to end when a deal closes: welcome pack, workspace setup, kickoff booked, handoff notes.

## SOP — Onboard new clients
Closed-won to kickoff without a dropped step.

1. Trigger when a deal moves to closed-won in Attio
2. Verify payment landed with Processor Confirm before anything ships
3. Send the welcome pack and countersigned agreement within 24 hours
4. Create their Slack channel, invite the client team, pin the scope doc
5. Spin up the Notion workspace from the client template
6. Book the kickoff call inside 5 business days and confirm attendance
7. Collect access and assets (logins, brand kit, tracking) in one request
8. Hand to Client Success with full context notes and the risk flags
