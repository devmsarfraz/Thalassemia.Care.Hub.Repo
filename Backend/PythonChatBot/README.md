# Thalassemia Care Hub - ChatterBot Service

Python-based AI chatbot service using ChatterBot library for the Thalassemia Care Hub application.

## Features

- 🤖 Machine learning-based conversational AI
- 💉 Specialized in thalassemia medical knowledge
- 🔄 Offline capability (no external API required)
- 📚 Custom training on medical FAQs
- 🌐 REST API for ASP.NET Core integration

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Navigate to this directory
cd Backend/PythonChatBot

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Service

```bash
python run.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Send Message
```
POST /api/chat
Content-Type: application/json

{
  "message": "What is thalassemia?",
  "session_id": "optional-session-id"
}
```

### Train Bot
```
POST /api/train
Content-Type: application/json

{
  "conversations": [
    {
      "question": "What is thalassemia?",
      "answer": "Thalassemia is a genetic blood disorder..."
    }
  ]
}
```

## Training Data

The bot is trained on thalassemia-specific medical knowledge including:
- Disease overview and types
- Symptoms and diagnosis
- Treatment options
- Lifestyle recommendations
- Dietary guidelines
- Emergency protocols

## Integration with ASP.NET Core

The ASP.NET Core backend communicates with this service via HTTP:
- ChatterBotService.cs handles HTTP requests
- Fallback to Gemini AI if this service is unavailable
- Conversation history maintained in SQL Server

## Development

### Run Tests
```bash
pytest test_chatbot.py -v
```

### Training the Bot
```bash
python train_bot.py
```

## Troubleshooting

**Issue**: ChatterBot installation fails
- **Solution**: Use Python 3.7-3.9 (ChatterBot has compatibility issues with 3.10+)

**Issue**: Database locked error
- **Solution**: Ensure only one instance is running, delete `database.sqlite3` and restart

**Issue**: CORS errors
- **Solution**: Check `config.py` CORS_ORIGINS includes your ASP.NET Core backend URL
