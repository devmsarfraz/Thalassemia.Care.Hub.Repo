using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    public interface ICommunityPostRepository
    {
        // Post operations
        Task<Post?> CreatePost(Post post);
        Task<List<Post>> GetAllPosts();
        Task<List<PostResponse>> GetAllPostsWithDetailsAsync(int? currentUserId);
        Task<Post?> GetPostById(int postId);
        Task<Post?> UpdatePost(int postId, UpdatePostRequest request);
        Task<bool> DeletePost(int postId);
        
        // Comment operations
        Task<Comment?> CreateComment(Comment comment);
        Task<List<Comment>> GetCommentsByPostId(int postId);
        Task<Comment?> GetCommentById(int commentId);
        Task<Comment?> UpdateComment(int commentId, UpdateCommentRequest request);
        Task<bool> DeleteComment(int commentId);

        // Like operations
        Task<bool> ToggleLike(int postId, int userId);
        Task<int> GetLikeCount(int postId);
        Task<bool> IsPostLikedByUser(int postId, int userId);
    }
}
