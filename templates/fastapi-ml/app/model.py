import os
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression
from dotenv import load_dotenv

load_dotenv()

_model = None


def get_model():
    global _model
    if _model is not None:
        return _model

    model_path = os.getenv("MODEL_PATH", "./models/model.pkl")

    if os.path.exists(model_path):
        with open(model_path, "rb") as f:
            _model = pickle.load(f)
    else:
        # Create a dummy model for demo purposes
        _model = LinearRegression()
        X = np.array([[1], [2], [3], [4], [5]])
        y = np.array([2, 4, 6, 8, 10])
        _model.fit(X, y)

    return _model
