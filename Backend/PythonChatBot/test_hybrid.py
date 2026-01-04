"""
Test script for hybrid chatbot with conversation memory
"""
import requests
import json

API_URL = "http://localhost:5000/api/chat"

print("=" * 70)
print(" 🤖 HYBRID CHATBOT TEST - Training Data + LLM Fallback")
print("=" * 70)

# Test 1: High confidence - should use training data
print("\n📊 TEST 1: High Confidence (Training Data)")
print("-" * 70)

response1 = requests.post(API_URL, json={
    "message": "What is thalassemia?"
}).json()

print(f"👤 You: What is thalassemia?")
print(f"🤖 Bot: {response1['response'][:150]}...")
print(f"   Confidence: {response1['confidence']:.1%}")
print(f"   Used LLM: {response1.get('used_llm', False)}")
print(f"   Conversation ID: {response1.get('conversation_id', 'N/A')[:8]}...")

# Test 2: Follow-up question with context
print("\n\n📊 TEST 2: Follow-up Question (With Context)")
print("-" * 70)

conversation_id = response1.get('conversation_id')

response2 = requests.post(API_URL, json={
    "message": "What causes it?",
    "conversation_id": conversation_id
}).json()

print(f"👤 You: What causes it?")
print(f"🤖 Bot: {response2['response'][:150]}...")
print(f"   Confidence: {response2['confidence']:.1%}")
print(f"   Used LLM: {response2.get('used_llm', False)}")

# Test 3: General conversation
print("\n\n📊 TEST 3: General Conversation")
print("-" * 70)

response3 = requests.post(API_URL, json={
    "message": "Hi, how are you?",
    "conversation_id": conversation_id
}).json()

print(f"👤 You: Hi, how are you?")
print(f"🤖 Bot: {response3['response']}")
print(f"   Confidence: {response3['confidence']:.1%}")
print(f"   Used LLM: {response3.get('used_llm', False)}")

print("\n" + "=" * 70)
print("✅ All tests completed!")
print("=" * 70)

print("\n📝 Summary:")
print(f"- Test 1 (Medical): Used LLM = {response1.get('used_llm', False)}")
print(f"- Test 2 (Follow-up): Used LLM = {response2.get('used_llm', False)}")
print(f"- Test 3 (Greeting): Used LLM = {response3.get('used_llm', False)}")
