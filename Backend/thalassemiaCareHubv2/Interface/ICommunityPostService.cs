using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Interface
{
    public interface ICommunityPostService
    {
        // Post operations
        Task<PostResponse?> CreatePostAsync(CreatePostRequest request, int userId);
        Task<List<PostResponse>> GetAllPostsAsync(int? currentUserId = null);
        Task<PostResponse?> GetPostByIdAsync(int postId, int? currentUserId = null);
        Task<PostResponse?> UpdatePostAsync(int postId, UpdatePostRequest request, int userId);
        Task<bool> DeletePostAsync(int postId, int userId);
        Task<bool> ToggleLikeAsync(int postId, int userId);
        
        // Comment operations
        Task<CommentResponse?> CreateCommentAsync(int postId, CreateCommentRequest request, int userId);
        Task<List<CommentResponse>> GetCommentsByPostIdAsync(int postId);
        Task<CommentResponse?> UpdateCommentAsync(int commentId, UpdateCommentRequest request, int userId);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
    }
}
