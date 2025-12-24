namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for user login
    /// </summary>
    public class Login
    {
        /// <summary>
        /// User's email address
        /// </summary>
        /// <example>user@example.com</example>
        public string Email { get; set; }
        
        /// <summary>
        /// User's password
        /// </summary>
        /// <example>password123</example>
        public string Password { get; set; }
    }

    /// <summary>
    /// Result model for login operation
    /// </summary>
    public class LoginResult
    {
        /// <summary>
        /// Indicates whether the login was successful
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// Message describing the result of the login attempt
        /// </summary>
        public string Message { get; set; } = string.Empty;
        
        /// <summary>
        /// JWT token for authenticated requests
        /// </summary>
        public string? Token { get; set; }
        
        /// <summary>
        /// Token expiration time
        /// </summary>
        public DateTime? ExpiresAt { get; set; }
        
        /// <summary>
        /// User information
        /// </summary>
        public UserInfo? User { get; set; }
    }

    /// <summary>
    /// User information for login response
    /// </summary>
    public class UserInfo
    {
        /// <summary>
        /// User ID
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// User's email
        /// </summary>
        public string Email { get; set; } = string.Empty;
        
        /// <summary>
        /// User's first name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        
        /// <summary>
        /// User's last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        
        /// <summary>
        /// User's role
        /// </summary>
        public string Role { get; set; } = string.Empty;
    }
}
