namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Response model for user profile information
    /// </summary>
    public class UserProfileResponse
    {
        /// <summary>
        /// Unique identifier for the user
        /// </summary>
        /// <example>1</example>
        public int UserId { get; set; }
        
        /// <summary>
        /// User's email address
        /// </summary>
        /// <example>user@example.com</example>
        public string Email { get; set; } = null!;
        
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
        /// User's gender
        /// </summary>
        /// <example>Male</example>
        public string? Gender { get; set; }
        
        /// <summary>
        /// Guardian's name (for minor patients)
        /// </summary>
        /// <example>Jane Doe</example>
        public string? GuardianName { get; set; }
        
        /// <summary>
        /// User's profile picture URL
        /// </summary>
        /// <example>/uploads/profiles/user123.jpg</example>
        public string? ProfilePicture { get; set; }
        
        /// <summary>
        /// Guardian's phone number
        /// </summary>
        /// <example>9876543210</example>
        public string? GuardianNumber { get; set; }
        
        /// <summary>
        /// User's role name
        /// </summary>
        /// <example>Patient</example>
        public string Role { get; set; } = null!;

        /// <summary>
        /// Indicates if the user is soft-deleted
        /// </summary>
        public bool IsDelete { get; set; }
    }
}
