"""
End-to-end test for hybrid chatbot with LLM fallback
Tests both training data responses and LLM fallback
"""
import requests
import json

API_URL = "http://localhost:5000/api/chat"

print("=" * 80)
print(" 🚀 END-TO-END HYBRID CHATBOT TEST")
print("=" * 80)

# Test 1: High confidence medical question (should use training data)
print("\n\n📊 TEST 1: High Confidence Medical Question")
print("-" * 80)
print("Expected: Training data (confidence ≥ 70%)")

response1 = requests.post(API_URL, json={
    "message": "What is thalassemia?"
}).json()

print(f"\n👤 User: What is thalassemia?")
print(f"🤖 Bot: {response1['response'][:200]}...")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response1['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES' if response1.get('used_llm') else '⚡ NO (Training Data)'}")
print(f"   Conversation ID: {response1.get('conversation_id', 'N/A')[:8]}...")

conversation_id = response1.get('conversation_id')

# Test 2: Low confidence question (should use LLM)
print("\n\n📊 TEST 2: Low Confidence Question (LLM Fallback)")
print("-" * 80)
print("Expected: LLM fallback (confidence < 70%)")

response2 = requests.post(API_URL, json={
    "message": "What should I do if I feel dizzy and tired?",
    "conversation_id": conversation_id
}).json()

print(f"\n👤 User: What should I do if I feel dizzy and tired?")
print(f"🤖 Bot: {response2['response'][:200]}...")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response2['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES' if response2.get('used_llm') else '⚡ NO (Training Data)'}")

# Test 3: Follow-up question with context
print("\n\n📊 TEST 3: Follow-up Question (Context Test)")
print("-" * 80)
print("Expected: LLM with conversation context")

response3 = requests.post(API_URL, json={
    "message": "Should I see a doctor?",
    "conversation_id": conversation_id
}).json()

print(f"\n👤 User: Should I see a doctor?")
print(f"🤖 Bot: {response3['response'][:200]}...")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response3['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES' if response3.get('used_llm') else '⚡ NO (Training Data)'}")

# Test 4: General conversation
print("\n\n📊 TEST 4: General Conversation")
print("-" * 80)
print("Expected: Training data (high confidence)")

response4 = requests.post(API_URL, json={
    "message": "Hi, how are you?",
    "conversation_id": conversation_id
}).json()

print(f"\n👤 User: Hi, how are you?")
print(f"🤖 Bot: {response4['response']}")
print(f"\n📈 Metrics:")
print(f"   Confidence: {response4['confidence']:.1%}")
print(f"   Used LLM: {'🤖 YES' if response4.get('used_llm') else '⚡ NO (Training Data)'}")

# Summary
print("\n\n" + "=" * 80)
print(" 📊 TEST SUMMARY")
print("=" * 80)

tests = [
    ("Medical Question (High Confidence)", response1),
    ("Symptom Question (Low Confidence)", response2),
    ("Follow-up Question", response3),
    ("General Greeting", response4)
]

print(f"\n{'Test':<40} {'Confidence':<15} {'Source':<20}")
print("-" * 80)
for test_name, response in tests:
    confidence = response['confidence']
    source = "🤖 LLM" if response.get('used_llm') else "⚡ Training Data"
    print(f"{test_name:<40} {confidence:>6.1%}{'':8} {source:<20}")

print("\n" + "=" * 80)
print("✅ ALL TESTS COMPLETED!")
print("=" * 80)

# Check if hybrid system is working
llm_used = any(r.get('used_llm') for r in [response1, response2, response3, response4])
training_used = any(not r.get('used_llm') for r in [response1, response2, response3, response4])

print("\n🎯 Hybrid System Status:")
if llm_used and training_used:
    print("   ✅ WORKING PERFECTLY - Both training data and LLM are being used!")
elif training_used and not llm_used:
    print("   ⚠️  Only training data used - LLM fallback not triggered")
elif llm_used and not training_used:
    print("   ⚠️  Only LLM used - Training data not being used")
else:
    print("   ❌ ERROR - Neither source working")

print(f"\n   Training Data Responses: {sum(1 for r in [response1, response2, response3, response4] if not r.get('used_llm'))}/4")
print(f"   LLM Responses: {sum(1 for r in [response1, response2, response3, response4] if r.get('used_llm'))}/4")
