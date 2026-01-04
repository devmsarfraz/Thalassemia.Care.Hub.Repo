"""
Test Ollama connection and LLM integration
"""
import ollama

print("=" * 70)
print(" 🔍 OLLAMA CONNECTION TEST")
print("=" * 70)

try:
    # Test 1: List available models
    print("\n📋 Step 1: Checking available models...")
    models = ollama.list()
    
    print(f"✅ Ollama is running!")
    print(f"\nAvailable models:")
    if 'models' in models:
        for model in models['models']:
            model_name = model.get('model', model.get('name', 'unknown'))
            print(f"  - {model_name}")
    else:
        print(f"  Models data: {models}")
    
    # Test 2: Simple chat test
    print("\n\n💬 Step 2: Testing chat with qwen3:8b...")
    response = ollama.chat(
        model='qwen3:8b',
        messages=[
            {
                'role': 'user',
                'content': 'Say hello in one short sentence.'
            }
        ]
    )
    
    print(f"✅ LLM Response: {response['message']['content']}")
    
    # Test 3: Medical question
    print("\n\n🏥 Step 3: Testing medical question...")
    response = ollama.chat(
        model='qwen3:8b',
        messages=[
            {
                'role': 'system',
                'content': 'You are a helpful medical assistant specializing in Thalassemia.'
            },
            {
                'role': 'user',
                'content': 'What is thalassemia in one sentence?'
            }
        ]
    )
    
    print(f"✅ Medical Response: {response['message']['content']}")
    
    print("\n" + "=" * 70)
    print("✅ ALL TESTS PASSED! Ollama is ready to use!")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print("\nPossible issues:")
    print("1. Ollama app not running - Start Ollama desktop app")
    print("2. Model not downloaded - Run: ollama pull qwen3:8b")
    print("3. Firewall blocking connection")
