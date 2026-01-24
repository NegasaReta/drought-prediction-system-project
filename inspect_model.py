import os
import tensorflow as tf

model_path = "api/models/drought_prediction_ndvi_spi_lstm.h5"

try:
    if not os.path.exists(model_path):
        print(f"File not found: {model_path}")
    else:
        model = tf.keras.models.load_model(model_path, compile=False)
        print("Model loaded successfully.")
        try:
            print(f"Input Name: {model.input_names}")
        except AttributeError:
            print("Model does not have input_names attribute")
            
        try:
             # Sequential models often have input_shape property
             print(f"Input Shape: {model.input_shape}")
        except AttributeError:
             # If that fails, try getting it from the first layer
             if hasattr(model, 'layers') and len(model.layers) > 0:
                  print(f"First Layer Input Shape: {model.layers[0].input_shape}")
        model.summary()
except Exception as e:
    print(f"Error loading model: {e}")
