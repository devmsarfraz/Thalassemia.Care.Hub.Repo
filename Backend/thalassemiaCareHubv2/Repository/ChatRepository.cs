using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Repository
{
    /// <summary>
    /// Repository for chat-related database operations
    /// </summary>
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _context;

        public ChatRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Create a new chat session
        /// </summary>
        public async Task<ChatSession?> CreateSessionAsync(ChatSession session)
        {
            try
            {
                _context.ChatSessions.Add(session);
                await _context.SaveChangesAsync();
                return session;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating chat session: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Get all chat sessions for a user
        /// </summary>
        public async Task<List<ChatSession>> GetUserSessionsAsync(int userId)
        {
            try
            {
                var sessions = await _context.ChatSessions
                    .Where(s => s.UserId == userId && !s.IsDelete)
                    .OrderByDescending(s => s.CreationDate)
                    .ToListAsync();

                return sessions;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting user sessions: {ex.Message}");
                return new List<ChatSession>();
            }
        }

        /// <summary>
        /// Get a specific chat session by ID
        /// </summary>
        public async Task<ChatSession?> GetSessionByIdAsync(int sessionId)
        {
            try
            {
                var session = await _context.ChatSessions
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.ChatSessionId == sessionId && !s.IsDelete);

                return session;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting session by ID: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Get all messages for a chat session
        /// </summary>
        public async Task<List<ChatMessage>> GetSessionMessagesAsync(int sessionId)
        {
            try
            {
                var messages = await _context.ChatMessages
                    .Where(m => m.ChatSessionId == sessionId)
                    .OrderBy(m => m.Timestamp)
                    .ToListAsync();

                return messages;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting session messages: {ex.Message}");
                return new List<ChatMessage>();
            }
        }

        /// <summary>
        /// Add a message to a chat session
        /// </summary>
        public async Task<ChatMessage?> AddMessageAsync(ChatMessage message)
        {
            try
            {
                _context.ChatMessages.Add(message);
                await _context.SaveChangesAsync();
                return message;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding message: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Update a chat session
        /// </summary>
        public async Task<ChatSession?> UpdateSessionAsync(ChatSession session)
        {
            try
            {
                _context.ChatSessions.Update(session);
                await _context.SaveChangesAsync();
                return session;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating session: {ex.Message}");
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
                var session = await _context.ChatSessions
                    .FirstOrDefaultAsync(s => s.ChatSessionId == sessionId && s.UserId == userId && !s.IsDelete);

                if (session == null)
                    return false;

                session.IsDelete = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting session: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Get a specific message by ID
        /// </summary>
        public async Task<ChatMessage?> GetMessageByIdAsync(int messageId)
        {
            try
            {
                var message = await _context.ChatMessages
                    .Include(m => m.ChatSession)
                    .FirstOrDefaultAsync(m => m.MessageId == messageId);

                return message;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting message by ID: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Soft delete a message (implemented as hard delete for messages since they don't have IsDelete flag)
        /// </summary>
        public async Task<bool> DeleteMessageAsync(int messageId, int userId)
        {
            try
            {
                var message = await _context.ChatMessages
                    .Include(m => m.ChatSession)
                    .FirstOrDefaultAsync(m => m.MessageId == messageId && m.ChatSession.UserId == userId);

                if (message == null)
                    return false;

                _context.ChatMessages.Remove(message);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting message: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Verify that a user owns a chat session
        /// </summary>
        public async Task<bool> VerifySessionOwnershipAsync(int sessionId, int userId)
        {
            try
            {
                var session = await _context.ChatSessions
                    .FirstOrDefaultAsync(s => s.ChatSessionId == sessionId && s.UserId == userId && !s.IsDelete);

                return session != null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error verifying session ownership: {ex.Message}");
                return false;
            }
        }
    }
}
