from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pathlib import Path

from .schemas import PredictRequest, PredictResponse
from .utils import build_feature_row

app = FastAPI(title="Sri Lanka Dengue Forecast API", version="1.0")

# Allow frontend (HTML/JS) to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ok for demo/assignment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project root is 2 levels above backend/app/
PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = PROJECT_ROOT / "models" / "dengue_xgb_pipeline.pkl"
LOOKUP_PATH = PROJECT_ROOT / "models" / "district_lookup.csv"

model = None
lookup_df = None

@app.on_event("startup")
def load_artifacts():
    global model, lookup_df
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")
    if not LOOKUP_PATH.exists():
        raise FileNotFoundError(f"Lookup not found at: {LOOKUP_PATH}")

    model = joblib.load(MODEL_PATH)
    lookup_df = pd.read_csv(LOOKUP_PATH)
    print(" Loaded model + district lookup")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    X_row = build_feature_row(payload, lookup_df)
    pred = float(model.predict(X_row)[0])
    # dengue cases are counts → return as float but you can round in UI
    return PredictResponse(district=payload.district, month=payload.month, predicted_cases=pred)

