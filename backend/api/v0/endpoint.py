from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ...services.prediction_service import prediction_service

router = APIRouter()


class PredictionRequest(BaseModel):
    data: List[
        List[List[float]]
    ]  # Expecting batch of sequences. Shape: (batch_size, 6, 19)

    class Config:
        json_schema_extra = {
            "example": {
                "data": [
                    [
                        [0.1] * 19,
                        [0.1] * 19,
                        [0.1] * 19,
                        [0.1] * 19,
                        [0.1] * 19,
                        [0.1] * 19,
                    ]
                ]
            }
        }


@router.post("/predict")
async def predict(request: PredictionRequest):
    try:
        if not request.data:
            raise HTTPException(status_code=400, detail="No data provided")

        predictions = prediction_service.predict(request.data)
        return {"predictions": predictions}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
