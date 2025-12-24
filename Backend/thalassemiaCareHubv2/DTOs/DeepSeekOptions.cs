namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Configuration options for DeepSeek API integration
    /// </summary>
    public class DeepSeekOptions
    {
        /// <summary>
        /// API key for DeepSeek service
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for DeepSeek API
        /// </summary>
        public string BaseUrl { get; set; } = string.Empty;

        /// <summary>
        /// Model to use for chat completions
        /// </summary>
        public string Model { get; set; } = "deepseek-chat";

        /// <summary>
        /// Maximum tokens for responses
        /// </summary>
        public int MaxTokens { get; set; } = 1000;

        /// <summary>
        /// Temperature for response generation (0.0 to 1.0)
        /// </summary>
        public double Temperature { get; set; } = 0.7;
    }
}
