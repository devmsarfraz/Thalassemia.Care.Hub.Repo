namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for email verification
    /// </summary>
    public class VerifyEmailRequest
    {
        /// <summary>
        /// User's email address
        /// </summary>
        /// <example>user@example.com</example>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Verification code sent to the user's email
        /// </summary>
        /// <example>123456</example>
        public string Code { get; set; } = null!;
    }

    /// <summary>
    /// Result model for email verification operation
    /// </summary>
    public class VerifyEmailResult
    {
        /// <summary>
        /// Indicates whether the email verification was successful
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Message describing the result of the verification attempt
        /// </summary>
        public string Message { get; set; } = string.Empty;
    }
}

