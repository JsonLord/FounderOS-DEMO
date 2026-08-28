---
kind: "task"
slug: "broadcast-directives-across-the-fleet"
name: "Broadcast directives across the fleet"
assignee: "conductor"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "tech"
---

One message in, every agent briefed, replies collected.

1. Receive the directive from the operator console
2. Resolve the target list: the whole fleet, or the pillar the directive names
3. Poll instance hosts (OpenClaw, Ollama, tmux) for availability before dispatch
4. Fan the message out to every target at once and stamp each send
5. Collect replies as they land and file the run to agent_runs
6. Report non-responders after sixty seconds so nothing fails silently
