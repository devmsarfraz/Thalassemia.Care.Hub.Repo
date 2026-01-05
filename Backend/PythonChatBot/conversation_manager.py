"""
Conversation Manager
Handles conversation history storage and retrieval (in-memory for now)
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)


class ConversationManager:
    """Manages conversation history in memory"""
    
    def __init__(self):
        """Initialize conversation manager"""
        # Store conversations in memory: {conversation_id: [messages]}
        self.conversations = {}
        logger.info("✅ Conversation Manager initialized")
    
    def create_conversation(self) -> str:
        """
        Create a new conversation
        
        Returns:
            str: New conversation ID (UUID)
        """
        conversation_id = str(uuid.uuid4())
        self.conversations[conversation_id] = []
        logger.info(f"📝 Created new conversation: {conversation_id}")
        return conversation_id
    
    def add_message(
        self,
        conversation_id: str,
        role: str,
        message: str
    ) -> None:
        """
        Add a message to conversation history
        
        Args:
            conversation_id: Conversation ID
            role: 'user' or 'assistant'
            message: Message content
        """
        # Create conversation if it doesn't exist
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        
        # Add message
        self.conversations[conversation_id].append({
            "role": role,
            "content": message,
            "timestamp": datetime.now().isoformat()
        })
        
        logger.info(f"💬 Added {role} message to conversation {conversation_id[:8]}...")
    
    def get_conversation_history(
        self,
        conversation_id: str,
        limit: int = 10
    ) -> List[Dict[str, str]]:
        """
        Get conversation history
        
        Args:
            conversation_id: Conversation ID
            limit: Maximum number of messages to return (most recent)
        
        Returns:
            List of messages in format [{"role": "user/assistant", "content": "..."}]
        """
        if conversation_id not in self.conversations:
            logger.warning(f"⚠️  Conversation {conversation_id} not found")
            return []
        
        # Get last N messages
        messages = self.conversations[conversation_id][-limit:]
        
        # Return in Ollama format (without timestamp)
        return [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
        ]
    
    def get_conversation_context(
        self,
        conversation_id: str,
        limit: int = 5
    ) -> str:
        """
        Get conversation context as a formatted string
        
        Args:
            conversation_id: Conversation ID
            limit: Number of recent messages to include
        
        Returns:
            Formatted conversation context
        """
        history = self.get_conversation_history(conversation_id, limit)
        
        if not history:
            return ""
        
        context = "Recent conversation:\n"
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            context += f"{role}: {msg['content']}\n"
        
        return context
    
    def clear_conversation(self, conversation_id: str) -> None:
        """
        Clear conversation history
        
        Args:
            conversation_id: Conversation ID to clear
        """
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            logger.info(f"🗑️  Cleared conversation {conversation_id[:8]}...")
    
    def cleanup_old_conversations(self, max_conversations: int = 100) -> None:
        """
        Clean up old conversations to prevent memory issues
        
        Args:
            max_conversations: Maximum number of conversations to keep
        """
        if len(self.conversations) > max_conversations:
            # Keep only the most recent conversations
            # This is a simple implementation - in production, use timestamps
            conversation_ids = list(self.conversations.keys())
            to_delete = conversation_ids[:-max_conversations]
            
            for conv_id in to_delete:
                del self.conversations[conv_id]
            
            logger.info(f"🧹 Cleaned up {len(to_delete)} old conversations")


# Global conversation manager instance
_conversation_manager = None


def get_conversation_manager() -> ConversationManager:
    """
    Get or create conversation manager instance (singleton pattern)
    
    Returns:
        ConversationManager instance
    """
    global _conversation_manager
    
    if _conversation_manager is None:
        _conversation_manager = ConversationManager()
    
    return _conversation_manager
