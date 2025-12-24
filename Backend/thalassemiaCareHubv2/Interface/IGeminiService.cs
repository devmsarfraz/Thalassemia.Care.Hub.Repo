namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for Google Gemini AI Service
    /// </summary>
    public interface IGeminiService
    {
        /// <summary>
        /// Get a response from the Gemini AI model
        /// </summary>
        /// <param name="userMessage">The user's current message</param>
        /// <param name="conversationHistory">Previous messages for context</param>
        /// <param name="userRole">Role of the user (Patient/Caregiver)</param>
        /// <returns>The AI's response text</returns>
        Task<string> GetChatResponseAsync(string userMessage, List<(string role, string content)> conversationHistory, string userRole);
    }
}
