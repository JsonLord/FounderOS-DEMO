# Lightweight operations app system

## Trigger
Build or extend a custom internal app only when a repeated workflow, evidence need or operator decision cannot be handled cleanly with the current system.

## Stages
1. Specify one workflow and acceptance criteria.
2. Prototype minimal screens/data model with mock data.
3. Put code under version control before meaningful expansion.
4. Test the workflow manually.
5. Add persistent data and authentication/security before real sensitive records.
6. Import/migrate data with preserved raw exports, mapped fields, counts and sample verification.
7. Add one automation at a time with logs, failure handling and a rollback/disable path.
8. Observe use for several cycles before adding the next feature.

## Rule
Custom software is infrastructure, not validation. It must not delay customer contact or be counted as progress toward demand unless the software itself is the experiment.