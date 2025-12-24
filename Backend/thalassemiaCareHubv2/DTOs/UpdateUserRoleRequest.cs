namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for updating user role
    /// </summary>
    public class UpdateUserRoleRequest
    {
        /// <summary>
        /// New role ID to assign to the user
        /// </summary>
        /// <example>2</example>
        public int RoleId { get; set; }
    }

    /// <summary>
    /// Response model for user role update operation
    /// </summary>
    public class UpdateUserRoleResponse
    {
        /// <summary>
        /// Indicates whether the role update was successful
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// Message describing the result of the role update operation
        /// </summary>
        public string Message { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated user information
        /// </summary>
        public UserProfileResponse? User { get; set; }
    }
}
