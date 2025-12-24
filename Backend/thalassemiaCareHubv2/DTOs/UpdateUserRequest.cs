namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for updating user profile information
    /// </summary>
    public class UpdateUserRequest
    {
        /// <summary>
        /// User's first name
        /// </summary>
        /// <example>John</example>
        public string FirstName { get; set; } = null!;
        
        /// <summary>
        /// User's last name
        /// </summary>
        /// <example>Smith</example>
        public string LastName { get; set; } = null!;
        
        /// <summary>
        /// User's phone number
        /// </summary>
        /// <example>9876543210</example>
        public string? PhoneNumber { get; set; }
        
        /// <summary>
        /// User's address
        /// </summary>
        /// <example>456 Oak Avenue, Springfield, IL 62701</example>
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
        /// <example>Jane Smith</example>
        public string? GuardianName { get; set; }
        
        /// <summary>
        /// Guardian's phone number
        /// </summary>
        /// <example>5555555555</example>
        public string? GuardianNumber { get; set; }
    }
}
