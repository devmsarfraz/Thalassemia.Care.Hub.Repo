"""
Simple test script to verify the chatbot is working
"""
import requests
import json

# Test health endpoint
print("=" * 60)
print("Testing Health Endpoint...")
print("=" * 60)

try:
    response = requests.get('http://localhost:5000/api/health')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()
except Exception as e:
    print(f"Error: {e}")
    print()

# Test chat endpoint
print("=" * 60)
print("Testing Chat Endpoint...")
print("=" * 60)

test_questions = [
    "What is thalassemia?",
    "Is it contagious?",
    "Can I exercise?",
]

for question in test_questions:
    try:
        payload = {
            "message": question,
            "session_id": "test-session"
        }
        
        response = requests.post(
            'http://localhost:5000/api/chat',
            json=payload
        )
        
        data = response.json()
        
        print(f"\nQuestion: {question}")
        print(f"Answer: {data['response'][:150]}...")
        print(f"Confidence: {data['confidence']:.2%}")
        print("-" * 60)
        
    except Exception as e:
        print(f"Error: {e}")

print("\n" + "=" * 60)
print("✅ All tests completed!")
print("=" * 60)
