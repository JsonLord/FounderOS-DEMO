---
kind: "task"
slug: "monitor-whatsapp-chats"
name: "Monitor WhatsApp chats"
assignee: "whatsapp-worker"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "communications"
---

600+ chats read locally, LC + Vantage teams surfaced.

1. Read the local ChatStorage.sqlite (read-only, nothing leaves the machine)
2. Surface new messages from the LC and Vantage team chats
3. Map senders to their contact tags
4. Flag messages that mention money, deadlines or blockers
5. Push tagged messages into the unified feed
