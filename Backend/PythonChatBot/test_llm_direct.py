"""
Test LLM Service directly
"""
import sys
sys.path.insert(0, '.')

from llm_service import get_llm_service

print("=" * 70)
print(" 🧪 TESTING LLM SERVICE DIRECTLY")
print("=" * 70)

# Get LLM service
llm = get_llm_service(model_name="qwen3:8b")

print(f"\n✅ LLM Service initialized")
print(f"   - Model: qwen3:8b")
print(f"   - Available: {llm.is_available}")

if llm.is_available:
    print("\n📤 Sending test message to LLM...")
    response, success = llm.get_response(
        "What is thalassemia? Answer in one short sentence.",
        system_prompt="You are a medical assistant. Be concise."
    )
    
    if success:
        print(f"\n✅ LLM Response:")
        print(f"   {response}")
        print("\n🎉 SUCCESS! Ollama is working with your chatbot!")
    else:
        print(f"\n❌ Failed: {response}")
else:
    print("\n❌ LLM is not available")
    print("   Make sure Ollama is running and qwen3:8b is pulled")

print("\n" + "=" * 70)
