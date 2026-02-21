import numpy as np
import pandas as pd

def month_to_cyclical(month: int):
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    return float(month_sin), float(month_cos)

def build_feature_row(payload, district_lookup_df: pd.DataFrame) -> pd.DataFrame:
    # Match district (case-insensitive)
    match = district_lookup_df[
        district_lookup_df["District"].str.lower() == payload.district.strip().lower()
    ]
    if match.empty:
        raise ValueError(f"Unknown district: {payload.district}")

    row = match.iloc[0]
    month_sin, month_cos = month_to_cyclical(payload.month)

    # Approx rolling mean from provided lags (consistent with training concept)
    cases_roll3 = (payload.cases_lag1 + payload.cases_lag2 + payload.cases_lag3) / 3.0

    features = {
        "Province": row["Province"],
        "District": row["District"],
        "Latitude": float(row["Latitude"]),
        "Longitude": float(row["Longitude"]),
        "Elevation": float(row["Elevation"]),
        "Temp_avg": float(payload.temp_avg),
        "Precipitation_avg": float(payload.precipitation_avg),
        "Humidity_avg": float(payload.humidity_avg),
        "Cases_lag1": float(payload.cases_lag1),
        "Cases_lag2": float(payload.cases_lag2),
        "Cases_lag3": float(payload.cases_lag3),
        "Cases_roll3": float(cases_roll3),
        "Month_sin": month_sin,
        "Month_cos": month_cos,
    }
    return pd.DataFrame([features])