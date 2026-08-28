---
kind: "agent"
slug: "stack-monitor"
name: "Stack Monitor"
title: "Local Stack Health"
reportsTo: "conductor"
status: "active"
metadata:
  founderos:
    tier: "lead"
    department: "tech"
    model: "local checks"
    instance: "builtin"
---

# Stack Monitor

Remotion, Ollama, command-center, OpenClaw, tmux, whisper, ffmpeg, higgsfield, gh + Wispr Flow stats.

## SOP — Watch the local stack
Honest status for every port, session and binary.

1. Probe ports 4000 / 3789 / 11434 / 18789
2. Check tmux sessions and required brew binaries
3. Record honest ConnectorStatus, never fake connected
4. Compare against the last sweep to catch flapping services
5. Alert the console when something that was up goes down
