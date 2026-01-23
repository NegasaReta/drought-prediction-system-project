import tensorflow as tf
import numpy as np
import os

class PredictionService:
    def __init__(self):
        self.model = None
        # Path relative to where uvicorn is run (backend/)
        self.model_path = "app/models/drought_prediction_ndvi_spi_lstm.h5"
        self.load_model()

    def load_model(self):
        """Loads the Keras model from the file system."""
        try:
            if os.path.exists(self.model_path):
                # Load with compile=False to avoid metric issues if they exist
                self.model = tf.keras.models.load_model(self.model_path, compile=False)
                print(f"Model loaded from {self.model_path}")
            else:
                print(f"Model file not found at {self.model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, input_data: list):
        """
        Makes a prediction based on the input data.
        
        Args:
            input_data (list): A list representing the input batch. 
                               Expected shape from client: (batch_size, 6, 19) or single instance (6, 19)
        
        Returns:
            list: The prediction results.
        """
        if not self.model:
            raise RuntimeError("Model is not loaded")

        # Convert input to numpy array
        input_array = np.array(input_data)
        
        # Ensure it has the batch dimension
        if len(input_array.shape) == 2:
            input_array = np.expand_dims(input_array, axis=0)
            
        # Validate shape
        # Expecting (None, 6, 19)
        expected_timesteps = 6
        expected_features = 19
        
        if input_array.shape[1] != expected_timesteps or input_array.shape[2] != expected_features:
            raise ValueError(f"Input shape mismatch. Expected (batch, {expected_timesteps}, {expected_features}), got {input_array.shape}")

        predictions = self.model.predict(input_array)
        
        # Convert predictions to list for JSON serialization
        return predictions.tolist()

# Singleton instance
prediction_service = PredictionService()
