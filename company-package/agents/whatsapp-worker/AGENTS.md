---
kind: "agent"
slug: "whatsapp-worker"
name: "WhatsApp Worker"
title: "Chat Monitor"
reportsTo: "comms-agent"
status: "active"
metadata:
  founderos:
    tier: "worker"
    department: "communications"
    model: "local sqlite (read-only)"
    instance: "builtin"
---

# WhatsApp Worker

Reads the local WhatsApp ChatStorage (600+ chats incl. LC + Vantage teams) into /comms. Works today.

## SOP — Monitor WhatsApp chats
600+ chats read locally, LC + Vantage teams surfaced.

1. Read the local ChatStorage.sqlite (read-only, nothing leaves the machine)
2. Surface new messages from the LC and Vantage team chats
3. Map senders to their contact tags
4. Flag messages that mention money, deadlines or blockers
5. Push tagged messages into the unified feed
