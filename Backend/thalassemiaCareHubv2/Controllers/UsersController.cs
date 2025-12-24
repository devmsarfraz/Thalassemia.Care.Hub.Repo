using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace thalassemiaCareHubv2.Controllers
{
    /// <summary>
    /// Controller for handling user profile operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for testing
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAssociationRequestService _associationRequestService;
        private readonly IWebHostEnvironment _environment;

        /// <summary>
        /// Initializes a new instance of the UsersController
        /// </summary>
        /// <param name="userService">The user service</param>
        /// <param name="associationRequestService">The association request service</param>
        /// <param name="environment">The web host environment</param>
        public UsersController(IUserService userService, IAssociationRequestService associationRequestService, IWebHostEnvironment environment)
        {
            _userService = userService;
            _associationRequestService = associationRequestService;
            _environment = environment;
        }

        /// <summary>
        /// Get all users in the system
        /// </summary>
        /// <returns>List of all user profiles</returns>
        /// <response code="200">Users retrieved successfully</response>
        /// <response code="500">Internal server error</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<UserProfileResponse>), 200)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult<List<UserProfileResponse>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user profile by user ID
        /// </summary>
        /// <param name="id">The user ID</param>
        /// <returns>User profile information</returns>
        /// <response code="200">User profile retrieved successfully</response>
        /// <response code="404">User not found</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult<UserProfileResponse>> GetUserProfile(int id)
        {
            var userProfile = await _userService.GetUserProfileAsync(id);
            if (userProfile == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(userProfile);
        }

        /// <summary>
        /// Update user profile information
        /// </summary>
        /// <param name="id">The user ID to update</param>
        /// <param name="request">Updated user information</param>
        /// <returns>Updated user profile information</returns>
        /// <response code="200">User profile updated successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="404">User not found</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult<UserProfileResponse>> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, request);

                if (updatedUser == null)
                    return NotFound(new { message = "User not found." });

                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Upload user profile picture
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="file">Image file</param>
        /// <returns>Updated user profile</returns>
        [HttpPost("{id}/profile-picture")]
        [ProducesResponseType(typeof(UserProfileResponse), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<ActionResult<UserProfileResponse>> UploadProfilePicture(int id, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded." });
                }

                // Check file extension
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and GIF are allowed." });
                }

                // Create uploads directory if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "profiles");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = $"{id}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update user profile with relative path
                var relativePath = $"/uploads/profiles/{uniqueFileName}";
                var updatedUser = await _userService.UpdateProfilePictureAsync(id, relativePath);

                if (updatedUser == null)
                    return NotFound(new { message = "User not found." });

                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading profile picture.", error = ex.Message });
            }
        }

        /// <summary>
        /// Soft delete a user by setting IsDelete flag to true
        /// </summary>
        /// <param name="id">The user ID to delete</param>
        /// <returns>Success message if user is deleted</returns>
        /// <response code="200">User deleted successfully</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);

                if (!result)
                    return NotFound(new { message = "User not found or already deleted." });

                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user.", error = ex.Message });
            }
        }

        /// <summary>
        /// Restore a soft-deleted user by setting IsDelete flag to false
        /// </summary>
        /// <param name="id">The user ID to restore</param>
        /// <returns>Success message if user is restored</returns>
        /// <response code="200">User restored successfully</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPut("{id}/restore")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult> RestoreUser(int id)
        {
            try
            {
                var result = await _userService.RestoreUserAsync(id);

                if (!result)
                    return NotFound(new { message = "User not found or already active." });

                return Ok(new { message = "User restored successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while restoring the user.", error = ex.Message });
            }
        }

        /// <summary>
        /// Update user role (Admin only)
        /// </summary>
        /// <param name="id">User ID to update role</param>
        /// <param name="request">Role update details</param>
        /// <returns>Updated user information with new role</returns>
        /// <response code="200">User role updated successfully</response>
        /// <response code="400">Invalid request or user not found</response>
        /// <response code="403">Forbidden - Admin access required</response>
        /// <response code="500">Internal server error</response>
        /// <summary>
        /// Get current user information (for debugging authorization)
        /// </summary>
        /// <returns>Current user's JWT token information</returns>
        /// <response code="200">User information retrieved successfully</response>
        /// <summary>
        /// Get all admin users (for debugging)
        /// </summary>
        /// <returns>List of admin users</returns>
        /// <response code="200">Admin users retrieved successfully</response>
        [HttpGet("admins")]
        [Authorize] // Requires any valid JWT token
        [ProducesResponseType(typeof(object), 200)]
        public async Task<ActionResult> GetAdminUsers()
        {
            try
            {
                var allUsers = await _userService.GetAllUsersAsync();
                var adminUsers = allUsers.Where(u => u.Role == "Admin").ToList();

                return Ok(new
                {
                    adminCount = adminUsers.Count,
                    adminUsers = adminUsers,
                    message = $"Found {adminUsers.Count} admin users"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving admin users", error = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize] // Requires any valid JWT token
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var isAdmin = User.IsInRole("Admin");

                return Ok(new
                {
                    userId = userId,
                    email = email,
                    role = role,
                    isAdmin = isAdmin,
                    allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                    message = isAdmin ? "You are an Admin user" : "You are not an Admin user"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user information", error = ex.Message });
            }
        }

        /// <summary>
        /// Test endpoint - no authentication required
        /// </summary>
        /// <returns>Simple test message</returns>
        [HttpGet("test")]
        [AllowAnonymous] // No authentication required
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult Test()
        {
            return Ok(new { message = "Test endpoint working - no authentication required" });
        }

        /// <summary>
        /// Create caregiver-patient association
        /// </summary>
        /// <param name="request">Association details</param>
        /// <returns>Updated caregiver and patient information</returns>
        /// <response code="200">Association created successfully</response>
        /// <response code="400">Invalid request or users not found</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("associate")]
        [ProducesResponseType(typeof(AssociateUserResponse), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult> AssociateUser([FromBody] AssociateUserRequest request)
        {
            try
            {
                var result = await _userService.AssociateUserAsync(request);

                if (result.Success)
                    return Ok(result);

                return BadRequest(new { message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the association.", error = ex.Message });
            }
        }

        [HttpPut("{id}/role")]
        [ProducesResponseType(typeof(UpdateUserRoleResponse), 200)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 403)]
        [ProducesResponseType(typeof(object), 500)]
        public async Task<ActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleRequest request)
        {
            try
            {
                var result = await _userService.UpdateUserRoleAsync(id, request);

                if (result.Success)
                    return Ok(result);

                return BadRequest(new { message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user role.", error = ex.Message });
            }
        }

        /// <summary>
        /// Create an association request (caregiver/doctor requests to associate with patient)
        /// </summary>
        [HttpPost("association-request")]
        [ProducesResponseType(typeof(AssociationRequestResultDTO), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> CreateAssociationRequest([FromBody] CreateAssociationRequestDTO request)
        {
            try
            {
                var result = await _associationRequestService.CreateRequestAsync(request);

                if (result.Success)
                    return Ok(result);

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating association request.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get pending association requests for a user (requests sent TO this user)
        /// </summary>
        [HttpGet("{userId}/association-requests/pending")]
        [ProducesResponseType(typeof(List<AssociationRequestResponseDTO>), 200)]
        public async Task<ActionResult> GetPendingAssociationRequests(int userId)
        {
            try
            {
                var requests = await _associationRequestService.GetPendingRequestsForUserAsync(userId);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching association requests.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get sent association requests by a user (requests sent BY this user)
        /// </summary>
        [HttpGet("{userId}/association-requests/sent")]
        [ProducesResponseType(typeof(List<AssociationRequestResponseDTO>), 200)]
        public async Task<ActionResult> GetSentAssociationRequests(int userId)
        {
            try
            {
                var requests = await _associationRequestService.GetSentRequestsByUserAsync(userId);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching sent association requests.", error = ex.Message });
            }
        }

        /// <summary>
        /// Accept an association request
        /// </summary>
        [HttpPut("association-request/{requestId}/accept")]
        [ProducesResponseType(typeof(AssociationRequestActionResponseDTO), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> AcceptAssociationRequest(int requestId, [FromBody] int userId)
        {
            try
            {
                var result = await _associationRequestService.AcceptRequestAsync(requestId, userId);

                if (result.Success)
                    return Ok(result);

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while accepting association request.", error = ex.Message });
            }
        }

        /// <summary>
        /// Reject an association request
        /// </summary>
        [HttpPut("association-request/{requestId}/reject")]
        [ProducesResponseType(typeof(AssociationRequestActionResponseDTO), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> RejectAssociationRequest(int requestId, [FromBody] int userId)
        {
            try
            {
                var result = await _associationRequestService.RejectRequestAsync(requestId, userId);

                if (result.Success)
                    return Ok(result);

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while rejecting association request.", error = ex.Message });
            }
        }
    }
}
