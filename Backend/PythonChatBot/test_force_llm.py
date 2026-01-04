"""
Force LLM fallback with completely unrelated question
"""
import requests

API_URL = "http://localhost:5000/api/chat"

print("=" * 80)
print(" 🤖 FORCING LLM FALLBACK - Completely Unrelated Question")
print("=" * 80)

# Test with a completely unrelated question
print("\n📊 TEST: Unrelated Question to Force LLM Fallback")
print("-" * 80)

response = requests.post(API_URL, json={
    "message": "Say 'I am the LLM' in 3 words."
}).json()

print(f"\n👤 User: Say 'I am the LLM' in 3 words.")
print(f"\n🤖 Bot Response:")
print(f"{response['response']}")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES - LLM Fallback Working!' if response.get('used_llm') else '⚡ NO - Training Data'}")

print("\n" + "=" * 80)
if response.get('used_llm'):
    print("✅ SUCCESS! LLM fallback triggered for unrelated question!")
    print("   The hybrid system is working perfectly!")
else:
    print(f"   Confidence: {response['confidence']:.1%}")
    if response['confidence'] >= 0.7:
        print("   ⚠️  Training data matched (≥70%) - try a more unrelated question")
    elif response['confidence'] < 0.7:
        print("   ❌ LLM should have been used! Checking...")
print("=" * 80)
