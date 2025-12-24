using System.Text;
using System.Text.Json;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    /// <summary>
    /// Service for interacting with Google AI Studio (Gemini API)
    /// </summary>
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GeminiService> _logger;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Gemini:ApiKey is not configured");
            _baseUrl = configuration["Gemini:BaseUrl"] ?? throw new ArgumentNullException("Gemini:BaseUrl is not configured");
            
            _logger.LogInformation("GeminiService initialized with API endpoint: {BaseUrl}", _baseUrl);
        }

        /// <summary>
        /// Get AI chat response from Google Gemini
        /// </summary>
        public async Task<string> GetChatResponseAsync(
            string userMessage, 
            List<(string role, string content)> conversationHistory, 
            string userRole)
        {
            try
            {
                // Build the complete prompt with system instructions and conversation history
                var prompt = BuildPrompt(userMessage, conversationHistory, userRole);

                // Create request body for Gemini API
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[] { new { text = prompt } }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0.7,
                        topK = 40,
                        topP = 0.95,
                        maxOutputTokens = 1024
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _logger.LogInformation("Sending request to Gemini API for user role: {UserRole}", userRole);

                // Make API call with API key in query parameter
                var response = await _httpClient.PostAsync($"{_baseUrl}?key={_apiKey}", content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Gemini API Error: Status={StatusCode}, Response={ErrorContent}", 
                        response.StatusCode, errorContent);
                    
                    return response.StatusCode switch
                    {
                        System.Net.HttpStatusCode.Unauthorized => 
                            "I apologize, but there's an authentication issue with the AI service. Please contact support.",
                        System.Net.HttpStatusCode.TooManyRequests => 
                            "I'm experiencing high demand right now. Please try again in a moment.",
                        _ => 
                            "I apologize, but I encountered a technical issue. Please try again or consult with a healthcare professional."
                    };
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseString);

                var aiResponse = geminiResponse?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;

                if (string.IsNullOrWhiteSpace(aiResponse))
                {
                    _logger.LogWarning("Gemini API returned empty response");
                    return "I apologize, but I couldn't generate a response. Please try rephrasing your question.";
                }

                _logger.LogInformation("Successfully received AI response (length: {Length} characters)", aiResponse.Length);
                return aiResponse;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Network error calling Gemini API");
                return "I apologize, but I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Timeout calling Gemini API");
                return "I apologize, but the request timed out. Please try again.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error calling Gemini API");
                return "I apologize, but I'm experiencing technical difficulties. Please try again later or consult with a healthcare professional for immediate assistance.";
            }
        }

        /// <summary>
        /// Build comprehensive prompt with medical knowledge base and conversation context
        /// </summary>
        private string BuildPrompt(
            string userMessage, 
            List<(string role, string content)> conversationHistory, 
            string userRole)
        {
            var sb = new StringBuilder();

            // System Instructions
            sb.AppendLine("=== SYSTEM INSTRUCTIONS ===");
            sb.AppendLine("You are a compassionate and knowledgeable medical assistant for the 'Thalassemia Care Hub'.");
            sb.AppendLine("Your goal is to support people with Thalassemia (patients, families, caregivers, and healthcare professionals).");
            sb.AppendLine();

            // Medical Knowledge Base
            sb.AppendLine("=== OFFICIAL MEDICAL KNOWLEDGE BASE ===");
            sb.AppendLine("Source: WHO/Thalassemia International Federation (TIF)");
            sb.AppendLine();
            sb.AppendLine("**1. OVERVIEW**");
            sb.AppendLine("- Thalassemia is a genetic blood disorder (autosomal recessive inheritance)");
            sb.AppendLine("- Types: Alpha Thalassemia (Hydrops Fetalis is fatal) & Beta Thalassemia (Major requires regular transfusions)");
            sb.AppendLine("- Caused by reduced or absent hemoglobin production");
            sb.AppendLine();
            sb.AppendLine("**2. SIGNS & SYMPTOMS**");
            sb.AppendLine("- Fatigue and weakness");
            sb.AppendLine("- Jaundice (yellowing of skin and eyes)");
            sb.AppendLine("- Facial bone deformities (in severe cases)");
            sb.AppendLine("- Dark urine");
            sb.AppendLine("- Slow growth and delayed puberty");
            sb.AppendLine("- Emergency: Heart failure from untreated severe anemia");
            sb.AppendLine();
            sb.AppendLine("**3. TREATMENT OPTIONS**");
            sb.AppendLine("- Blood Transfusions: Every 2-4 weeks (maintain Hemoglobin > 9.5 g/dL)");
            sb.AppendLine("- Iron Chelation Therapy (CRUCIAL to prevent iron overload):");
            sb.AppendLine("  • Deferasirox (Oral medication)");
            sb.AppendLine("  • Deferiprone (Oral medication)");
            sb.AppendLine("  • Deferoxamine (Subcutaneous pump)");
            sb.AppendLine("- Curative Options:");
            sb.AppendLine("  • Bone Marrow Transplant (BMT)");
            sb.AppendLine("  • Gene Therapy (e.g., Zynteglo)");
            sb.AppendLine();
            sb.AppendLine("**4. DIET & NUTRITION**");
            sb.AppendLine("- AVOID: Iron-rich foods (red meat, liver), Vitamin C supplements with meals");
            sb.AppendLine("- RECOMMENDED: Calcium, Vitamin D, Vitamin E, Folic Acid");
            sb.AppendLine("- TIP: Drink black tea with meals to inhibit iron absorption");
            sb.AppendLine();
            sb.AppendLine("**5. LIFESTYLE RECOMMENDATIONS**");
            sb.AppendLine("- Low-impact exercise (walking, swimming, yoga)");
            sb.AppendLine("- Regular vaccinations (Hepatitis B, Influenza, Pneumococcal)");
            sb.AppendLine("- Regular monitoring of iron levels, liver function, heart function");
            sb.AppendLine("- Avoid contact sports (risk of spleen injury)");
            sb.AppendLine();
            sb.AppendLine("**6. IMPORTANT FAQS**");
            sb.AppendLine("- Is thalassemia contagious? NO - it's genetic, not infectious");
            sb.AppendLine("- Can carriers have normal lives? YES - carriers are usually asymptomatic");
            sb.AppendLine("- Should carriers screen before marriage? YES - genetic counseling recommended");
            sb.AppendLine("- Life expectancy: Normal with proper treatment compliance");
            sb.AppendLine();

            // Response Guidelines
            sb.AppendLine("=== RESPONSE GUIDELINES ===");
            sb.AppendLine("1. Do NOT provide specific medical diagnoses");
            sb.AppendLine("2. ALWAYS advise consulting a doctor for severe symptoms or medication changes");
            sb.AppendLine("3. Be concise, empathetic, and use simple language");
            sb.AppendLine("4. Use Markdown formatting for better readability");
            sb.AppendLine("5. For medication doses, provide general information but emphasize doctor's prescription");
            sb.AppendLine("6. Encourage treatment compliance and regular monitoring");
            sb.AppendLine();

            // User Context
            sb.AppendLine($"=== USER CONTEXT ===");
            sb.AppendLine($"User Role: {userRole}");
            sb.AppendLine();

            // Conversation History (last 5 messages for context)
            if (conversationHistory.Any())
            {
                sb.AppendLine("=== CONVERSATION HISTORY ===");
                foreach (var msg in conversationHistory.TakeLast(5))
                {
                    var speaker = msg.role == "user" ? "User" : "Assistant";
                    sb.AppendLine($"{speaker}: {msg.content}");
                }
                sb.AppendLine();
            }

            // Current User Message
            sb.AppendLine("=== CURRENT USER MESSAGE ===");
            sb.AppendLine($"User: {userMessage}");
            sb.AppendLine();
            sb.AppendLine("Assistant:");

            return sb.ToString();
        }
    }

    #region Response DTOs

    /// <summary>
    /// Gemini API response structure
    /// </summary>
    public class GeminiResponse
    {
        public Candidate[]? candidates { get; set; }
    }

    public class Candidate
    {
        public Content? content { get; set; }
    }

    public class Content
    {
        public Part[]? parts { get; set; }
    }

    public class Part
    {
        public string? text { get; set; }
    }

    #endregion
}
