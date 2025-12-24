namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for DeepSeek AI service operations
    /// </summary>
    public interface IDeepSeekService
    {
        /// <summary>
        /// Get AI response from DeepSeek API
        /// </summary>
        /// <param name="userMessage">The user's message</param>
        /// <param name="conversationHistory">Previous conversation context</param>
        /// <param name="userRole">User's role (Patient, Caregiver, Admin)</param>
        /// <returns>AI response message</returns>
        Task<string> GetChatResponseAsync(string userMessage, List<(string role, string content)> conversationHistory, string userRole);

        /// <summary>
        /// Check if the DeepSeek service is available
        /// </summary>
        /// <returns>True if service is available</returns>
        Task<bool> IsServiceAvailableAsync();
    }
}
