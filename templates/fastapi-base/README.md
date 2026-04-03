# FastAPI Base

Minimal FastAPI starter template.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
python main.py
```

Server starts at http://localhost:8000

## Endpoints

- `GET /` — Welcome message
- `GET /health` — Health check
- `GET /api/example` — Example endpoint
