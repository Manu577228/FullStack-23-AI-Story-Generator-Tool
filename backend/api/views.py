import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google import genai
from .models import Story

# -------------------------------------------------
# Gemini Client (API key from environment)
# -------------------------------------------------
client = genai.Client()

# -------------------------------------------------
# Model fallback priority (UNCHANGED)
# -------------------------------------------------
MODEL_CANDIDATES = [
    "models/gemini-3-flash-preview",
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.0-flash",
]

# -------------------------------------------------
# System Instruction (UNCHANGED)
# -------------------------------------------------
SYSTEM_INSTRUCTION = """
You are a professional story writer.
Write vivid, engaging, well-structured stories.
Avoid code, explanations, or bullet points.
Focus only on storytelling.
"""

# -------------------------------------------------
# Helper: Try models one by one (FIXED)
# -------------------------------------------------
def generate_story(prompt: str) -> str:
    for model_id in MODEL_CANDIDATES:
        try:
            response = client.models.generate_content(
                model=model_id,
                contents=prompt,
                config={
                    "system_instruction": SYSTEM_INSTRUCTION,
                    "temperature": 0.7,
                    "max_output_tokens": 2048,
                },
            )

            if response and response.candidates:
                return response.candidates[0].content.parts[0].text

        except Exception:
            print("❌ Model failed:", model_id)
            traceback.print_exc()

    return "Story generation is temporarily unavailable."

# -------------------------------------------------
# API: POST /api/generate-story/
# -------------------------------------------------
@csrf_exempt
def generate_story_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        body = json.loads(request.body.decode("utf-8"))
        prompt = body.get("prompt", "").strip()

        if not prompt:
            return JsonResponse({"story": "Empty prompt."})

        story = generate_story(prompt)

        Story.objects.create(
            prompt=prompt,
            story=story
        )

        return JsonResponse({"story": story})

    except Exception:
        print("🔥 Story Backend Error")
        traceback.print_exc()
        return JsonResponse(
            {"story": "Internal AI error. Check logs."},
            status=500
        )
