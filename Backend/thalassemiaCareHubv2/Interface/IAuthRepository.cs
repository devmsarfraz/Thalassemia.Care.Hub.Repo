using Microsoft.AspNetCore.Identity.Data;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    public interface IAuthRepository
    {
        Task<bool> UserExists(string email);
        Task<int> CreateUser(User user);
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserById(int userId);
        Task<bool> UpdateUser(string email, string currentPassword, string newPassword);
        Task<User?> GetUserByEmailForVerification(string email);
        Task<bool> VerifyUserEmail(string email, int verificationCode);
        Task<bool> UpdateResetCode(string email, int resetCode);
        Task<bool> VerifyResetCode(string email, int resetCode);
        Task<bool> ResetPassword(string email, string newHashedPassword);
    }
}
