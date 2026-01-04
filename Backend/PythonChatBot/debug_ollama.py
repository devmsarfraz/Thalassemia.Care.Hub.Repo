import ollama

try:
    print("OLLAMA LIST MODELS (using attributes):")
    response = ollama.list()
    for m in response.models:
        print(f"  - Model: {m.model}")
        # Sometimes it shows up as name in older versions or differently
        # Let's see what attributes it has
        # print(f"    Available attributes: {dir(m)}")
except Exception as e:
    print(f"ERROR: {str(e)}")

