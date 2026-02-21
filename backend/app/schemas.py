from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    district: str = Field(..., description="Sri Lankan district name (e.g., Colombo)")
    month: int = Field(..., ge=1, le=12, description="Month number (1-12)")

    temp_avg: float
    precipitation_avg: float
    humidity_avg: float

    cases_lag1: float
    cases_lag2: float
    cases_lag3: float

class PredictResponse(BaseModel):
    district: str
    month: int
    predicted_cases: float