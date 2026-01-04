"""
Test LLM fallback with questions NOT in training data
"""
import requests

API_URL = "http://localhost:5000/api/chat"

print("=" * 80)
print(" 🤖 LLM FALLBACK TEST - Questions NOT in Training Data")
print("=" * 80)

# Test with a question that's definitely not in training data
print("\n📊 TEST: Question NOT in Training Data")
print("-" * 80)

response = requests.post(API_URL, json={
    "message": "Can you explain the difference between alpha and beta thalassemia in simple terms for a child?"
}).json()

print(f"\n👤 User: Can you explain the difference between alpha and beta thalassemia in simple terms for a child?")
print(f"\n🤖 Bot Response:")
print(f"{response['response']}")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES - LLM Fallback Working!' if response.get('used_llm') else '⚡ NO - Training Data'}")
print(f"   Conversation ID: {response.get('conversation_id', 'N/A')[:8]}...")

print("\n" + "=" * 80)
if response.get('used_llm'):
    print("✅ SUCCESS! LLM fallback is working correctly!")
else:
    print(f"⚠️  LLM not used. Confidence was {response['confidence']:.1%}")
    if response['confidence'] >= 0.7:
        print("   This is expected - training data had a good match (≥70%)")
    else:
        print("   LLM should have been used but wasn't. Check if Ollama is running.")
print("=" * 80)
