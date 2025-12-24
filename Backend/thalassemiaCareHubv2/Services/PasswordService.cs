using BCrypt.Net;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    /// <summary>
    /// Service for password encryption and verification using BCrypt
    /// </summary>
    public class PasswordService : IPasswordService
    {
        /// <summary>
        /// Hash a plain text password using BCrypt with salt rounds
        /// </summary>
        /// <param name="password">Plain text password to hash</param>
        /// <returns>Hashed password string</returns>
        public string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Password cannot be null or empty", nameof(password));

            // Generate a salt and hash the password with BCrypt
            // Work factor of 12 provides good security while maintaining reasonable performance
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        }

        /// <summary>
        /// Verify a plain text password against a hashed password
        /// </summary>
        /// <param name="password">Plain text password to verify</param>
        /// <param name="hashedPassword">Hashed password to compare against</param>
        /// <returns>True if password matches, false otherwise</returns>
        public bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            if (string.IsNullOrEmpty(hashedPassword))
                return false;

            try
            {
                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch (Exception ex)
            {
                // Log the exception in a real application
                Console.WriteLine($"Error verifying password: {ex.Message}");
                return false;
            }
        }
    }
}
