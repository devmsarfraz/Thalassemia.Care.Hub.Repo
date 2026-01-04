using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;
using thalassemiaCareHubv2.Repository;

namespace thalassemiaCareHubv2.Services
{
    /// <summary>
    /// Service for chat operations and AI integration
    /// </summary>
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IGeminiService _geminiService;
        private readonly IChatterBotService _chatterBotService;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            IChatRepository chatRepository, 
            IGeminiService geminiService, 
            IChatterBotService chatterBotService,
            IUserRepository userRepository,
            ILogger<ChatService> logger)
        {
            _chatRepository = chatRepository;
            _geminiService = geminiService;
            _chatterBotService = chatterBotService;
            _userRepository = userRepository;
            _logger = logger;
        }

        /// <summary>
        /// Create a new chat session for a user
        /// </summary>
        public async Task<ChatSessionResponse?> CreateSessionAsync(CreateChatSessionRequest request, int userId)
        {
            try
            {
                var session = new ChatSession
                {
                    UserId = userId,
                    SessionTitle = request.SessionTitle,
                    CreationDate = DateTime.UtcNow,
                    IsDelete = false
                };

                var createdSession = await _chatRepository.CreateSessionAsync(session);
                if (createdSession == null)
                    return null;

                return new ChatSessionResponse
                {
                    ChatSessionId = createdSession.ChatSessionId,
                    SessionTitle = createdSession.SessionTitle,
                    CreationDate = createdSession.CreationDate,
                    IsDelete = createdSession.IsDelete,
                    UserId = createdSession.UserId,
                    MessageCount = 0,
                    LastMessageDate = null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.CreateSessionAsync: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Get all chat sessions for a user
        /// </summary>
        public async Task<List<ChatSessionResponse>> GetUserSessionsAsync(int userId)
        {
            try
            {
                var sessions = await _chatRepository.GetUserSessionsAsync(userId);

                var sessionResponses = new List<ChatSessionResponse>();

                foreach (var session in sessions)
                {
                    var messages = await _chatRepository.GetSessionMessagesAsync(session.ChatSessionId);
                    var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();

                    sessionResponses.Add(new ChatSessionResponse
                    {
                        ChatSessionId = session.ChatSessionId,
                        SessionTitle = session.SessionTitle,
                        CreationDate = session.CreationDate,
                        IsDelete = session.IsDelete,
                        UserId = session.UserId,
                        MessageCount = messages.Count,
                        LastMessageDate = lastMessage?.Timestamp
                    });
                }

                return sessionResponses;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.GetUserSessionsAsync: {ex.Message}");
                return new List<ChatSessionResponse>();
            }
        }

        /// <summary>
        /// Get chat history (messages) for a specific session
        /// </summary>
        public async Task<ChatHistoryResponse?> GetSessionHistoryAsync(int sessionId, int userId)
        {
            try
            {
                // Verify user owns the session
                var ownsSession = await _chatRepository.VerifySessionOwnershipAsync(sessionId, userId);
                if (!ownsSession)
                    return null;

                var session = await _chatRepository.GetSessionByIdAsync(sessionId);
                if (session == null)
                    return null;

                var messages = await _chatRepository.GetSessionMessagesAsync(sessionId);

                var sessionResponse = new ChatSessionResponse
                {
                    ChatSessionId = session.ChatSessionId,
                    SessionTitle = session.SessionTitle,
                    CreationDate = session.CreationDate,
                    IsDelete = session.IsDelete,
                    UserId = session.UserId,
                    MessageCount = messages.Count,
                    LastMessageDate = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault()?.Timestamp
                };

                var messageResponses = messages.Select(m => new ChatMessageResponse
                {
                    MessageId = m.MessageId,
                    ChatSessionId = m.ChatSessionId,
                    SenderType = m.SenderType,
                    MessageContent = m.MessageContent,
                    Timestamp = m.Timestamp
                }).ToList();

                return new ChatHistoryResponse
                {
                    Session = sessionResponse,
                    Messages = messageResponses
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.GetSessionHistoryAsync: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Send a message in a chat session and get AI response
        /// </summary>
        public async Task<SendMessageResponse?> SendMessageAsync(int sessionId, SendMessageRequest request, int userId)
        {
            try
            {
                // Verify user owns the session
                var ownsSession = await _chatRepository.VerifySessionOwnershipAsync(sessionId, userId);
                if (!ownsSession)
                    return null;

                // Get user information for role-based responses
                var user = await _userRepository.GetUserProfile(userId);
                var userRole = user?.Role?.RoleName ?? "Patient";

                // Add user message to database
                var userMessage = new ChatMessage
                {
                    ChatSessionId = sessionId,
                    SenderType = "User",
                    MessageContent = request.MessageContent,
                    Timestamp = DateTime.UtcNow
                };

                var savedUserMessage = await _chatRepository.AddMessageAsync(userMessage);
                if (savedUserMessage == null)
                    return null;

                // Get conversation history for context
                var existingMessages = await _chatRepository.GetSessionMessagesAsync(sessionId);
                var conversationHistory = existingMessages
                    .Where(m => m.MessageId != savedUserMessage.MessageId) // Exclude the just-added message
                    .Select(m => (m.SenderType == "User" ? "user" : "assistant", m.MessageContent))
                    .ToList();

                // Determine which AI provider to use
                // Default to ChatterBot if not specified
                string aiProvider = request.AIProvider ?? "ChatterBot";
                string aiResponseContent;
                string actualProvider;

                try
                {
                    if (aiProvider.Equals("ChatterBot", StringComparison.OrdinalIgnoreCase))
                    {
                        // Use ChatterBot (DEFAULT)
                        _logger.LogInformation("Using ChatterBot for response");
                        aiResponseContent = await _chatterBotService.GetChatResponseAsync(
                            request.MessageContent, 
                            conversationHistory);
                        actualProvider = "ChatterBot";
                    }
                    else if (aiProvider.Equals("Gemini", StringComparison.OrdinalIgnoreCase))
                    {
                        // Use Gemini
                        _logger.LogInformation("Using Gemini for response");
                        aiResponseContent = await _geminiService.GetChatResponseAsync(
                            request.MessageContent, 
                            conversationHistory, 
                            userRole);
                        actualProvider = "Gemini";
                    }
                    else // Auto mode
                    {
                        // Auto mode: Try ChatterBot first, fallback to Gemini
                        _logger.LogInformation("Auto mode: Trying ChatterBot first");
                        try
                        {
                            aiResponseContent = await _chatterBotService.GetChatResponseAsync(
                                request.MessageContent, 
                                conversationHistory);
                            actualProvider = "ChatterBot";
                        }
                        catch (Exception chatterBotEx)
                        {
                            _logger.LogWarning(chatterBotEx, "ChatterBot failed, falling back to Gemini");
                            aiResponseContent = await _geminiService.GetChatResponseAsync(
                                request.MessageContent, 
                                conversationHistory, 
                                userRole);
                            actualProvider = "Gemini";
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error getting AI response from all providers");
                    aiResponseContent = "I apologize, but I'm experiencing technical difficulties right now. Please try again later or consult with a healthcare professional for immediate assistance.";
                    actualProvider = "Error";
                }

                // Add AI response to database
                var aiMessage = new ChatMessage
                {
                    ChatSessionId = sessionId,
                    SenderType = "AI",
                    MessageContent = aiResponseContent,
                    Timestamp = DateTime.UtcNow,
                    AIProvider = actualProvider
                };

                var savedAIMessage = await _chatRepository.AddMessageAsync(aiMessage);

                if (savedAIMessage == null)
                {
                    return new SendMessageResponse
                    {
                        UserMessage = new ChatMessageResponse
                        {
                            MessageId = savedUserMessage.MessageId,
                            ChatSessionId = savedUserMessage.ChatSessionId,
                            SenderType = savedUserMessage.SenderType,
                            MessageContent = savedUserMessage.MessageContent,
                            Timestamp = savedUserMessage.Timestamp
                        },
                        AIMessage = new ChatMessageResponse
                        {
                            MessageId = 0,
                            ChatSessionId = sessionId,
                            SenderType = "AI",
                            MessageContent = aiResponseContent,
                            Timestamp = DateTime.UtcNow
                        },
                        Success = false,
                        ErrorMessage = "Failed to save AI response"
                    };
                }

                return new SendMessageResponse
                {
                    UserMessage = new ChatMessageResponse
                    {
                        MessageId = savedUserMessage.MessageId,
                        ChatSessionId = savedUserMessage.ChatSessionId,
                        SenderType = savedUserMessage.SenderType,
                        MessageContent = savedUserMessage.MessageContent,
                        Timestamp = savedUserMessage.Timestamp
                    },
                    AIMessage = new ChatMessageResponse
                    {
                        MessageId = savedAIMessage.MessageId,
                        ChatSessionId = savedAIMessage.ChatSessionId,
                        SenderType = savedAIMessage.SenderType,
                        MessageContent = savedAIMessage.MessageContent,
                        Timestamp = savedAIMessage.Timestamp
                    },
                    Success = true
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.SendMessageAsync: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Soft delete a chat session
        /// </summary>
        public async Task<bool> DeleteSessionAsync(int sessionId, int userId)
        {
            try
            {
                return await _chatRepository.DeleteSessionAsync(sessionId, userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.DeleteSessionAsync: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Update a chat session's title
        /// </summary>
        public async Task<ChatSessionResponse?> UpdateSessionAsync(int sessionId, string newTitle, int userId)
        {
            try
            {
                // Verify user owns the session
                var ownsSession = await _chatRepository.VerifySessionOwnershipAsync(sessionId, userId);
                if (!ownsSession)
                    return null;

                var session = await _chatRepository.GetSessionByIdAsync(sessionId);
                if (session == null)
                    return null;

                session.SessionTitle = newTitle;
                var updatedSession = await _chatRepository.UpdateSessionAsync(session);

                if (updatedSession == null)
                    return null;

                // We need to count messages for the response
                var messages = await _chatRepository.GetSessionMessagesAsync(sessionId);
                var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();

                return new ChatSessionResponse
                {
                    ChatSessionId = updatedSession.ChatSessionId,
                    SessionTitle = updatedSession.SessionTitle,
                    CreationDate = updatedSession.CreationDate,
                    IsDelete = updatedSession.IsDelete,
                    UserId = updatedSession.UserId,
                    MessageCount = messages.Count,
                    LastMessageDate = lastMessage?.Timestamp
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.UpdateSessionAsync: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Delete a specific message from a chat session
        /// </summary>
        public async Task<bool> DeleteMessageAsync(int messageId, int userId)
        {
            try
            {
                return await _chatRepository.DeleteMessageAsync(messageId, userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.DeleteMessageAsync: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Save a user message to a chat session
        /// </summary>
        public async Task<ChatMessageResponse?> SaveUserMessageAsync(int sessionId, string messageContent, int userId)
        {
            try
            {
                // Verify user owns the session
                var ownsSession = await _chatRepository.VerifySessionOwnershipAsync(sessionId, userId);
                if (!ownsSession)
                    return null;

                var userMessage = new ChatMessage
                {
                    ChatSessionId = sessionId,
                    SenderType = "User",
                    MessageContent = messageContent,
                    Timestamp = DateTime.UtcNow
                };

                var savedMessage = await _chatRepository.AddMessageAsync(userMessage);
                if (savedMessage == null)
                    return null;

                return new ChatMessageResponse
                {
                    MessageId = savedMessage.MessageId,
                    ChatSessionId = savedMessage.ChatSessionId,
                    SenderType = savedMessage.SenderType,
                    MessageContent = savedMessage.MessageContent,
                    Timestamp = savedMessage.Timestamp
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.SaveUserMessageAsync: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Save an assistant message to a chat session
        /// </summary>
        public async Task<ChatMessageResponse?> SaveAssistantMessageAsync(int sessionId, string messageContent, int userId)
        {
            try
            {
                // Verify user owns the session
                var ownsSession = await _chatRepository.VerifySessionOwnershipAsync(sessionId, userId);
                if (!ownsSession)
                    return null;

                var assistantMessage = new ChatMessage
                {
                    ChatSessionId = sessionId,
                    SenderType = "AI",
                    MessageContent = messageContent,
                    Timestamp = DateTime.UtcNow,
                    AIProvider = "Gemini"
                };

                var savedMessage = await _chatRepository.AddMessageAsync(assistantMessage);
                if (savedMessage == null)
                    return null;

                return new ChatMessageResponse
                {
                    MessageId = savedMessage.MessageId,
                    ChatSessionId = savedMessage.ChatSessionId,
                    SenderType = savedMessage.SenderType,
                    MessageContent = savedMessage.MessageContent,
                    Timestamp = savedMessage.Timestamp
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService.SaveAssistantMessageAsync: {ex.Message}");
                return null;
            }
        }
    }
}
