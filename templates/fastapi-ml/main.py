from fastapi import FastAPI
from app.schemas import PredictionRequest, PredictionResponse
from app.model import get_model

app = FastAPI(title="ML Prediction API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    model = get_model()
    prediction = model.predict([req.features])
    return PredictionResponse(prediction=prediction[0].item())
