using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for chat repository operations
    /// </summary>
    public interface IChatRepository
    {
        /// <summary>
        /// Create a new chat session
        /// </summary>
        /// <param name="session">Chat session to create</param>
        /// <returns>Created chat session</returns>
        Task<ChatSession?> CreateSessionAsync(ChatSession session);

        /// <summary>
        /// Get all chat sessions for a user
        /// </summary>
        /// <param name="userId">ID of the user</param>
        /// <returns>List of chat sessions for the user</returns>
        Task<List<ChatSession>> GetUserSessionsAsync(int userId);

        /// <summary>
        /// Get a specific chat session by ID
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <returns>Chat session if found</returns>
        Task<ChatSession?> GetSessionByIdAsync(int sessionId);

        /// <summary>
        /// Get all messages for a chat session
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <returns>List of messages in the session</returns>
        Task<List<ChatMessage>> GetSessionMessagesAsync(int sessionId);

        /// <summary>
        /// Add a message to a chat session
        /// </summary>
        /// <param name="message">Message to add</param>
        /// <returns>Created message</returns>
        Task<ChatMessage?> AddMessageAsync(ChatMessage message);

        /// <summary>
        /// Update a chat session
        /// </summary>
        /// <param name="session">Updated chat session</param>
        /// <returns>Updated chat session</returns>
        Task<ChatSession?> UpdateSessionAsync(ChatSession session);

        /// <summary>
        /// Soft delete a chat session
        /// </summary>
        /// <param name="sessionId">ID of the session to delete</param>
        /// <param name="userId">ID of the user requesting deletion</param>
        /// <returns>True if deletion was successful</returns>
        Task<bool> DeleteSessionAsync(int sessionId, int userId);

        /// <summary>
        /// Get a specific message by ID
        /// </summary>
        /// <param name="messageId">ID of the message</param>
        /// <returns>Message if found</returns>
        Task<ChatMessage?> GetMessageByIdAsync(int messageId);

        /// <summary>
        /// Soft delete a message
        /// </summary>
        /// <param name="messageId">ID of the message to delete</param>
        /// <param name="userId">ID of the user requesting deletion</param>
        /// <returns>True if deletion was successful</returns>
        Task<bool> DeleteMessageAsync(int messageId, int userId);

        /// <summary>
        /// Verify that a user owns a chat session
        /// </summary>
        /// <param name="sessionId">ID of the chat session</param>
        /// <param name="userId">ID of the user</param>
        /// <returns>True if user owns the session</returns>
        Task<bool> VerifySessionOwnershipAsync(int sessionId, int userId);
    }
}
