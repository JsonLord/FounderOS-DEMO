---
kind: "agent"
slug: "fanbasis-sales"
name: "FanBasis"
title: "Offer & Payment Platform"
reportsTo: "payments-pulse"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "finances"
    model: "fanbasis api"
    instance: "builtin"
---

# FanBasis

FanBasis sales platform connection for offers and customer/payment context.

## SOP — Track FanBasis income
Month-to-date, split by venture, refunds flagged.

1. Pull month-to-date customers from the FanBasis API
2. Split income by venture (LC vs Vantage)
3. Record the income snapshot for the Finances view
4. Flag refunds and disputes the day they land
5. Reconcile the running total against the month-end books
