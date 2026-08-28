---
kind: "agent"
slug: "payments-pulse"
name: "Payments Pulse"
title: "Processor Monitor"
reportsTo: "conductor"
status: "planned"
metadata:
  founderos:
    tier: "lead"
    department: "finances"
    model: "stripe sdk"
    instance: "builtin"
---

# Payments Pulse

Stripe balance + recent charges; PayPal/Square/Whop registered and awaiting keys.

## SOP — Watch processor health
Every processor pinged, status recorded honestly.

1. Ping each processor registered in the registry
2. Record honest ConnectorStatus, never fake connected
3. Alert Finances when a processor goes down
4. Re-check failed processors on a tighter cadence until they recover
5. Keep the uptime history for the analytics view
