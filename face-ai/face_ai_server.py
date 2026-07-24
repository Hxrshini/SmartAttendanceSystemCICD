from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64
import os

app = Flask(__name__)


# ================= DECODE BASE64 IMAGE =================

def decode_base64_image(base64_string):

    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    image_bytes = base64.b64decode(base64_string)

    np_array = np.frombuffer(image_bytes, np.uint8)

    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    return img


# ================= FACE VERIFICATION =================

@app.route("/verify-face", methods=["POST"])
def verify_face():

    try:

        data = request.json

        profile_path = data["profilePath"]
        selfie_base64 = data["selfie"]

        if not os.path.exists(profile_path):
            return jsonify({"match": False, "error": "Profile image not found"})


        # decode selfie
        selfie_img = decode_base64_image(selfie_base64)

        # save temporary selfie
        temp_path = "temp_selfie.jpg"
        cv2.imwrite(temp_path, selfie_img)

        # deepface comparison
        result = DeepFace.verify(
            img1_path=profile_path,
            img2_path=temp_path,
            model_name="ArcFace",
            enforce_detection=True
        )

        os.remove(temp_path)

        return jsonify({
            "match": result["verified"],
            "distance": result["distance"]
        })


    except Exception as e:

        return jsonify({
            "match": False,
            "error": str(e)
        })


# ================= RUN SERVER =================

if __name__ == "__main__":
    app.run(port=5001)