using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ICommunityPostService _communityPostService;

        public PostsController(ICommunityPostService communityPostService)
        {
            _communityPostService = communityPostService;
        }

        /// <summary>
        /// Create a new community post
        /// </summary>
        /// <param name="request">Post creation request</param>
        /// <returns>Created post details</returns>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostResponse>> CreatePost([FromBody] CreatePostRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                Console.WriteLine(userId);
                Console.WriteLine("=-----------------------------=");
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _communityPostService.CreatePostAsync(request, userId.Value);
                if (result == null)
                    return BadRequest("Failed to create post");

                return CreatedAtAction(nameof(GetPost), new { id = result.PostId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get all community posts
        /// </summary>
        /// <returns>List of all posts</returns>
        [HttpGet]
        public async Task<ActionResult<List<PostResponse>>> GetAllPosts()
        {
            try
            {
                var userId = GetCurrentUserId();
                var posts = await _communityPostService.GetAllPostsAsync(userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get a specific post by ID with comments and media
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Post details with comments and media</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<PostResponse>> GetPost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var post = await _communityPostService.GetPostByIdAsync(id, userId);
                if (post == null)
                    return NotFound("Post not found");

                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Toggle like on a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Success status</returns>
        [HttpPost("{id}/like")]
        [Authorize]
        public async Task<ActionResult> ToggleLike(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _communityPostService.ToggleLikeAsync(id, userId.Value);
                // Return 200 OK with the new state (true = liked, false = unliked)
                return Ok(new { IsLiked = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update a post (owner only)
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <param name="request">Post update request</param>
        /// <returns>Updated post details</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<PostResponse>> UpdatePost(int id, [FromBody] UpdatePostRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _communityPostService.UpdatePostAsync(id, request, userId.Value);
                if (result == null)
                    return NotFound("Post not found or you don't have permission to update it");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Soft delete a post (owner only)
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeletePost(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var success = await _communityPostService.DeletePostAsync(id, userId.Value);
                if (!success)
                    return NotFound("Post not found or you don't have permission to delete it");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Create a comment on a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <param name="request">Comment creation request</param>
        /// <returns>Created comment details</returns>
        [HttpPost("{id}/comments")]
        [Authorize]
        public async Task<ActionResult<CommentResponse>> CreateComment(int id, [FromBody] CreateCommentRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _communityPostService.CreateCommentAsync(id, request, userId.Value);
                if (result == null)
                    return BadRequest("Failed to create comment or post not found");

                return CreatedAtAction(nameof(GetComment), new { commentId = result.CommentId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get all comments for a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>List of comments for the post</returns>
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<List<CommentResponse>>> GetComments(int id)
        {
            try
            {
                var comments = await _communityPostService.GetCommentsByPostIdAsync(id);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update a comment (owner only)
        /// </summary>
        /// <param name="commentId">Comment ID</param>
        /// <param name="request">Comment update request</param>
        /// <returns>Updated comment details</returns>
        [HttpPut("comments/{commentId}")]
        [Authorize]
        public async Task<ActionResult<CommentResponse>> UpdateComment(int commentId, [FromBody] UpdateCommentRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var result = await _communityPostService.UpdateCommentAsync(commentId, request, userId.Value);
                if (result == null)
                    return NotFound("Comment not found or you don't have permission to update it");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Soft delete a comment (owner only)
        /// </summary>
        /// <param name="commentId">Comment ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("comments/{commentId}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(int commentId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                var success = await _communityPostService.DeleteCommentAsync(commentId, userId.Value);
                if (!success)
                    return NotFound("Comment not found or you don't have permission to delete it");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update media URL for a post (owner only)
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <param name="request">Media upload request</param>
        /// <returns>Updated post details</returns>
        [HttpPost("{id}/media")]
        [Authorize]
        public async Task<ActionResult<PostResponse>> UploadMediaForPost(int id, [FromBody] UploadMediaRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized("User not authenticated");

                // Get current post first to preserve title and content
                var currentPost = await _communityPostService.GetPostByIdAsync(id);
                if (currentPost == null)
                    return NotFound("Post not found");

                // Update the post with the new media URL while preserving existing title and content
                var updateRequest = new UpdatePostRequest
                {
                    PostTitle = currentPost.PostTitle,
                    PostContent = currentPost.PostContent,
                    MediaUrl = request.MediaUrl
                };

                var result = await _communityPostService.UpdatePostAsync(id, updateRequest, userId.Value);
                if (result == null)
                    return NotFound("Post not found or you don't have permission to update it");

                return Ok(result);
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

        // Helper method for GetComment action (used in CreatedAtAction)
        [HttpGet("comments/{commentId}")]
        public ActionResult<CommentResponse> GetComment(int commentId)
        {
            try
            {
                // This is a placeholder method for CreatedAtAction
                // In a real implementation, you might want to implement this
                return NotFound("Comment endpoint not implemented");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
