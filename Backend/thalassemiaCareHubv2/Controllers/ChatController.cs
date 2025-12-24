using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Controllers
{
    /// <summary>
    /// Controller for AI chatbot operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        /// <summary>
        /// Create a new chat session
        /// </summary>
        /// <param name="request">Chat session creation request</param>
        /// <returns>Created chat session details</returns>
        /// <response code="200">Session created successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="400">Failed to create session</response>
        [HttpPost("session")]
        //[Authorize]
        [ProducesResponseType(typeof(ChatSessionResponse), 200)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult<ChatSessionResponse>> CreateSession([FromBody] CreateChatSessionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var result = await _chatService.CreateSessionAsync(request, userId.Value);
                if (result == null)
                    return BadRequest(new { message = "Failed to create chat session" });

                return CreatedAtAction(nameof(GetSessionHistory), new { sessionId = result.ChatSessionId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get all chat sessions for the current user
        /// </summary>
        /// <returns>List of user's chat sessions</returns>
        /// <response code="200">Sessions retrieved successfully</response>
        /// <response code="401">User not authenticated</response>
        [HttpGet("history")]
        [Authorize]
        [ProducesResponseType(typeof(List<ChatSessionResponse>), 200)]
        [ProducesResponseType(typeof(object), 401)]
        public async Task<ActionResult<List<ChatSessionResponse>>> GetUserSessions()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var sessions = await _chatService.GetUserSessionsAsync(userId.Value);
                return Ok(sessions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get chat history (messages) for a specific session
        /// </summary>
        /// <param name="sessionId">Chat session ID</param>
        /// <returns>Chat session with messages</returns>
        /// <response code="200">Session history retrieved successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="404">Session not found or access denied</response>
        [HttpGet("history/{sessionId}")]
        [Authorize]
        [ProducesResponseType(typeof(ChatHistoryResponse), 200)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult<ChatHistoryResponse>> GetSessionHistory(int sessionId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var history = await _chatService.GetSessionHistoryAsync(sessionId, userId.Value);
                if (history == null)
                    return NotFound(new { message = "Session not found or you don't have permission to access it" });

                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Send a message to the AI chatbot in a specific session
        /// </summary>
        /// <param name="sessionId">Chat session ID</param>
        /// <param name="request">Message to send</param>
        /// <returns>User message and AI response</returns>
        /// <response code="200">Message sent and AI responded successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="404">Session not found or access denied</response>
        /// <response code="400">Failed to send message or get AI response</response>
        [HttpPost("session/{sessionId}/message")]
        [Authorize]
        [ProducesResponseType(typeof(SendMessageResponse), 200)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult<SendMessageResponse>> SendMessage(int sessionId, [FromBody] SendMessageRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                if (string.IsNullOrWhiteSpace(request.MessageContent))
                    return BadRequest(new { message = "Message content cannot be empty" });

                var response = await _chatService.SendMessageAsync(sessionId, request, userId.Value);
                if (response == null)
                    return NotFound(new { message = "Session not found or you don't have permission to send messages to it" });

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Update a chat session title
        /// </summary>
        /// <param name="sessionId">Chat session ID</param>
        /// <param name="request">Update request containing new title</param>
        /// <returns>Updated chat session</returns>
        /// <response code="200">Session updated successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="404">Session not found or access denied</response>
        [HttpPut("session/{sessionId}")]
        [Authorize]
        [ProducesResponseType(typeof(ChatSessionResponse), 200)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult<ChatSessionResponse>> UpdateSession(int sessionId, [FromBody] UpdateChatSessionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                if (string.IsNullOrWhiteSpace(request.SessionTitle))
                    return BadRequest(new { message = "Session title cannot be empty" });

                var result = await _chatService.UpdateSessionAsync(sessionId, request.SessionTitle, userId.Value);
                if (result == null)
                    return NotFound(new { message = "Session not found or you don't have permission to update it" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Delete a chat session (soft delete)
        /// </summary>
        /// <param name="sessionId">Chat session ID to delete</param>
        /// <returns>Success status</returns>
        /// <response code="204">Session deleted successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="404">Session not found or access denied</response>
        [HttpDelete("session/{sessionId}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult> DeleteSession(int sessionId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var success = await _chatService.DeleteSessionAsync(sessionId, userId.Value);
                if (!success)
                    return NotFound(new { message = "Session not found or you don't have permission to delete it" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Delete a specific message from a chat session
        /// </summary>
        /// <param name="messageId">Message ID to delete</param>
        /// <returns>Success status</returns>
        /// <response code="204">Message deleted successfully</response>
        /// <response code="401">User not authenticated</response>
        /// <response code="404">Message not found or access denied</response>
        [HttpDelete("message/{messageId}")]
        [Authorize]
        [ProducesResponseType(204)]
        [ProducesResponseType(typeof(object), 401)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult> DeleteMessage(int messageId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                var success = await _chatService.DeleteMessageAsync(messageId, userId.Value);
                if (!success)
                    return NotFound(new { message = "Message not found or you don't have permission to delete it" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Helper method to get current user ID from JWT claims
        /// </summary>
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }
    }
}
