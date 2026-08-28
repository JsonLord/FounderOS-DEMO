---
kind: "agent"
slug: "arcads-creative"
name: "Arcads Creative"
title: "UGC Ad Generation"
reportsTo: "social-agent"
status: "active"
skills:
  - "ugc-generation"
metadata:
  founderos:
    tier: "worker"
    department: "marketing-growth"
    model: "arcads api"
    instance: "builtin"
---

# Arcads Creative

Generates UGC ads for Vantage (Veo/Sora/Kling) via the Arcads API. Auth on this machine — works today.

## SOP — Generate UGC ad variants
Vantage ad angles rendered as UGC actors.

1. Take the ad brief with hook, angle and offer
2. Generate actor variants across Veo / Sora / Kling
3. Cull the takes that break the brief before rendering finals
4. Render finals and name them by angle
5. Deliver the batch to creative review with a variant sheet
