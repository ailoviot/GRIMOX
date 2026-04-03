from fastapi import FastAPI
from app.config import settings
from app.routers import example

app = FastAPI(title="Grimox API")

app.include_router(example.router)


@app.get("/")
def root():
    return {"message": "Welcome to your API"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
