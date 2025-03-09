import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

model = genai.GenerativeModel("gemini-pro")

def get_gemini_response(prompt):
    response = model.generate_content(prompt)
    return response.text

# Example Usage
print(get_gemini_response("Give me a motivational quote"))
