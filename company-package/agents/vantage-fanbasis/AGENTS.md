---
kind: "agent"
slug: "vantage-fanbasis"
name: "Vantage FanBasis"
title: "Vantage FanBasis Lane"
reportsTo: "vantage-sales"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "sales"
    model: "fanbasis api"
    instance: "builtin"
---

# Vantage FanBasis

FanBasis lane specifically under Vantage for offer, payment, and customer context.

## SOP — Reconcile the Vantage FanBasis lane
FanBasis customers matched to CRM deals.

1. Pull month-to-date customers from FanBasis
2. Match each payment to its Attio deal
3. Flag payments with no deal and deals with no payment
4. Chase every mismatch to a resolution, not just a flag
5. Post month-to-date totals to Finances
