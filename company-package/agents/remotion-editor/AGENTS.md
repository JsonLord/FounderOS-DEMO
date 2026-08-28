---
kind: "agent"
slug: "remotion-editor"
name: "Remotion Editor"
title: "Social Editing Pipeline"
reportsTo: "social-agent"
status: "active"
skills:
  - "video-editing"
metadata:
  founderos:
    tier: "worker"
    department: "marketing-growth"
    model: "remotion pipeline"
    instance: "builtin"
---

# Remotion Editor

Editing and rendering pipeline for social media clips, captions, and promotional cuts.

## SOP — Cut short-form edits
Raw footage to platform-ready crops.

1. Transcribe the source clip locally with Whisper
2. Pick the hook and strongest segments from the transcript
3. Render through the Remotion pipeline with the right theme (LC / Vantage)
4. Check captions land on beat before exporting anything
5. Export platform crops and hand them to the pipeline
