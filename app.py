from fastapi import FastAPI
from contextlib import asynccontextmanager
import joblib
from pydantic import BaseModel, Field
from typing import Literal 
import pandas as pd 
from fastapi.middleware.cors import CORSMiddleware



pipeline = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    
    pipeline['model'] = joblib.load('pipeline.pkl')


    yield

    pipeline.clear()

app = FastAPI(lifespan=lifespan)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class DataModel(BaseModel):
    
    age                     : int = Field(..., ge=10, le=100)
    gender                  : Literal['Male', 'Female']
    grouped_country         : Literal['India', 'USA', 'Canada', 'Australia', 'UK', 'Germany','Turkey','Mexico','France','Spain','Ireland','Japan','Denmark', 'Switzerland', 'Other']
    academic_level          : Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat','Twitter','YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp','WeChat']
    purpose_of_use          : Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours   : float = Field(..., ge=0, le=24)
    daily_unlocks           : int   = Field(..., ge=0)
    study_hours             : float = Field(..., ge=0, le=24)
    physical_activity_hours : float = Field(..., ge=0, le=24)
    sleep_hours_per_night   : float = Field(..., ge=0, le=24)
    stress_level            : Literal['Medium', 'Low', 'Very High', 'High']
    
    
class ResponseModel(BaseModel):
    
    prediction : float
    
    
@app.get('/')

def greet():
    
    return "Hello World"

@app.post('/predict')
def predict(data:DataModel, response=ResponseModel):
    
    input_dict = data.model_dump()
    input_df = pd.DataFrame([input_dict])
    
    prediction = pipeline['model'].predict(input_df)[0]
    
    return ResponseModel(prediction= round(float(prediction), 2))
    