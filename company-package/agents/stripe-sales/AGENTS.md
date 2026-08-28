---
kind: "agent"
slug: "stripe-sales"
name: "Stripe"
title: "Sales Payment Processor"
reportsTo: "payments-pulse"
status: "planned"
metadata:
  founderos:
    tier: "worker"
    department: "finances"
    model: "stripe sdk"
    instance: "builtin"
---

# Stripe

Stripe payment confirmation lane for sales workflows and account-level revenue checks.

## SOP — Track Stripe income
Balance and charges labeled Launchpad Cohort.

1. Pull balance and recent charges from Stripe
2. Label income to Launchpad Cohort
3. Record the snapshot for the income chart
4. Flag anomalies against the trailing average
5. Note upcoming payouts so cash flow is never a surprise
