
using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;


namespace thalassemiaCareHubv2.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;
        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }

        private static string NormalizeEmail(string? email) => email?.Trim().ToLowerInvariant() ?? "";

        public async Task<bool> UserExists(string email)
        {
            var normalized = NormalizeEmail(email);
            bool exists = await _context.Users.AnyAsync(x => x.Email != null && x.Email.ToLower() == normalized && !x.IsDelete);
            return exists;
        }

        public async Task<int> CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.UserId;
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            var normalized = NormalizeEmail(email);
            return await _context.Users
                  .Where(u => u.Email != null && u.Email.ToLower() == normalized && u.IsDelete == false)
                .Select(u => new User { UserId = u.UserId, Email = u.Email, Password = u.Password })
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.UserId == userId && !u.IsDelete)
                .FirstOrDefaultAsync();
        }
        public async Task<bool> UpdateUser(string email, string currentPassword, string newPassword)
        {
            try
            {
                var normalized = NormalizeEmail(email);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete);

                if (user == null)
                    return false;

                // Note: currentPassword verification is now handled in AuthService
                // We just need to update the password here
                await _context.Entry(user).ReloadAsync();

                user.Password = newPassword; // newPassword is already hashed from AuthService
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user password: {ex.Message}");
                return false;
            }
        }

        public async Task<User?> GetUserByEmailForVerification(string email)
        {
            var normalized = NormalizeEmail(email);
            return await _context.Users
                .Where(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> VerifyUserEmail(string email, int verificationCode)
        {
            try
            {
                var normalized = NormalizeEmail(email);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete);

                if (user == null)
                    return false;

                // Check if verification code matches
                if (user.ResetCode != verificationCode)
                    return false;

                // Update user verification status
                user.Verified = true;
                user.ResetCode = null; // Clear the verification code after successful verification

                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error verifying user email: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> UpdateResetCode(string email, int resetCode)
        {
            try
            {
                var normalized = NormalizeEmail(email);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete);

                if (user == null)
                    return false;

                user.ResetCode = resetCode;
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating reset code: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> VerifyResetCode(string email, int resetCode)
        {
            try
            {
                var normalized = NormalizeEmail(email);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete);

                if (user == null)
                    return false;

                if (user.ResetCode != resetCode)
                    return false;

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error verifying reset code: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ResetPassword(string email, string newHashedPassword)
        {
            try
            {
                var normalized = NormalizeEmail(email);
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == normalized && !u.IsDelete);

                if (user == null)
                    return false;

                user.Password = newHashedPassword;
                user.ResetCode = null; // Clear the reset code after successful password reset
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error resetting password: {ex.Message}");
                return false;
            }
        }
    }
}
