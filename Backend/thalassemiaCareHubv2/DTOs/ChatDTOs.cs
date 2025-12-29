namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for creating a new chat session
    /// </summary>
    public class CreateChatSessionRequest
    {
        /// <summary>
        /// Title for the chat session
        /// </summary>
        /// <example>Thalassemia Treatment Questions</example>
        public string SessionTitle { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request model for updating a chat session
    /// </summary>
    public class UpdateChatSessionRequest
    {
        /// <summary>
        /// Updated title for the chat session
        /// </summary>
        /// <example>Updated Treatment Questions</example>
        public string SessionTitle { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request model for sending a message in a chat session
    /// </summary>
    public class SendMessageRequest
    {
        /// <summary>
        /// The message content to send to the AI
        /// </summary>
        /// <example>What are the common symptoms of thalassemia?</example>
        public string MessageContent { get; set; } = string.Empty;

        /// <summary>
        /// Optional: Specify which AI provider to use (Gemini, ChatterBot, or Auto for fallback)
        /// </summary>
        /// <example>ChatterBot</example>
        public string? AIProvider { get; set; }
    }

    /// <summary>
    /// Response model for chat session operations
    /// </summary>
    public class ChatSessionResponse
    {
        /// <summary>
        /// Unique identifier of the chat session
        /// </summary>
        public int ChatSessionId { get; set; }

        /// <summary>
        /// Title of the chat session
        /// </summary>
        public string SessionTitle { get; set; } = string.Empty;

        /// <summary>
        /// Date when the session was created
        /// </summary>
        public DateTime CreationDate { get; set; }

        /// <summary>
        /// Whether the session is deleted (soft delete)
        /// </summary>
        public bool IsDelete { get; set; }

        /// <summary>
        /// ID of the user who owns this session
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Number of messages in this session
        /// </summary>
        public int MessageCount { get; set; }

        /// <summary>
        /// Last message timestamp
        /// </summary>
        public DateTime? LastMessageDate { get; set; }
    }

    /// <summary>
    /// Response model for chat message operations
    /// </summary>
    public class ChatMessageResponse
    {
        /// <summary>
        /// Unique identifier of the chat message
        /// </summary>
        public int MessageId { get; set; }

        /// <summary>
        /// ID of the chat session this message belongs to
        /// </summary>
        public int ChatSessionId { get; set; }

        /// <summary>
        /// Type of sender (User, AI)
        /// </summary>
        public string SenderType { get; set; } = string.Empty;

        /// <summary>
        /// Content of the message
        /// </summary>
        public string MessageContent { get; set; } = string.Empty;

        /// <summary>
        /// Timestamp when the message was sent
        /// </summary>
        public DateTime Timestamp { get; set; }
    }

    /// <summary>
    /// Response model for chat history with messages
    /// </summary>
    public class ChatHistoryResponse
    {
        /// <summary>
        /// Chat session information
        /// </summary>
        public ChatSessionResponse Session { get; set; } = new ChatSessionResponse();

        /// <summary>
        /// List of messages in this session
        /// </summary>
        public List<ChatMessageResponse> Messages { get; set; } = new List<ChatMessageResponse>();
    }

    /// <summary>
    /// Response model for sending a message (includes both user and AI response)
    /// </summary>
    public class SendMessageResponse
    {
        /// <summary>
        /// The user message that was sent
        /// </summary>
        public ChatMessageResponse UserMessage { get; set; } = new ChatMessageResponse();

        /// <summary>
        /// The AI response to the message
        /// </summary>
        public ChatMessageResponse AIMessage { get; set; } = new ChatMessageResponse();

        /// <summary>
        /// Indicates if the AI response was successful
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Error message if AI response failed
        /// </summary>
        public string? ErrorMessage { get; set; }
    }

    /// <summary>
    /// Response model for listing user's chat sessions
    /// </summary>
    public class ChatSessionsListResponse
    {
        /// <summary>
        /// List of chat sessions for the user
        /// </summary>
        public List<ChatSessionResponse> Sessions { get; set; } = new List<ChatSessionResponse>();

        /// <summary>
        /// Total number of sessions
        /// </summary>
        public int TotalCount { get; set; }
    }

    /// <summary>
    /// Request model for DeepSeek API integration
    /// </summary>
    public class DeepSeekRequest
    {
        /// <summary>
        /// The model to use (deepseek-chat)
        /// </summary>
        public string Model { get; set; } = "deepseek-chat";

        /// <summary>
        /// List of messages in the conversation
        /// </summary>
        public List<DeepSeekMessage> Messages { get; set; } = new List<DeepSeekMessage>();

        /// <summary>
        /// Maximum tokens for the response
        /// </summary>
        public int MaxTokens { get; set; } = 1000;

        /// <summary>
        /// Temperature for response generation (0.0 to 1.0)
        /// </summary>
        public double Temperature { get; set; } = 0.7;
    }

    /// <summary>
    /// Message model for DeepSeek API
    /// </summary>
    public class DeepSeekMessage
    {
        /// <summary>
        /// Role of the message sender (system, user, assistant)
        /// </summary>
        public string Role { get; set; } = string.Empty;

        /// <summary>
        /// Content of the message
        /// </summary>
        public string Content { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model from DeepSeek API
    /// </summary>
    public class DeepSeekResponse
    {
        /// <summary>
        /// List of choices from the API response
        /// </summary>
        public List<DeepSeekChoice> Choices { get; set; } = new List<DeepSeekChoice>();

        /// <summary>
        /// Usage information for the request
        /// </summary>
        public DeepSeekUsage? Usage { get; set; }
    }

    /// <summary>
    /// Choice model from DeepSeek API response
    /// </summary>
    public class DeepSeekChoice
    {
        /// <summary>
        /// The message in this choice
        /// </summary>
        public DeepSeekMessage? Message { get; set; }

        /// <summary>
        /// Finish reason for the response
        /// </summary>
        public string? FinishReason { get; set; }
    }

    /// <summary>
    /// Usage information from DeepSeek API response
    /// </summary>
    public class DeepSeekUsage
    {
        /// <summary>
        /// Number of prompt tokens used
        /// </summary>
        public int PromptTokens { get; set; }

        /// <summary>
        /// Number of completion tokens used
        /// </summary>
        public int CompletionTokens { get; set; }

        /// <summary>
        /// Total tokens used
        /// </summary>
        public int TotalTokens { get; set; }
    }
}
