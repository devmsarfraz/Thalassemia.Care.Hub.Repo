using System.Text;
using System.Text.Json;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    /// <summary>
    /// Service for communicating with Python ChatterBot API
    /// </summary>
    public class ChatterBotService : IChatterBotService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ChatterBotService> _logger;
        private readonly string _baseUrl;
        private readonly int _timeout;

        public ChatterBotService(
            HttpClient httpClient, 
            IConfiguration configuration, 
            ILogger<ChatterBotService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            
            // Get configuration - BaseUrl should include /api
            _baseUrl = configuration["ChatterBot:BaseUrl"] ?? "http://localhost:5000/api";
            _timeout = int.Parse(configuration["ChatterBot:Timeout"] ?? "30");
            
            // Configure HTTP client timeout only (don't set BaseAddress)
            _httpClient.Timeout = TimeSpan.FromSeconds(_timeout);
            
            _logger.LogInformation("ChatterBotService initialized with base URL: {BaseUrl}", _baseUrl);
        }

        /// <summary>
        /// Get chat response from ChatterBot Python service
        /// </summary>
        public async Task<string> GetChatResponseAsync(
            string message, 
            List<(string role, string content)> conversationHistory)
        {
            try
            {
                _logger.LogInformation("Sending message to ChatterBot: {Message}", message.Substring(0, Math.Min(50, message.Length)));

                // Prepare request body
                var requestBody = new
                {
                    message = message,
                    session_id = Guid.NewGuid().ToString()
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Send request to Python service
                var response = await _httpClient.PostAsync($"{_baseUrl}/chat", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("ChatterBot API Error: Status={StatusCode}, Response={ErrorContent}", 
                        response.StatusCode, errorContent);
                    
                    throw new HttpRequestException($"ChatterBot service returned {response.StatusCode}");
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var chatResponse = JsonSerializer.Deserialize<ChatterBotResponse>(responseString);

                if (chatResponse == null || string.IsNullOrWhiteSpace(chatResponse.Response))
                {
                    _logger.LogWarning("ChatterBot returned empty response");
                    return "I apologize, but I couldn't generate a response. Please try again.";
                }

                _logger.LogInformation("ChatterBot response received (confidence: {Confidence:P})", chatResponse.Confidence);
                
                return chatResponse.Response;
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "ChatterBot request timed out");
                throw new TimeoutException("ChatterBot service request timed out", ex);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Error communicating with ChatterBot service");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling ChatterBot service");
                throw;
            }
        }

        /// <summary>
        /// Check if ChatterBot service is healthy
        /// </summary>
        public async Task<bool> IsHealthyAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/health");
                
                if (!response.IsSuccessStatusCode)
                {
                    return false;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var healthResponse = JsonSerializer.Deserialize<ChatterBotHealthResponse>(responseString);

                return healthResponse?.Status == "healthy";
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "ChatterBot health check failed");
                return false;
            }
        }

        /// <summary>
        /// Get training status from ChatterBot service
        /// </summary>
        public async Task<ChatterBotStatus?> GetStatusAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/status");
                
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var statusResponse = JsonSerializer.Deserialize<ChatterBotStatusResponse>(responseString);

                if (statusResponse?.Status == null)
                {
                    return null;
                }

                return new ChatterBotStatus
                {
                    TotalQuestions = statusResponse.Status.TotalQuestions,
                    IsTrained = statusResponse.Status.IsTrained,
                    ModelDimension = statusResponse.Status.ModelName,
                    SimilarityThreshold = statusResponse.Status.SimilarityThreshold
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting ChatterBot status");
                return null;
            }
        }

        /// <summary>
        /// Train ChatterBot with new conversation data
        /// </summary>
        public async Task<bool> TrainAsync(List<(string question, string answer)> conversations)
        {
            try
            {
                _logger.LogInformation("Training ChatterBot with {Count} conversations", conversations.Count);

                var requestBody = new
                {
                    conversations = conversations.Select(c => new
                    {
                        question = c.question,
                        answer = c.answer
                    }).ToList()
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_baseUrl}/train", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("ChatterBot training failed: {StatusCode}", response.StatusCode);
                    return false;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var trainResponse = JsonSerializer.Deserialize<ChatterBotTrainResponse>(responseString);

                return trainResponse?.Success ?? false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error training ChatterBot");
                return false;
            }
        }

        #region Response DTOs

        private class ChatterBotResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("success")]
            public bool Success { get; set; }
            
            [System.Text.Json.Serialization.JsonPropertyName("message")]
            public string Message { get; set; } = string.Empty;
            
            [System.Text.Json.Serialization.JsonPropertyName("response")]
            public string Response { get; set; } = string.Empty;
            
            [System.Text.Json.Serialization.JsonPropertyName("confidence")]
            public double Confidence { get; set; }
            
            [System.Text.Json.Serialization.JsonPropertyName("session_id")]
            public string? SessionId { get; set; }
        }

        private class ChatterBotHealthResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("status")]
            public string Status { get; set; } = string.Empty;
            
            [System.Text.Json.Serialization.JsonPropertyName("service")]
            public string Service { get; set; } = string.Empty;
            
            [System.Text.Json.Serialization.JsonPropertyName("version")]
            public string Version { get; set; } = string.Empty;
        }

        private class ChatterBotStatusResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("success")]
            public bool Success { get; set; }
            
            [System.Text.Json.Serialization.JsonPropertyName("status")]
            public StatusData? Status { get; set; }

            public class StatusData
            {
                [System.Text.Json.Serialization.JsonPropertyName("total_questions")]
                public int TotalQuestions { get; set; }
                
                [System.Text.Json.Serialization.JsonPropertyName("is_trained")]
                public bool IsTrained { get; set; }
                
                [System.Text.Json.Serialization.JsonPropertyName("model_name")]
                public int ModelName { get; set; }
                
                [System.Text.Json.Serialization.JsonPropertyName("similarity_threshold")]
                public double SimilarityThreshold { get; set; }
            }
        }

        private class ChatterBotTrainResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("success")]
            public bool Success { get; set; }
            
            [System.Text.Json.Serialization.JsonPropertyName("message")]
            public string Message { get; set; } = string.Empty;
            
            [System.Text.Json.Serialization.JsonPropertyName("count")]
            public int Count { get; set; }
        }

        #endregion
    }
}
