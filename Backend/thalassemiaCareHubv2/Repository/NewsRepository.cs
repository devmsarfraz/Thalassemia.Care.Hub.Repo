using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Repository
{
    public class NewsRepository : INewsRepository
    {
        private readonly AppDbContext _context;

        public NewsRepository(AppDbContext context)
        {
            _context = context;
        }

        // News Post operations
        public async Task<NewsPost?> CreateNewsPost(NewsPost newsPost)
        {
                newsPost.PublicationDate = DateTime.UtcNow;
                _context.NewsPosts.Add(newsPost);
                await _context.SaveChangesAsync();
                Console.WriteLine(newsPost);

                return newsPost;
        }

        public async Task<List<NewsPost>> GetAllNewsPosts()
        {
            try
            {
                return await _context.NewsPosts
                    .Where(np => !np.IsDelete)
                    //.Include(np => np.User)
                    .Include(np => np.Media.Where(m => !m.IsDelete))
                    .OrderByDescending(np => np.PublicationDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all news posts: {ex.Message}");
                return new List<NewsPost>();
            }
        }

        public async Task<NewsPost?> GetNewsPostById(int newsPostId)
        {
            try
            {
                var newspost = await _context.NewsPosts
                    .Where(np => np.NewsPostId == newsPostId && !np.IsDelete)
                    .Include(np => np.User)
                    .Include(np => np.Media.Where(m => !m.IsDelete))
                    .Include(np => np.Likes)
                    .Include(np => np.Comments.Where(c => !c.IsDelete))
                        .ThenInclude(c => c.User)
                    .Include(np => np.Comments.Where(c => !c.IsDelete))
                        .ThenInclude(c => c.RepliedComments.Where(r => !r.IsDelete))
                            .ThenInclude(r => r.User)
                    .FirstOrDefaultAsync();
                return newspost;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting news post by ID: {ex.Message}");
                return null;
            }
        }

        public async Task<NewsPost?> UpdateNewsPost(int newsPostId, UpdateNewsPostRequest request)
        {
            try
            {
                var newsPost = await _context.NewsPosts
                    .FirstOrDefaultAsync(np => np.NewsPostId == newsPostId && !np.IsDelete);

                if (newsPost == null)
                    return null;

                newsPost.PostTitle = request.PostTitle;
                newsPost.PostContent = request.PostContent;
                newsPost.Reference = request.Reference;
                newsPost.MediaUrl = request.MediaUrl;
                newsPost.LastEditedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return newsPost;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating news post: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteNewsPost(int newsPostId)
        {
            try
            {
                var newsPost = await _context.NewsPosts
                    .FirstOrDefaultAsync(np => np.NewsPostId == newsPostId && !np.IsDelete);

                if (newsPost == null)
                    return false;

                newsPost.IsDelete = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting news post: {ex.Message}");
                return false;
            }
        }

        // Media operations
        public async Task<Media?> CreateMedia(Media media)
        {
            try
            {
                media.CreatedDate = DateTime.UtcNow;
                _context.Media.Add(media);
                await _context.SaveChangesAsync();
                return media;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating media: {ex.Message}");
                return null;
            }
        }

        public async Task<Media?> GetMediaById(int mediaId)
        {
            try
            {
                return await _context.Media
                    .Where(m => m.MediaId == mediaId && !m.IsDelete)
                    .Include(m => m.NewsPost)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting media by ID: {ex.Message}");
                return null;
            }
        }

        public async Task<List<Media>> GetMediaByNewsPostId(int newsPostId)
        {
            try
            {
                return await _context.Media
                    .Where(m => m.NewsPostId == newsPostId && !m.IsDelete)
                    .OrderByDescending(m => m.CreatedDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting media by news post ID: {ex.Message}");
                return new List<Media>();
            }
        }

        public async Task<bool> DeleteMedia(int mediaId)
        {
            try
            {
                var media = await _context.Media.FindAsync(mediaId);
                if (media == null)
                    return false;

                _context.Media.Remove(media);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting media: {ex.Message}");
                return false;
            }
        }

        // Comment operations
        public async Task<NewsComment> AddComment(NewsComment comment)
        {
            try
            {
                await _context.NewsComments.AddAsync(comment);
                await _context.SaveChangesAsync();
                return comment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding comment: {ex.Message}");
                throw;
            }
        }

        public async Task<NewsComment?> GetCommentById(int commentId)
        {
            try
            {
                return await _context.NewsComments
                    .Include(c => c.User)
                    .ThenInclude(u => u.Role) 
                    .FirstOrDefaultAsync(c => c.CommentId == commentId && !c.IsDelete);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting comment: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteComment(int commentId)
        {
            try
            {
                var comment = await _context.NewsComments.FindAsync(commentId);
                if (comment == null) return false;

                comment.IsDelete = true;
                _context.NewsComments.Update(comment);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting comment: {ex.Message}");
                return false;
            }
        }

        public async Task<List<NewsComment>> GetCommentsByNewsPostId(int newsPostId)
        {
            try
            {
                return await _context.NewsComments
                    .Where(c => c.NewsPostId == newsPostId && !c.IsDelete && c.ParentCommentId == null) // Get top level comments
                    .Include(c => c.User)
                    .Include(c => c.RepliedComments.Where(r => !r.IsDelete))
                        .ThenInclude(r => r.User)
                    .OrderByDescending(c => c.CreationDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting comments: {ex.Message}");
                return new List<NewsComment>();
            }
        }

        // Like operations
        public async Task<bool> AddLike(NewsLike like)
        {
            try
            {
                if (await _context.NewsLikes.AnyAsync(l => l.NewsPostId == like.NewsPostId && l.UserId == like.UserId))
                    return false; // Already liked

                await _context.NewsLikes.AddAsync(like);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding like: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RemoveLike(int newsPostId, int userId)
        {
            try
            {
                var like = await _context.NewsLikes
                    .FirstOrDefaultAsync(l => l.NewsPostId == newsPostId && l.UserId == userId);
                
                if (like == null) return false;

                _context.NewsLikes.Remove(like);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error removing like: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> IsLikedByUser(int newsPostId, int userId)
        {
            return await _context.NewsLikes.AnyAsync(l => l.NewsPostId == newsPostId && l.UserId == userId);
        }

        public async Task<int> GetLikeCount(int newsPostId)
        {
            return await _context.NewsLikes.CountAsync(l => l.NewsPostId == newsPostId);
        }
    }
}
