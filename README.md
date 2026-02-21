🇱🇰 Sri Lanka Dengue Forecasting – Machine Learning System

📌 Project Overview

Dengue fever is a major public health concern in Sri Lanka, with seasonal outbreaks affecting multiple districts annually.
This project develops an interpretable machine learning system to forecast next-month dengue cases at the district level using historical case data and environmental variables.
The system uses XGBoost Regressor and includes explainability through SHAP analysis, along with a deployed API and frontend interface.


🎯 Objective

To build a short-term forecasting system that:
Predicts monthly dengue cases per district
Captures temporal persistence and environmental effects
Provides interpretable explanations
Is deployable as a real-world decision-support tool

📊 Dataset Description

25 administrative districts in Sri Lanka
Monthly data (2019–2021)
900 original records
825 usable records after feature engineering

Features Used:
  Geographic Features
  Province
  District
  Latitude
  Longitude
  Elevation
  Environmental Features
  Average Temperature
  Precipitation
  Humidity
  Temporal Features (Engineered)
  Cases_lag1
  Cases_lag2
  Cases_lag3
  Rolling 3-month average
  Month_sin
  Month_cos
  Target Variable
  Monthly dengue case count (Cases)


🤖 Models Implemented 

1️⃣ Baseline Model
Linear Regression

2️⃣ Proposed Model
XGBoost Regressor

Why XGBoost?

Captures nonlinear relationships
Handles feature interactions
Performs strongly on tabular data
Works seamlessly with SHAP explainability

📈 Model Performance (Test Set – 2021)
Model             MAE         RMSE       R² 
Linear Regression 79.01     142.39     0.745 
XGBoost           54.60     129.68     0.789

XGBoost improved prediction accuracy and better captured outbreak spikes.

🔍 Explainability (SHAP)

SHAP analysis revealed:
Previous month cases (lag1) are the strongest predictor
Rolling 3-month average is highly influential
Humidity and precipitation moderately affect predictions
Geographic features have lower influence
The model’s behavior aligns with epidemiological knowledge of dengue transmission.


🏗 System Architecture

The system follows a client-server architecture:
Backend: FastAPI serving trained ML model
Frontend: User interface for input and prediction display
Model: XGBoost pipeline saved as .pkl

Users can input:
  District
  Weather conditions
  Recent case numbers
  The system outputs:
  Predicted dengue cases for the next month

⚠️ Limitations

Only 3 years of data No population density or mobility data included Designed for short-term (next-month) forecasting 
Should be used as a decision-support tool, not a medical diagnostic system

📚 Technologies Used
Python 
Scikit-learn 
XGBoost 
SHAP 
FastAPI 
Docker

🚀 How to Run the Project

Option 1: Local Development (Recommended for Development)

1️⃣ Clone the Repository

git clone https://github.com/yourusername/SriLanka-Dengue-Forecasting-ML.git
cd SriLanka-Dengue-Forecasting-ML
2️⃣ Create Virtual Environment

python -m venv .venv
.venv\Scripts\activate
3️⃣ Install Backend Dependencies

pip install -r backend/requirements.txt
4️⃣ Verify Model File Exists Make sure the trained model exists at:

models/dengue_xgb_pipeline.pkl
5️⃣ Run Backend

uvicorn backend.app.main:app --reload --port 8000
Backend opens at: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs

6️⃣ Run Frontend Open a new terminal and navigate to the project root, then:

# Option A: Use Live Server in VS Code
# Right-click frontend/index.html → Open with Live Server
# Opens at: http://127.0.0.1:5500

# Option B: Use Python's built-in server
cd frontend
python -m http.server 5500
# Then access: http://127.0.0.1:5500
Option 2: Docker Compose (Recommended for Production/Demo)

All-in-one: Runs both backend + frontend automatically

docker-compose up --build
Access:

Frontend: http://127.0.0.1:5500
Backend API: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
To stop:
