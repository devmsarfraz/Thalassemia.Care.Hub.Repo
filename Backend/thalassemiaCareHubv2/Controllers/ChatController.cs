using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
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
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly string _geminiApiKey;
        private readonly string _geminiApiUrl;

        public ChatController(IChatService chatService, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _chatService = chatService;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _geminiApiKey = _configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini:ApiKey");
            _geminiApiUrl = _configuration["Gemini:ApiUrl"] ?? throw new ArgumentNullException("Gemini:ApiUrl");
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

        // OLD ENDPOINT - Using Python Chatbot (Commented out)
        /*
        /// <summary>
        /// Send a message to the AI chatbot in a specific session (OLD - Python Chatbot)
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
        */

        /// <summary>
        /// Send a message to the AI chatbot using Google Gemini API
        /// </summary>
        /// <param name="sessionId">Chat session ID</param>
        /// <param name="request">Message to send</param>
        /// <returns>User message and AI response from Gemini</returns>
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
        public async Task<ActionResult<SendMessageResponse>> SendMessageWithGemini(int sessionId, [FromBody] SendMessageRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "User not authenticated" });

                if (string.IsNullOrWhiteSpace(request.MessageContent))
                    return BadRequest(new { message = "Message content cannot be empty" });

                // Verify session exists and belongs to user
                var session = await _chatService.GetSessionHistoryAsync(sessionId, userId.Value);
                if (session == null)
                    return NotFound(new { message = "Session not found or you don't have permission to send messages to it" });

                // Save user message to database
                var userMessage = await _chatService.SaveUserMessageAsync(sessionId, request.MessageContent, userId.Value);
                if (userMessage == null)
                    return BadRequest(new { message = "Failed to save user message" });

                // Get AI response from Gemini
                var aiResponse = await GetGeminiResponseAsync(request.MessageContent, session.Messages);
                
                // Save AI response to database
                var assistantMessage = await _chatService.SaveAssistantMessageAsync(sessionId, aiResponse, userId.Value);
                if (assistantMessage == null)
                    return BadRequest(new { message = "Failed to save AI response" });

                return Ok(new SendMessageResponse
                {
                    UserMessage = userMessage,
                    AIMessage = assistantMessage
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SendMessageWithGemini: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        /// <summary>
        /// Get AI response from Google Gemini API
        /// </summary>
        private async Task<string> GetGeminiResponseAsync(string userMessage, List<ChatMessageResponse> conversationHistory)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                
                // Build conversation context
                var contents = new List<object>();
                
                // Add system instruction as first message
                contents.Add(new
                {
                    role = "user",
                    parts = new[] { new { text = "You are a helpful AI assistant specialized in Thalassemia care and health information. Provide accurate, empathetic, and informative responses to help patients and caregivers." } }
                });
                contents.Add(new
                {
                    role = "model",
                    parts = new[] { new { text = "I understand. I'm here to help with Thalassemia-related questions and provide supportive, accurate health information." } }
                });

                // Add conversation history (last 10 messages for context)
                var recentMessages = conversationHistory.TakeLast(10).ToList();
                foreach (var msg in recentMessages)
                {
                    contents.Add(new
                    {
                        role = msg.SenderType == "User" ? "user" : "model",
                        parts = new[] { new { text = msg.MessageContent } }
                    });
                }

                // Add current user message
                contents.Add(new
                {
                    role = "user",
                    parts = new[] { new { text = userMessage } }
                });

                // Prepare request body
                var requestBody = new
                {
                    contents = contents,
                    generationConfig = new
                    {
                        temperature = 0.7,
                        topK = 40,
                        topP = 0.95,
                        maxOutputTokens = 1024
                    }
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // Make API call
                var response = await httpClient.PostAsync($"{_geminiApiUrl}?key={_geminiApiKey}", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Gemini API error: {responseContent}");
                    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
                }

                // Parse response
                using var jsonDoc = JsonDocument.Parse(responseContent);
                var candidates = jsonDoc.RootElement.GetProperty("candidates");
                if (candidates.GetArrayLength() > 0)
                {
                    var firstCandidate = candidates[0];
                    var content_property = firstCandidate.GetProperty("content");
                    var parts = content_property.GetProperty("parts");
                    if (parts.GetArrayLength() > 0)
                    {
                        return parts[0].GetProperty("text").GetString() ?? "I apologize, but I couldn't generate a response.";
                    }
                }

                return "I apologize, but I couldn't generate a response. Please try again.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling Gemini API: {ex.Message}");
                return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
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
