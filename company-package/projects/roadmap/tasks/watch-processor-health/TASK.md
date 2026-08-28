---
kind: "task"
slug: "watch-processor-health"
name: "Watch processor health"
assignee: "payments-pulse"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "finances"
---

Every processor pinged, status recorded honestly.

1. Ping each processor registered in the registry
2. Record honest ConnectorStatus, never fake connected
3. Alert Finances when a processor goes down
4. Re-check failed processors on a tighter cadence until they recover
5. Keep the uptime history for the analytics view
