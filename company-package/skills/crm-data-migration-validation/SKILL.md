---
name: "crm-data-migration-validation"
description: "Move operational records into a new CRM or internal app without losing provenance, silently changing fields or trusting an unverified import."
metadata:
  paperclip:
    tags: ["crm", "data", "migration", "quality"]
  founderos:
    owner: "crm-pulse"
    source: "transcript_09.txt"
---

# CRM data migration validation

## Outcome
A reversible migration whose counts, field mappings and representative records are verified.

## Method
1. Preserve the untouched source export and export timestamp.
2. Profile columns/types/nulls/duplicates.
3. Define an explicit source→target field map and transformations.
4. Import to staging/test first when possible.
5. Reconcile record counts and key totals.
6. Spot-check representative and edge-case records against source.
7. Log rejected/ambiguous rows instead of guessing.
8. Promote only after verification; retain rollback path.

## Rule
Do not expose real sensitive customer data to an unsecured mock app. Authentication/access controls precede production data.