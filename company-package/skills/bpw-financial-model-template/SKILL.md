---
name: "bpw-financial-model-template"
description: "Use the supplied BPW Excel workbook as an implementation template without treating its defaults as venture facts."
metadata:
  paperclip:
    tags: ["finance", "spreadsheet", "template"]
  founderos:
    owner: "financial-case"
    sources: ["BPW_2023_Finanzplanung_ohne_Blattschutz_neu.xls", "Handbuch-bpw-2026.pdf"]
---

# BPW financial model template

## Outcome
A venture-specific financial workbook that preserves the template's planning relationships while replacing generic/default assumptions with evidence-backed inputs.

## Supplied workbook structure
The workbook contains planning areas including an outcome/results view, `GuV-Detailplan`, `Invest- u. AfA-Plan`, `Zins-und Tilg.-Plan`, and `Detail-Liquidität`. It is designed to connect P&L, investments/depreciation, debt service and liquidity.

## Workbook operating rules
- Treat input cells and model formulas differently; do not overwrite linked/formula cells blindly.
- The supplied workbook notes that editable fields are distinguished from cells containing references/formulas and that the model must be individually adapted.
- Review payment timing assumptions. The workbook includes a default delay between revenue recognition and cash collection and expects payment lags to be adjusted to the venture's real terms.
- Add missing venture-specific revenue, expense, cash-in and cash-out items rather than forcing the company into an incomplete template.
- Reconcile investment cash outflows, depreciation, loan drawdowns, principal repayments and interest across the appropriate plans.

## Completion gate
Every model input can be traced to evidence, a quoted external source or an explicitly labelled assumption; the linked plans reconcile and liquidity does not silently go negative.