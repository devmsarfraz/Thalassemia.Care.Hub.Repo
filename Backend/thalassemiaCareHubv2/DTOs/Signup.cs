namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for user registration
    /// </summary>
    public class Signup
    {
        /// <summary>
        /// User's email address
        /// </summary>
        /// <example>user@example.com</example>
        public string Email { get; set; } = null!;
        
        /// <summary>
        /// User's password
        /// </summary>
        /// <example>password123</example>
        public string Password { get; set; } = null!;
        
        /// <summary>
        /// User's first name
        /// </summary>
        /// <example>John</example>
        public string FirstName { get; set; } = null!;
        
        /// <summary>
        /// User's last name
        /// </summary>
        /// <example>Doe</example>
        public string LastName { get; set; } = null!;
        
        /// <summary>
        /// User's phone number
        /// </summary>
        /// <example>1234567890</example>
        public string? PhoneNumber { get; set; }
        
        /// <summary>
        /// User's address
        /// </summary>
        /// <example>123 Main Street, City, State</example>
        public string? Address { get; set; }
        
        /// <summary>
        /// User's blood group
        /// </summary>
        /// <example>A+</example>
        public string? BloodGroup { get; set; }
        
        /// <summary>
        /// User's role ID
        /// </summary>
        /// <example>1</example>
        public int RoleID { get; set; }
    }

    /// <summary>
    /// Result model for signup operation
    /// </summary>
    public class SignupResult
    {
        /// <summary>
        /// Indicates whether the signup was successful
        /// </summary>
        public bool Success;
        
        /// <summary>
        /// Message describing the result of the signup attempt
        /// </summary>
        public string Message { get; set; } = string.Empty;
        
        /// <summary>
        /// The ID of the newly created user
        /// </summary>
        public int UserId { get; set; }
    }
}
