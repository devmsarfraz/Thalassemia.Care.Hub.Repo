"""
LLM Service for Ollama Integration
Handles communication with local Ollama LLM models
"""

import logging
import ollama
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with Ollama LLM"""
    
    def __init__(self, model_name: str = "qwen3:8b"):
        """
        Initialize LLM service
        
        Args:
            model_name: Name of the Ollama model to use
        """
        self.model_name = model_name
        self.is_available = self._check_availability()
        
        if self.is_available:
            logger.info(f"✅ LLM Service initialized with model: {model_name}")
        else:
            logger.warning(f"⚠️  Ollama not available. LLM features disabled.")
    
    def _check_availability(self) -> bool:
        """
        Check if Ollama is running and model is available
        """
        try:
            logger.info("🔍 Checking Ollama availability...")
            response = ollama.list()
            
            model_names = []
            
            # Handle object-based response
            if hasattr(response, 'models'):
                for m in response.models:
                    name = getattr(m, 'model', getattr(m, 'name', None))
                    if name:
                        model_names.append(name.lower())
            
            # Handle dict-based response
            elif isinstance(response, dict) and 'models' in response:
                for m in response['models']:
                    name = m.get('model', m.get('name', ''))
                    if name:
                        model_names.append(name.lower())
            
            logger.info(f"📋 Found models in Ollama: {model_names}")
            
            # Flexible matching (case-insensitive substring)
            search_name = self.model_name.lower()
            found = False
            for name in model_names:
                if search_name in name or name in search_name:
                    found = True
                    logger.info(f"✅ Model {self.model_name} matched with '{name}'")
                    break
            
            self.is_available = found
            return found
                
        except Exception as e:
            logger.warning(f"⚠️  Ollama connection failed: {str(e)}")
            self.is_available = False
            return False

    def check_and_get_response(self, *args, **kwargs):
        """Re-check availability before sending request if it was previously unavailable"""
        if not self.is_available:
            self._check_availability()
        
        return self.get_response(*args, **kwargs)
    
    def get_response(
        self, 
        user_message: str, 
        conversation_history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None
    ) -> tuple[str, bool]:
        """
        Get response from LLM with conversation context
        
        Args:
            user_message: User's current message
            conversation_history: List of previous messages [{"role": "user/assistant", "content": "..."}]
            system_prompt: Optional system prompt to guide the LLM
        
        Returns:
            tuple: (response_text, success)
        """
        if not self.is_available:
            return "LLM service is not available. Please ensure Ollama is running.", False
        
        try:
            # Build messages array
            messages = []
            
            # Add system prompt if provided
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": user_message
            })
            
            logger.info(f"🤖 Sending request to LLM with {len(messages)} messages")
            
            # Get response from Ollama
            response = ollama.chat(
                model=self.model_name,
                messages=messages
            )
            
            # Extract response text
            response_text = response['message']['content']
            
            logger.info(f"✅ LLM response received ({len(response_text)} chars)")
            
            return response_text, True
            
        except Exception as e:
            logger.error(f"❌ Error getting LLM response: {str(e)}")
            return f"Error: {str(e)}", False
    
    def get_response_with_training_context(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        training_context: Optional[str] = None
    ) -> tuple[str, bool]:
        """
        Get response from LLM with training data context
        
        Args:
            user_message: User's current message
            conversation_history: Previous conversation messages
            training_context: Relevant training data to include as context
        
        Returns:
            tuple: (response_text, success)
        """
        # Build system prompt with training context
        system_prompt = """You are a helpful medical assistant specializing in Thalassemia care. 
You provide accurate, compassionate information about Thalassemia - a genetic blood disorder.

Key guidelines:
- Be empathetic and supportive
- Provide accurate medical information
- Encourage users to consult healthcare professionals for medical decisions
- Use simple, clear language
- Be conversational and friendly
"""
        
        if training_context:
            system_prompt += f"\n\nRelevant information from knowledge base:\n{training_context}"
        
        return self.get_response(user_message, conversation_history, system_prompt)


# Global LLM service instance
_llm_service = None


def get_llm_service(model_name: str = "qwen3:8b") -> LLMService:
    """
    Get or create LLM service instance (singleton pattern)
    
    Args:
        model_name: Name of the Ollama model to use
    
    Returns:
        LLMService instance
    """
    global _llm_service
    
    if _llm_service is None:
        _llm_service = LLMService(model_name)
    
    return _llm_service
