using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Interface
{
    public interface IUserService
    {
        Task<UserProfileResponse?> GetUserProfileAsync(int id);
        Task<UserProfileResponse?> UpdateUserAsync(int id, UpdateUserRequest request);
        Task<List<UserProfileResponse>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(int id);
        Task<bool> RestoreUserAsync(int id);
        Task<UpdateUserRoleResponse> UpdateUserRoleAsync(int id, UpdateUserRoleRequest request);
        Task<AssociateUserResponse> AssociateUserAsync(AssociateUserRequest request);
        Task<UserProfileResponse?> UpdateProfilePictureAsync(int id, string imagePath);
    }
}
