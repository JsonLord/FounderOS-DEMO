---
kind: "task"
slug: "watch-the-local-stack"
name: "Watch the local stack"
assignee: "stack-monitor"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "tech"
---

Honest status for every port, session and binary.

1. Probe ports 4000 / 3789 / 11434 / 18789
2. Check tmux sessions and required brew binaries
3. Record honest ConnectorStatus, never fake connected
4. Compare against the last sweep to catch flapping services
5. Alert the console when something that was up goes down
