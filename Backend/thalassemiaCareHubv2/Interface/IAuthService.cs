using thalassemiaCareHubv2.DTOs;
namespace thalassemiaCareHubv2.Interface
{
    public interface IAuthService
    {
        Task <SignupResult> Signup(string email, string password, string firstName, string lastName, string? phoneNumber, string? address, string? bloodGroup, int roleID);
        Task<LoginResult> Login(string email, string password);
        Task<bool> UpdatePassword(string email, string currentPassword, string newPassword);
        Task<VerifyEmailResult> VerifyEmail(string email, string code);
        Task<bool> ForgotPassword(string email);
        Task<bool> VerifyResetCode(string email, string code);
        Task<bool> ResetPassword(string email, string newPassword);
    }
}
