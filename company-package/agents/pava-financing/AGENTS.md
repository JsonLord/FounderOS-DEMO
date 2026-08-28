---
kind: "agent"
slug: "pava-financing"
name: "PAVA Financing"
title: "Financing Options"
reportsTo: "payments-pulse"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "finances"
    model: "pava api"
    instance: "builtin"
---

# PAVA Financing

PAVA financing options lane for sales offers and payment-plan context.

## SOP — Quote financing options
Payment plans attached to live offers.

1. Take the deal size and buyer profile from the lane
2. Pull matching plan options from PAVA
3. Attach terms to the offer before the call
4. Track which plans get accepted and which stall deals
5. Report acceptance rates so pricing keeps getting sharper
