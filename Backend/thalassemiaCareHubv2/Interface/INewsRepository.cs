using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    public interface INewsRepository
    {
        // News Post operations
        Task<NewsPost?> CreateNewsPost(NewsPost newsPost);
        Task<List<NewsPost>> GetAllNewsPosts();
        Task<NewsPost?> GetNewsPostById(int newsPostId);
        Task<NewsPost?> UpdateNewsPost(int newsPostId, UpdateNewsPostRequest request);
        Task<bool> DeleteNewsPost(int newsPostId);

        // Media operations
        Task<Media?> CreateMedia(Media media);
        Task<Media?> GetMediaById(int mediaId);
        Task<List<Media>> GetMediaByNewsPostId(int newsPostId);
        Task<bool> DeleteMedia(int mediaId);

        // Comment operations
        Task<NewsComment> AddComment(NewsComment comment);
        Task<NewsComment?> GetCommentById(int commentId);
        Task<bool> DeleteComment(int commentId);
        Task<List<NewsComment>> GetCommentsByNewsPostId(int newsPostId);

        // Like operations
        Task<bool> AddLike(NewsLike like);
        Task<bool> RemoveLike(int newsPostId, int userId);
        Task<bool> IsLikedByUser(int newsPostId, int userId);
        Task<int> GetLikeCount(int newsPostId);
    }
}
