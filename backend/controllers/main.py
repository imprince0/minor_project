import sys
from flask import json
import numpy as np
from PIL import Image
import requests
from io import BytesIO
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model


disease=["Melanocytic nevi","Melanoma","Benign keratosis-like lesions","Basal cell carcinoma","Actinic keratoses","Vascular lesions","Dermatofibroma"]
medicine=["Melgain","Efudix","0.1% tazarotene","Imiquimod","Imiquimod","azelaic acid and niacinamide","hydrocortisone"]
# Load the trained model
model = load_model('./controllers/model70.h5')

# Main function to process command line arguments and call the predict function
def main():
    try:
        # Get the image path from command line arguments
        img_path = sys.argv[1]
        response = requests.get(img_path)

        if response.status_code == 200:

            img_data = response.content
            img = Image.open(BytesIO(img_data))
            img = img.resize((64, 64))

            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)

            predictions = model.predict(img_array,verbose=0)

            result=np.argmax(predictions)

            response = {
                "success": True,
                "disease": disease[result],
                "medicine": medicine[result]
            }
            
            print(json.dumps(response))
        else :
            response = {
                "success" : False
            }
            print(json.dumps(response))
            
    except Exception as e:
        response = {
            "success" : False,
            "error" : e
        }

# Call the main function
if __name__ == "__main__":
    main()