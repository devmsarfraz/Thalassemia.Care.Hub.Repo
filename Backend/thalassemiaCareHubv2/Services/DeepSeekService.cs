using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    /// <summary>
    /// Service for integrating with DeepSeek API
    /// </summary>
    public class DeepSeekService : IDeepSeekService
    {
        private readonly HttpClient _httpClient;
        private readonly DeepSeekOptions _options;
        private readonly ILogger<DeepSeekService> _logger;

        public DeepSeekService(HttpClient httpClient, IConfiguration configuration, ILogger<DeepSeekService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            // Load configuration from appsettings
            _options = new DeepSeekOptions();
            configuration.GetSection("DeepSeek").Bind(_options);

            // Validate configuration
            if (string.IsNullOrEmpty(_options.ApiKey))
            {
                _logger.LogError("DeepSeek API key is not configured");
                throw new InvalidOperationException("DeepSeek API key is not configured");
            }

            if (string.IsNullOrEmpty(_options.BaseUrl))
            {
                _logger.LogError("DeepSeek BaseUrl is not configured");
                throw new InvalidOperationException("DeepSeek BaseUrl is not configured");
            }

            // Configure HTTP client
            _httpClient.BaseAddress = new Uri(_options.BaseUrl);
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_options.ApiKey}");
            
            _logger.LogInformation("DeepSeek service initialized with BaseUrl: {BaseUrl}, Model: {Model}", _options.BaseUrl, _options.Model);
        }

        /// <summary>
        /// Get AI response from DeepSeek API
        /// </summary>
        public async Task<string> GetChatResponseAsync(string userMessage, List<(string role, string content)> conversationHistory, string userRole)
        {
            try
            {
                // Build system prompt based on user role
                var systemPrompt = BuildSystemPrompt(userRole);

                // Prepare messages for API
                var messages = new List<DeepSeekMessage>
                {
                    new DeepSeekMessage { Role = "system", Content = systemPrompt }
                };

                // Add conversation history
                foreach (var (role, content) in conversationHistory)
                {
                    messages.Add(new DeepSeekMessage 
                    { 
                        Role = role == "User" ? "user" : "assistant", 
                        Content = content 
                    });
                }

                // Add current user message
                messages.Add(new DeepSeekMessage { Role = "user", Content = userMessage });

                // Create request
                var request = new DeepSeekRequest
                {
                    Model = _options.Model,
                    Messages = messages,
                    MaxTokens = _options.MaxTokens,
                    Temperature = _options.Temperature
                };

                // Serialize and send request
                var jsonContent = JsonSerializer.Serialize(request, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                _logger.LogInformation("Sending request to DeepSeek API. User role: {UserRole}, Message length: {MessageLength}, BaseUrl: {BaseUrl}, Messages count: {MessagesCount}", 
                    userRole, userMessage.Length, _httpClient.BaseAddress, messages.Count);
                
                // Log the request for debugging (without sensitive data)
                _logger.LogDebug("DeepSeek Request: {RequestJson}", jsonContent.Replace(_options.ApiKey, "***REDACTED***"));

                var response = await _httpClient.PostAsync("", httpContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("DeepSeek API error: {StatusCode} - {Content} - Headers: {Headers}", 
                        response.StatusCode, errorContent, string.Join(", ", response.Headers.Select(h => $"{h.Key}={string.Join(";", h.Value)}")));
                    return $"I apologize, but I'm experiencing technical difficulties right now. API error: {response.StatusCode}. Please try again later or consult with a healthcare professional for immediate assistance.";
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("DeepSeek API response received. Response length: {ResponseLength}", responseContent.Length);

                DeepSeekResponse? deepSeekResponse;
                try
                {
                    deepSeekResponse = JsonSerializer.Deserialize<DeepSeekResponse>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to deserialize DeepSeek API response. Response: {ResponseContent}", responseContent);
                    return "I apologize, but I couldn't process the AI response. Please try again or consult with a healthcare professional.";
                }

                if (deepSeekResponse?.Choices?.Any() == true)
                {
                    var aiResponse = deepSeekResponse.Choices.First().Message?.Content ?? "I apologize, but I couldn't generate a proper response.";
                    _logger.LogInformation("Successfully received AI response. Response length: {ResponseLength}", aiResponse.Length);
                    return aiResponse;
                }

                _logger.LogWarning("DeepSeek API response had no choices. Response: {ResponseContent}", responseContent);
                return "I apologize, but I couldn't process your request properly. Please try rephrasing your question or consult with a healthcare professional.";
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error while calling DeepSeek API");
                return "I'm having trouble connecting to my knowledge base right now. Please try again later or speak with a healthcare professional for immediate assistance.";
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Timeout while calling DeepSeek API");
                return "The request is taking longer than expected. Please try again or contact a healthcare professional for urgent matters.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while calling DeepSeek API");
                return "I encountered an unexpected issue. Please try again later or consult with a healthcare professional if you need immediate help.";
            }
        }

        /// <summary>
        /// Check if the DeepSeek service is available
        /// </summary>
        public async Task<bool> IsServiceAvailableAsync()
        {
            try
            {
                // Simple health check - try a minimal request
                var testRequest = new DeepSeekRequest
                {
                    Model = _options.Model,
                    Messages = new List<DeepSeekMessage>
                    {
                        new DeepSeekMessage { Role = "user", Content = "Hello" }
                    },
                    MaxTokens = 10
                };

                var jsonContent = JsonSerializer.Serialize(testRequest, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                using var response = await _httpClient.PostAsync("", httpContent);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Build system prompt based on user role for thalassemia-specific guidance
        /// </summary>
        private string BuildSystemPrompt(string userRole)
        {
            var basePrompt = @"You are a specialized medical AI assistant for the Thalassemia Care Hub platform. 
Your primary role is to provide helpful, supportive, and informative responses about thalassemia management, 
symptoms, treatments, and care. Always prioritize user safety and recommend consulting healthcare professionals 
for medical advice.";

            var roleSpecificPrompt = userRole?.ToLower() switch
            {
                "patient" => @"

USER CONTEXT: You are speaking with a thalassemia patient.
- Provide empathetic, supportive responses about daily management
- Help with symptom understanding and when to seek medical attention
- Share information about treatment compliance and lifestyle management
- Always remind them to consult their healthcare team for medical decisions",

                "caregiver" => @"

USER CONTEXT: You are speaking with a caregiver of a thalassemia patient.
- Provide guidance on patient care, monitoring, and support
- Help with understanding treatment protocols and medication management
- Offer advice on emotional support and daily care routines
- Emphasize the importance of maintaining communication with healthcare providers",

                "admin" => @"

USER CONTEXT: You are speaking with a platform administrator.
- Provide information about system capabilities and user support protocols
- Help with understanding platform features and user management
- Offer guidance on content management and community oversight",

                _ => @"

USER CONTEXT: You are speaking with a general user.
- Provide general information about thalassemia and available resources
- Guide them toward appropriate platform features or professional consultation
- Offer supportive, educational responses about the condition"
            };

            var safetyPrompt = @"

IMPORTANT SAFETY GUIDELINES:
- Never provide specific medical diagnoses or treatment recommendations
- Always recommend consulting healthcare professionals for medical concerns
- For emergency situations, instruct users to contact emergency services immediately
- Focus on general information, support, and guidance within your knowledge base
- If uncertain about medical information, recommend professional consultation";

            return basePrompt + roleSpecificPrompt + safetyPrompt;
        }
    }
}
