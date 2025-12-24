namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for email service operations
    /// </summary>
    public interface IEmailService
    {
        /// <summary>
        /// Sends a verification email with the verification code to the user
        /// </summary>
        /// <param name="email">Recipient email address</param>
        /// <param name="firstName">Recipient first name</param>
        /// <param name="verificationCode">6-digit verification code</param>
        /// <returns>True if email was sent successfully, false otherwise</returns>
        Task<bool> SendVerificationEmailAsync(string email, string firstName, int verificationCode);

        /// <summary>
        /// Sends a password reset email with the verification code to the user
        /// </summary>
        /// <param name="email">Recipient email address</param>
        /// <param name="firstName">Recipient first name</param>
        /// <param name="resetCode">6-digit reset code</param>
        /// <returns>True if email was sent successfully, false otherwise</returns>
        Task<bool> SendPasswordResetEmailAsync(string email, string firstName, int resetCode);
    }
}

