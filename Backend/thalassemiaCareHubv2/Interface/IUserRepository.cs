using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetUserProfile(int id);
        Task<User?> UpdateUser(int id, UpdateUserRequest request);
        Task<List<User>> GetAllUsers();
        Task<bool> DeleteUser(int id);
        Task<bool> RestoreUser(int id);
        Task<User?> UpdateUserRole(int id, int roleId);
        Task<(User? caregiver, User? patient)> AssociateUser(int caregiverId, int patientId);
        Task<User?> UpdateProfilePicture(int id, string imagePath);
    }
}
