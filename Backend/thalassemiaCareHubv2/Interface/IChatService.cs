using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for chat service operations
    /// </summary>
    public interface IChatService
    {
        /// <summary>
        /// Create a new chat session for a user
        /// </summary>
        /// <param name="request">Chat session creation request</param>
        /// <param name="userId">ID of the user creating the session</param>
        /// <returns>Created chat session response</returns>
        Task<ChatSessionResponse?> CreateSessionAsync(CreateChatSessionRequest request, int userId);

        /// <summary>
        /// Get all chat sessions for a user
        /// </summary>
        /// <param name="userId">ID of the user</param>
        /// <returns>List of user's chat sessions</returns>
        Task<List<ChatSessionResponse>> GetUserSessionsAsync(int userId);

        /// <summary>
        /// Get chat history (messages) for a specific session
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <param name="userId">ID of the user requesting the history</param>
        /// <returns>Chat history with messages</returns>
        Task<ChatHistoryResponse?> GetSessionHistoryAsync(int sessionId, int userId);

        /// <summary>
        /// Send a message in a chat session and get AI response
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <param name="request">Message to send</param>
        /// <param name="userId">ID of the user sending the message</param>
        /// <returns>Response containing user message and AI response</returns>
        Task<SendMessageResponse?> SendMessageAsync(int sessionId, SendMessageRequest request, int userId);

        /// <summary>
        /// Soft delete a chat session
        /// </summary>
        /// <param name="sessionId">ID of the chat session to delete</param>
        /// <param name="userId">ID of the user requesting deletion</param>
        /// <returns>True if deletion was successful</returns>
        Task<bool> DeleteSessionAsync(int sessionId, int userId);

        /// <summary>
        /// Update a chat session's title
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <param name="newTitle">New title for the session</param>
        /// <param name="userId">ID of the user owning the session</param>
        /// <returns>Updated chat session response</returns>
        Task<ChatSessionResponse?> UpdateSessionAsync(int sessionId, string newTitle, int userId);

        /// <summary>
        /// Delete a specific message from a chat session
        /// </summary>
        /// <param name="messageId">ID of the message to delete</param>
        /// <param name="userId">ID of the user requesting deletion</param>
        /// <returns>True if deletion was successful</returns>
        Task<bool> DeleteMessageAsync(int messageId, int userId);
    }
}
