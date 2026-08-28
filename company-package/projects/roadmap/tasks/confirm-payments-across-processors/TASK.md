---
kind: "task"
slug: "confirm-payments-across-processors"
name: "Confirm payments across processors"
assignee: "processor-confirmation"
project: "roadmap"
recurring: true
metadata:
  founderos:
    department: "finances"
---

No deal marked paid without an API receipt.

1. Receive the payment claim from a sales lane
2. Check the claimed processor’s API (Stripe / PayPal / Square / Whop / FanBasis)
3. Confirm the charge or flag the mismatch loudly
4. Write the confirmation onto the deal record
5. Keep an audit trail of every confirmation for month-end close
