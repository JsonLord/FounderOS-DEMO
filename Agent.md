# Hugging Face Space Deployment Instructions & Agent Rules

## Deployment Configuration

- **Target Space:** `Leon4gr45/Founder`
- **SDK:** `docker`
- **Port:** `7860` (Mandatory Hugging Face Spaces Port)

## Mandatory API Endpoints

- `/health` — Returns `{"status": "ok"}` with HTTP 200.
- `/api-docs` — Comprehensive API documentation page for all system endpoints.

## Upload & Monitoring Commands

Upload space files using `huggingface_hub` Python API or CLI with `$HF_TOKEN`:

```bash
python3 -c "
import os
from huggingface_hub import HfApi
api = HfApi(token=os.environ.get('HF_TOKEN'))
api.upload_folder(
    folder_path='.',
    repo_id='Leon4gr45/Founder',
    repo_type='space',
    ignore_patterns=['.git/*', '.next/*', 'node_modules/*']
)
"
```

### Log Monitoring Commands

```bash
# Build Logs
curl -N -H "Authorization: Bearer $HF_TOKEN" \
  "https://huggingface.co/api/spaces/Leon4gr45/Founder/logs/build"

# Run Logs
curl -N -H "Authorization: Bearer $HF_TOKEN" \
  "https://huggingface.co/api/spaces/Leon4gr45/Founder/logs/run"
```
