"""
Quick test to verify LLM integration
"""
import requests
import json

print("=" * 70)
print(" 🧪 TESTING CHATBOT WITH LLM FALLBACK")
print("=" * 70)

# Test with a question that won't match training data (to trigger LLM)
test_message = "Tell me a fun fact about blood cells"

print(f"\n📤 Sending message: '{test_message}'")
print("   (This should trigger LLM fallback since it's not in training data)")

try:
    response = requests.post(
        'http://localhost:5000/api/chat',
        json={'message': test_message},
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Response received!")
        print(f"\n📝 Bot Response: {data['response']}")
        print(f"\n📊 Metadata:")
        print(f"   - Confidence: {data.get('confidence', 'N/A')}")
        print(f"   - Used LLM: {data.get('used_llm', False)}")
        print(f"   - Conversation ID: {data.get('conversation_id', 'N/A')}")
        
        if data.get('used_llm'):
            print("\n🎉 SUCCESS! Ollama LLM is working!")
        else:
            print("\n⚠️  LLM was not used (matched training data)")
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

print("\n" + "=" * 70)
