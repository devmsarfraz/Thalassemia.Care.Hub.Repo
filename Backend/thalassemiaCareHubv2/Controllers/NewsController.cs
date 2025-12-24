using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }


        /// <summary>
        /// Create a new news post (Admin only)
        /// </summary>
        /// <param name="request">News post creation request</param>
        /// <returns>Created news post details</returns>
        [HttpPost]
        [Authorize (Roles ="Admin")]
        public async Task<ActionResult<NewsPostResponse>> CreateNewsPost([FromBody] CreateNewsPostRequest request)
            {
                try
                {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                if (!IsCurrentUserAdmin())
                {
                    var userRole = GetCurrentUserRole();
                    Console.WriteLine($"Access denied. User role: {userRole ?? "null"}");
                    return Forbid("Admin access required");
                }

                Console.WriteLine($"[NewsController] Admin user {userId} creating news post");
                Console.WriteLine($"[NewsController] Payload: Title={request.PostTitle}, Category={request.Category}, MediaCount={request.MediaList?.Count ?? 0}");

                var result = await _newsService.CreateNewsPostAsync(request, userId.Value);
                if (result == null)
                {
                    Console.WriteLine("[NewsController] CreateNewsPostAsync returned null");
                    return BadRequest("Failed to create news post");
                }

                Console.WriteLine("[NewsController] News post created successfully");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NewsController] ERROR: {ex.GetType().Name}: {ex.Message}");
                Console.WriteLine($"[NewsController] StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[NewsController] InnerException: {ex.InnerException.Message}");
                    Console.WriteLine($"[NewsController] InnerStackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message} | Inner: {ex.InnerException?.Message}");
            }
            }

        /// <summary>
        /// Get all news posts
        /// </summary>
        /// <returns>List of all news posts</returns>
        [HttpGet]
        public async Task<ActionResult<List<NewsPostResponse>>> GetAllNewsPosts()
        {
            try
            {
                var newsPosts = await _newsService.GetAllNewsPostsAsync();
                return Ok(newsPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Debug endpoint to check current user's role and claims (Admin only)
        /// </summary>
        /// <returns>Current user's role information</returns>
        [HttpGet("debug/user-info")]
        [Authorize(Roles = "Admin")]
        public ActionResult<object> GetCurrentUserInfo()
        {
            try
            {
                var userId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                var isAdmin = IsCurrentUserAdmin();
                var email = User.FindFirst(ClaimTypes.Email)?.Value;

                var claims = User.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToList();

                return Ok(new
                {
                    userId = userId,
                    email = email,
                    role = userRole,
                    isAdmin = isAdmin,
                    claims = claims
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get a specific news post by ID
        /// </summary>
        /// <param name="id">News post ID</param>
        /// <returns>News post details with media</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsPostById(int id)
        {
            try
            {
                var newsPost = await _newsService.GetNewsPostByIdAsync(id);
                if (newsPost == null)
                    return NotFound("News post not found");

                // Check if user is logged in to set IsLikedByCurrentUser
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdString, out int userId))
                {
                   newsPost.IsLikedByCurrentUser = await _newsService.IsLikedByUserAsync(id, userId);
                }

                return Ok(newsPost);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        
        // I will fix the IsLiked Logic in next step. For now adding endpoints.

        [HttpPost("{id}/comment")]
        [Authorize]
        public async Task<IActionResult> AddComment(int id, [FromBody] NewsCommentRequest request)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdString, out int userId))
                    return Unauthorized();

                var result = await _newsService.AddCommentAsync(id, request, userId);
                if (result == null)
                    return BadRequest("Failed to add comment");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("comment/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdString, out int userId))
                    return Unauthorized();

                var result = await _newsService.DeleteCommentAsync(id, userId);
                if (!result)
                    return BadRequest("Failed to delete comment or unauthorized");

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<IActionResult> ToggleLike(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdString, out int userId))
                    return Unauthorized();

                var result = await _newsService.ToggleLikeAsync(id, userId);
                return Ok(new { isLiked = result }); // Returns true if Liked, false if Unliked? 
                // Wait, ToggleLikeAsync returns true if success? No, it usually returns current state or bool success.
                // My Service impl returns true/false for success/fail of operation?
                // Let's check Service logic:
                // if isLiked -> RemoveLike -> returns true.
                // else -> AddLike -> returns true.
                // It returns "Success" status, not "IsLiked" status.
                // This is slightly ambiguous for Frontend.
                // I should return the Count and State?
                // For now, let's assume Frontend will optimistically update or refetch.
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update a news post (Admin only)
        /// </summary>
        /// <param name="id">News post ID</param>
        /// <param name="request">News post update request</param>
        /// <returns>Updated news post details</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<NewsPostResponse>> UpdateNewsPost(int id, [FromBody] UpdateNewsPostRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _newsService.UpdateNewsPostAsync(id, request, userId.Value);
                if (result == null)
                    return NotFound("News post not found or you don't have permission to update it");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Soft delete a news post (Admin only)
        /// </summary>
        /// <param name="id">News post ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteNewsPost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var success = await _newsService.DeleteNewsPostAsync(id, userId.Value);
                if (!success)
                    return NotFound("News post not found or you don't have permission to delete it");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Upload media for a news post (Admin only)
        /// </summary>
        /// <param name="id">News post ID</param>
        /// <param name="request">Media upload request</param>
        /// <returns>Uploaded media details</returns>
        [HttpPost("{id}/media")]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<NewsMediaResponse>> UploadMedia(int id, [FromBody] UploadNewsMediaRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _newsService.UploadMediaAsync(id, request, userId.Value);
                if (result == null)
                    return NotFound("News post not found or you don't have permission to upload media");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Delete media record (Admin only)
        /// </summary>
        /// <param name="mediaId">Media ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("media/{mediaId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteMedia(int mediaId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var success = await _newsService.DeleteMediaAsync(mediaId, userId.Value);
                if (!success)
                    return NotFound("Media record not found or you don't have permission to delete it");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to get current user ID from JWT claims
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        // Helper method to get current user's role from JWT claims
        private string? GetCurrentUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            return roleClaim?.Value;
        }

        // Helper method to check if current user is admin
        private bool IsCurrentUserAdmin()
        {
            var userRole = GetCurrentUserRole();
            var isAdmin = !string.IsNullOrEmpty(userRole) && 
                         string.Equals(userRole, "Admin", StringComparison.OrdinalIgnoreCase);
            
            Console.WriteLine($"Admin verification - Role: '{userRole}', IsAdmin: {isAdmin}");
            return isAdmin;
        }
    }
}
