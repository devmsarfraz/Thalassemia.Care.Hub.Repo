using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Repository;

namespace thalassemiaCareHubv2.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;            
        }
        
        public async Task<UserProfileResponse?> GetUserProfileAsync(int id)
        {
            var user = await _userRepository.GetUserProfile(id);

            if (user == null)
            {
                return null;
            }

            return new UserProfileResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                BloodGroup = user.BloodGroup,
                Gender = user.Gender,
                GuardianName = user.GuardianName,
                GuardianNumber = user.GuardianNumber,
                ProfilePicture = user.ProfilePicture,
                Role = user.Role?.RoleName ?? "Unknown",
                IsDelete = user.IsDelete
            };
        }

        public async Task<UserProfileResponse?> UpdateUserAsync(int id, UpdateUserRequest request)
        {
            try
            {
                var updatedUser = await _userRepository.UpdateUser(id, request);

                if (updatedUser == null)
                {
                    return null;
                }

                return new UserProfileResponse
                {
                    UserId = updatedUser.UserId,
                    Email = updatedUser.Email,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    PhoneNumber = updatedUser.PhoneNumber,
                    Address = updatedUser.Address,
                    BloodGroup = updatedUser.BloodGroup,
                    Gender = updatedUser.Gender,
                    GuardianName = updatedUser.GuardianName,
                    GuardianNumber = updatedUser.GuardianNumber,
                    ProfilePicture = updatedUser.ProfilePicture,
                    Role = updatedUser.Role?.RoleName ?? "Unknown",
                    IsDelete = updatedUser.IsDelete
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.UpdateUserAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<List<UserProfileResponse>> GetAllUsersAsync()
        {
            try
            {
                var users = await _userRepository.GetAllUsers();

                var userProfiles = users.Select(user => new UserProfileResponse
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    BloodGroup = user.BloodGroup,
                    Gender = user.Gender,
                    GuardianName = user.GuardianName,
                    GuardianNumber = user.GuardianNumber,
                    Role = user.Role?.RoleName ?? "Unknown",
                    IsDelete = user.IsDelete
                }).ToList();

                return userProfiles;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.GetAllUsersAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                // Perform soft delete - the repository will check if user exists
                var result = await _userRepository.DeleteUser(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.DeleteUserAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> RestoreUserAsync(int id)
        {
            try
            {
                // Perform restore (set IsDelete = false)
                var result = await _userRepository.RestoreUser(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.RestoreUserAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<UpdateUserRoleResponse> UpdateUserRoleAsync(int id, UpdateUserRoleRequest request)
        {
            try
            {
                var currentUser = await _userRepository.GetUserProfile(id);
                if (currentUser == null)
                {
                    return new UpdateUserRoleResponse
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }

                if (currentUser.RoleId == 3)
                {
                    return new UpdateUserRoleResponse
                    {
                        Success = false,
                        Message = "Cannot change role of Admin users."
                    };
                }

                var updatedUser = await _userRepository.UpdateUserRole(id, request.RoleId);

                if (updatedUser == null)
                {
                    return new UpdateUserRoleResponse
                    {
                        Success = false,
                        Message = "Role does not exist or user not found."
                    };
                }

                var userProfile = new UserProfileResponse
                {
                    UserId = updatedUser.UserId,
                    Email = updatedUser.Email,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    PhoneNumber = updatedUser.PhoneNumber,
                    Address = updatedUser.Address,
                    BloodGroup = updatedUser.BloodGroup,
                    Gender = updatedUser.Gender,
                    GuardianName = updatedUser.GuardianName,
                    GuardianNumber = updatedUser.GuardianNumber,
                    Role = updatedUser.Role?.RoleName ?? "Unknown"
                };

                return new UpdateUserRoleResponse
                {
                    Success = true,
                    Message = "User role updated successfully.",
                    User = userProfile
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.UpdateUserRoleAsync: {ex.Message}");
                return new UpdateUserRoleResponse
                {
                    Success = false,
                    Message = "An error occurred while updating user role."
                };
            }
        }

        public async Task<AssociateUserResponse> AssociateUserAsync(AssociateUserRequest request)
        {
            try
            {
                // Validate that caregiver and patient are different users
                if (request.CaregiverId == request.PatientId)
                {
                    return new AssociateUserResponse
                    {
                        Success = false,
                        Message = "Caregiver and patient cannot be the same user.",
                        AssociationDetails = "No association created - same user ID provided for both caregiver and patient"
                    };
                }

                var (caregiver, patient) = await _userRepository.AssociateUser(request.CaregiverId, request.PatientId);

                if (caregiver == null || patient == null)
                {
                    return new AssociateUserResponse
                    {
                        Success = false,
                        Message = "One or both users not found.",
                        AssociationDetails = $"Association failed - Caregiver ID: {request.CaregiverId}, Patient ID: {request.PatientId} (one or both users not found)"
                    };
                }

                var caregiverProfile = new UserProfileResponse
                {
                    UserId = caregiver.UserId,
                    Email = caregiver.Email,
                    FirstName = caregiver.FirstName,
                    LastName = caregiver.LastName,
                    PhoneNumber = caregiver.PhoneNumber,
                    Address = caregiver.Address,
                    BloodGroup = caregiver.BloodGroup,
                    Gender = caregiver.Gender,
                    GuardianName = caregiver.GuardianName,
                    GuardianNumber = caregiver.GuardianNumber,
                    Role = caregiver.Role?.RoleName ?? "Unknown"
                };

                var patientProfile = new UserProfileResponse
                {
                    UserId = patient.UserId,
                    Email = patient.Email,
                    FirstName = patient.FirstName,
                    LastName = patient.LastName,
                    PhoneNumber = patient.PhoneNumber,
                    Address = patient.Address,
                    BloodGroup = patient.BloodGroup,
                    Gender = patient.Gender,
                    GuardianName = patient.GuardianName,
                    GuardianNumber = patient.GuardianNumber,
                    Role = patient.Role?.RoleName ?? "Unknown"
                };

                return new AssociateUserResponse
                {
                    Success = true,
                    Message = "Caregiver-patient association created successfully.",
                    AssociationDetails = $"Caregiver (ID: {caregiver.UserId}, Name: {caregiver.FirstName} {caregiver.LastName}) is now associated with Patient (ID: {patient.UserId}, Name: {patient.FirstName} {patient.LastName})",
                    Caregiver = caregiverProfile,
                    Patient = patientProfile
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.AssociateUserAsync: {ex.Message}");
                return new AssociateUserResponse
                {
                    Success = false,
                    Message = "An error occurred while creating the association.",
                    AssociationDetails = $"Association failed due to system error - Caregiver ID: {request.CaregiverId}, Patient ID: {request.PatientId}"
                };
            }
        }

        public async Task<UserProfileResponse?> UpdateProfilePictureAsync(int id, string imagePath)
        {
            try
            {
                var updatedUser = await _userRepository.UpdateProfilePicture(id, imagePath);

                if (updatedUser == null)
                {
                    return null;
                }

                return new UserProfileResponse
                {
                    UserId = updatedUser.UserId,
                    Email = updatedUser.Email,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    PhoneNumber = updatedUser.PhoneNumber,
                    Address = updatedUser.Address,
                    BloodGroup = updatedUser.BloodGroup,
                    Gender = updatedUser.Gender,
                    GuardianName = updatedUser.GuardianName,
                    GuardianNumber = updatedUser.GuardianNumber,
                    ProfilePicture = updatedUser.ProfilePicture,
                    Role = updatedUser.Role?.RoleName ?? "Unknown"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UserService.UpdateProfilePictureAsync: {ex.Message}");
                throw;
            }
        }
    }
}
