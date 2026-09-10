# Business second brain system

## Purpose
Create a compounding, source-aware context layer that lets agents act from the same current venture state.

## Architecture
Raw systems and evidence remain systems of record. A reconciliation layer extracts only relevant facts, preserves provenance and updates canonical markdown context. Agents and dashboards consume that context. Their actions and experiment results feed back into both the source system and the brain.

## Canonical areas
- `context/`: ICP, offer, positioning, product state, sales process, tone and constraints.
- `prospects/` and `deals/`: identity, qualification, history, next action and source links.
- `calls/`: transcript/notes, summary, objections, commitments and coaching.
- `campaigns/`: audience, message, sequence/content, spend, metrics and decisions.
- `experiments/`: hypothesis, threshold, result and decision.
- `intelligence/`: daily, monthly and quarterly synthesis.
- `templates/` and `skills/`: reusable operating knowledge.

## Recurring loops
Morning reconciliation → today priorities/call prep; CRM/source sync → hygiene/stale-state detection; campaign review → response/conversion learning; periodic synthesis → update ICP/offer/process.

## Rule
Derived context must never overwrite contradictory source evidence silently. Flag conflicts and route them to an owner.