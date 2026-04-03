# FastAPI ML Template

Minimal FastAPI + scikit-learn prediction API.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn main:app --reload
```

## Usage

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [3.0]}'
```

Health check: `GET http://localhost:8000/health`

API docs: `http://localhost:8000/docs`
