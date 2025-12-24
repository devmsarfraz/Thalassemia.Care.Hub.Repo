using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Repository
{
    public class CommunityPostRepository : ICommunityPostRepository
    {
        private readonly AppDbContext _context;

        public CommunityPostRepository(AppDbContext context)
        {
            _context = context;
        }

        // Post operations
        public async Task<Post?> CreatePost(Post post)
        {
            post.CreationDate = DateTime.UtcNow;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<List<Post>> GetAllPosts()
        {
            try
            {
                return await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Comments.Where(c => !c.IsDelete))
                        .ThenInclude(c => c.User)
                    .Where(p => !p.IsDelete)
                    .OrderByDescending(p => p.CreationDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving posts: {ex.Message}");
                return new List<Post>();
            }
        }

        public async Task<Post?> GetPostById(int postId)
        {
            try
            {
                return await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Comments.Where(c => !c.IsDelete))
                        .ThenInclude(c => c.User)
                    .FirstOrDefaultAsync(p => p.PostId == postId && !p.IsDelete);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving post: {ex.Message}");
                return null;
            }
        }

        public async Task<Post?> UpdatePost(int postId, UpdatePostRequest request)
        {
            try
            {
                var post = await _context.Posts
                    .FirstOrDefaultAsync(p => p.PostId == postId && !p.IsDelete);

                if (post == null)
                    return null;

                post.PostTitle = request.PostTitle;
                post.PostContent = request.PostContent;
                post.MediaUrl = request.MediaUrl;
                post.LastEditedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return post;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating post: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeletePost(int postId)
        {
            try
            {
                var post = await _context.Posts
                    .FirstOrDefaultAsync(p => p.PostId == postId && !p.IsDelete);

                if (post == null)
                    return false;

                post.IsDelete = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting post: {ex.Message}");
                return false;
            }
        }

        // Comment operations
        public async Task<Comment?> CreateComment(Comment comment)
        {
            try
            {
                comment.CreationDate = DateTime.UtcNow;
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();
                return comment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating comment: {ex.Message}");
                return null;
            }
        }

        public async Task<List<Comment>> GetCommentsByPostId(int postId)
        {
            try
            {
                return await _context.Comments
                    .Include(c => c.User)
                    .Where(c => c.PostId == postId && !c.IsDelete)
                    .OrderBy(c => c.CreationDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving comments: {ex.Message}");
                return new List<Comment>();
            }
        }

        public async Task<Comment?> GetCommentById(int commentId)
        {
            try
            {
                return await _context.Comments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.CommentId == commentId && !c.IsDelete);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving comment: {ex.Message}");
                return null;
            }
        }

        public async Task<Comment?> UpdateComment(int commentId, UpdateCommentRequest request)
        {
            try
            {
                var comment = await _context.Comments
                    .FirstOrDefaultAsync(c => c.CommentId == commentId && !c.IsDelete);

                if (comment == null)
                    return null;

                comment.CommentContent = request.CommentContent;
                comment.LastEditedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return comment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating comment: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteComment(int commentId)
        {
            try
            {
                var comment = await _context.Comments
                    .FirstOrDefaultAsync(c => c.CommentId == commentId && !c.IsDelete);

                if (comment == null)
                    return false;

                comment.IsDelete = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting comment: {ex.Message}");
                return false;
            }
        }


        // Like operations
        public async Task<bool> ToggleLike(int postId, int userId)
        {
            try
            {
                var existingLike = await _context.PostLikes
                    .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

                if (existingLike != null)
                {
                    _context.PostLikes.Remove(existingLike);
                    await _context.SaveChangesAsync();
                    return false; // Unliked
                }
                else
                {
                    var like = new PostLike
                    {
                        PostId = postId,
                        UserId = userId,
                        LikeDate = DateTime.UtcNow
                    };
                    _context.PostLikes.Add(like);
                    await _context.SaveChangesAsync();
                    return true; // Liked
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling like: {ex.Message}");
                throw;
            }
        }

        public async Task<int> GetLikeCount(int postId)
        {
            try
            {
                return await _context.PostLikes.CountAsync(l => l.PostId == postId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving like count: {ex.Message}");
                return 0;
            }
        }

        public async Task<bool> IsPostLikedByUser(int postId, int userId)
        {
            try
            {
                return await _context.PostLikes.AnyAsync(l => l.PostId == postId && l.UserId == userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking if post is liked: {ex.Message}");
                return false;
            }
        }
    }
}
