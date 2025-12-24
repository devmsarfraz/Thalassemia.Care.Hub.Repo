using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        
        public async Task<User?> GetUserProfile(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);
            return user;
        }

        public async Task<User?> UpdateUser(int id, UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);

                if (user == null)
                    return null;

                // Update user properties
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.PhoneNumber = request.PhoneNumber;
                user.Address = request.Address;
                user.BloodGroup = request.BloodGroup;
                user.Gender = request.Gender;
                user.GuardianName = request.GuardianName;
                user.GuardianNumber = request.GuardianNumber;

                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user: {ex.Message}");
                return null;
            }
        }

        public async Task<List<User>> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.Role)
                    .OrderBy(u => u.FirstName)
                    .ThenBy(u => u.LastName)
                    .ToListAsync();

                return users;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving all users: {ex.Message}");
                return new List<User>();
            }
        }

        public async Task<bool> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == id);

                if (user == null)
                    return false;

                user.IsDelete = true;
                
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting user: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RestoreUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == id && u.IsDelete);

                if (user == null)
                    return false;

                user.IsDelete = false;
                
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error restoring user: {ex.Message}");
                return false;
            }
        }

        public async Task<User?> UpdateUserRole(int id, int roleId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);

                if (user == null)
                    return null;

                if (user.RoleId == 3)
                {
                    return null;
                }

                var roleExists = await _context.UserRoles
                    .AnyAsync(r => r.RoleId == roleId);

                if (!roleExists)
                    return null;

                user.RoleId = roleId;
                
                await _context.SaveChangesAsync();
                
                return await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user role: {ex.Message}");
                return null;
            }
        }

        public async Task<(User? caregiver, User? patient)> AssociateUser(int caregiverId, int patientId)
        {
            try
            {
                // Get both users with their roles
                var caregiver = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == caregiverId && !u.IsDelete);

                var patient = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == patientId && !u.IsDelete);

                if (caregiver == null || patient == null)
                {
                    return (null, null);
                }

                // Validate that caregiver and patient are different users
                if (caregiverId == patientId)
                {
                    return (null, null);
                }

                // Update caregiver's AssociatedUserId to point to the patient
                caregiver.AssociatedUserId = patientId;
                
                await _context.SaveChangesAsync();
                
                // Reload both users with updated information
                var updatedCaregiver = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == caregiverId && !u.IsDelete);

                var updatedPatient = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == patientId && !u.IsDelete);

                return (updatedCaregiver, updatedPatient);
                return (updatedCaregiver, updatedPatient);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error associating users: {ex.Message}");
                return (null, null);
            }
        }

        public async Task<User?> UpdateProfilePicture(int id, string imagePath)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);

                if (user == null)
                    return null;

                user.ProfilePicture = imagePath;
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating profile picture: {ex.Message}");
                return null;
            }
        }
    }
}
