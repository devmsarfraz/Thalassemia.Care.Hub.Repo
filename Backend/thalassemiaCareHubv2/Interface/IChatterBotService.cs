namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for ChatterBot Python service integration
    /// </summary>
    public interface IChatterBotService
    {
        /// <summary>
        /// Get chat response from ChatterBot Python service
        /// </summary>
        /// <param name="message">User message</param>
        /// <param name="conversationHistory">Previous conversation context</param>
        /// <returns>Bot response string</returns>
        Task<string> GetChatResponseAsync(string message, List<(string role, string content)> conversationHistory);

        /// <summary>
        /// Check if ChatterBot service is healthy and available
        /// </summary>
        /// <returns>True if service is healthy, false otherwise</returns>
        Task<bool> IsHealthyAsync();

        /// <summary>
        /// Get training status from ChatterBot service
        /// </summary>
        /// <returns>Training status information</returns>
        Task<ChatterBotStatus?> GetStatusAsync();

        /// <summary>
        /// Train ChatterBot with new conversation data
        /// </summary>
        /// <param name="conversations">List of question-answer pairs</param>
        /// <returns>True if training successful, false otherwise</returns>
        Task<bool> TrainAsync(List<(string question, string answer)> conversations);
    }

    /// <summary>
    /// ChatterBot service status information
    /// </summary>
    public class ChatterBotStatus
    {
        public int TotalQuestions { get; set; }
        public bool IsTrained { get; set; }
        public int ModelDimension { get; set; }
        public double SimilarityThreshold { get; set; }
    }
}
