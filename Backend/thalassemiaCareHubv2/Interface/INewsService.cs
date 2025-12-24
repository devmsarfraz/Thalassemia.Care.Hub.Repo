using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Interface
{
    public interface INewsService
    {
        // News Post operations
        Task<bool?> CreateNewsPostAsync(CreateNewsPostRequest request, int userId);
        Task<List<NewsPostResponse>> GetAllNewsPostsAsync();
        Task<NewsPostResponse?> GetNewsPostByIdAsync(int newsPostId);
        Task<NewsPostResponse?> UpdateNewsPostAsync(int newsPostId, UpdateNewsPostRequest request, int userId);
        Task<bool> DeleteNewsPostAsync(int newsPostId, int userId);
        Task<NewsMediaResponse?> UploadMediaAsync(int newsPostId, UploadNewsMediaRequest request, int userId);
        Task<bool> DeleteMediaAsync(int mediaId, int userId);

        // Social features
        Task<NewsCommentResponse?> AddCommentAsync(int newsPostId, NewsCommentRequest request, int userId);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
        Task<bool> ToggleLikeAsync(int newsPostId, int userId);
        Task<bool> IsLikedByUserAsync(int newsPostId, int userId);
    }
}
