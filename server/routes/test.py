import google.generativeai as genai
import os

# Set your API key as an environment variable or pass it directly
os.environ["GEMINI_API_KEY"] = "AIzaSyDmT2ooqx-z2hvP-rdrznHyezUToDsNSqU" 

try:
    # Initialize the GenerativeModel client
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

    # Attempt to list models to verify the API key
    for model in genai.list_models():
        if "generateContent" in model.supported_generation_methods:
            print(f"Model Name: {model.name}")
    print("Gemini API key is valid and can access models.")

except Exception as e:
    print(f"Error: {e}")
    print("Gemini API key might be invalid or have insufficient permissions.")