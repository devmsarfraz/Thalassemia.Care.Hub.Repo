using System.Security.Claims;

namespace thalassemiaCareHubv2.Interface
{
    /// <summary>
    /// Interface for JWT token operations
    /// </summary>
    public interface IJwtService
    {
        /// <summary>
        /// Generate a JWT token for a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="email">User email</param>
        /// <param name="role">User role</param>
        /// <returns>JWT token string</returns>
        string GenerateToken(int userId, string email, string role);

        /// <summary>
        /// Validate a JWT token
        /// </summary>
        /// <param name="token">JWT token to validate</param>
        /// <returns>Claims principal if valid, null if invalid</returns>
        ClaimsPrincipal? ValidateToken(string token);

        /// <summary>
        /// Extract user ID from JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>User ID if found, null otherwise</returns>
        int? GetUserIdFromToken(string token);

        /// <summary>
        /// Check if token is expired
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>True if expired, false otherwise</returns>
        bool IsTokenExpired(string token);
    }
}
