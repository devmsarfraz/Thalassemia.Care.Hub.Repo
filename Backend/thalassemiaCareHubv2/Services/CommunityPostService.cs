using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Services
{
    public class CommunityPostService : ICommunityPostService
    {
        private readonly ICommunityPostRepository _CommunityPostRepository;

        public CommunityPostService(ICommunityPostRepository communityrepository)
        {
            _CommunityPostRepository = communityrepository;
        }

        // Post operations
        public async Task<PostResponse?> CreatePostAsync(CreatePostRequest request, int userId)
        {
            var post = new Post
            {
                UserId = userId,
                PostTitle = request.PostTitle,
                PostContent = request.PostContent,
                MediaUrl = request.MediaUrl,
                Category = request.Category
            };

            var createdPost = await _CommunityPostRepository.CreatePost(post);
            if (createdPost == null)
                return null;

            return await GetPostByIdAsync(createdPost.PostId, userId);
        }

        public async Task<List<PostResponse>> GetAllPostsAsync(int? currentUserId = null)
        {
            try
            {
                var postResponses = await _CommunityPostRepository.GetAllPostsWithDetailsAsync(currentUserId);
                
                foreach (var post in postResponses)
                {
                    post.Comments = RebuildCommentTree(post.Comments);
                }
                
                return postResponses;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllPostsAsync: {ex.Message}");
                return new List<PostResponse>();
            }
        }

        public async Task<PostResponse?> GetPostByIdAsync(int postId, int? currentUserId = null)
        {
            try
            {
                var post = await _CommunityPostRepository.GetPostById(postId);
                if (post == null)
                    return null;

                return await MapToPostResponseAsync(post, currentUserId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPostByIdAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<PostResponse?> UpdatePostAsync(int postId, UpdatePostRequest request, int userId)
        {
            try
            {
                var post = await _CommunityPostRepository.GetPostById(postId);
                if (post == null)
                    return null;

                // Check if user owns the post
                if (post.UserId != userId)
                    return null;

                var updatedPost = await _CommunityPostRepository.UpdatePost(postId, request);
                if (updatedPost == null)
                    return null;

                return await GetPostByIdAsync(postId, userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdatePostAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeletePostAsync(int postId, int userId)
        {
            try
            {
                var post = await _CommunityPostRepository.GetPostById(postId);
                if (post == null)
                    return false;

                // Check if user owns the post
                if (post.UserId != userId)
                    return false;

                return await _CommunityPostRepository.DeletePost(postId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeletePostAsync: {ex.Message}");
                return false;
            }
        }
        
        public async Task<bool> ToggleLikeAsync(int postId, int userId)
        {
            try
            {
                var post = await _CommunityPostRepository.GetPostById(postId);
                if (post == null)
                    return false;

                return await _CommunityPostRepository.ToggleLike(postId, userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ToggleLikeAsync: {ex.Message}");
                return false;
            }
        }

        // Comment operations
        public async Task<CommentResponse?> CreateCommentAsync(int postId, CreateCommentRequest request, int userId)
        {
            try
            {
                // Verify post exists
                var post = await _CommunityPostRepository.GetPostById(postId);
                if (post == null)
                    return null;

                var comment = new Comment
                {
                    PostId = postId,
                    UserId = userId,
                    CommentContent = request.CommentContent,
                    ParentCommentId = request.ParentCommentId
                };

                var createdComment = await _CommunityPostRepository.CreateComment(comment);
                if (createdComment == null)
                    return null;

                return await GetCommentByIdAsync(createdComment.CommentId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateCommentAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<List<CommentResponse>> GetCommentsByPostIdAsync(int postId)
        {
            try
            {
                var comments = await _CommunityPostRepository.GetCommentsByPostId(postId);
                return BuildCommentTree(comments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetCommentsByPostIdAsync: {ex.Message}");
                return new List<CommentResponse>();
            }
        }

        public async Task<CommentResponse?> UpdateCommentAsync(int commentId, UpdateCommentRequest request, int userId)
        {
            try
            {
                var comment = await _CommunityPostRepository.GetCommentById(commentId);
                if (comment == null)
                    return null;

                // Check if user owns the comment
                if (comment.UserId != userId)
                    return null;

                var updatedComment = await _CommunityPostRepository.UpdateComment(commentId, request);
                if (updatedComment == null)
                    return null;

                return await GetCommentByIdAsync(commentId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateCommentAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            try
            {
                var comment = await _CommunityPostRepository.GetCommentById(commentId);
                if (comment == null)
                    return false;

                // Check if user owns the comment
                if (comment.UserId != userId)
                    return false;

                return await _CommunityPostRepository.DeleteComment(commentId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteCommentAsync: {ex.Message}");
                return false;
            }
        }


        // Helper methods
        private async Task<CommentResponse?> GetCommentByIdAsync(int commentId)
        {
            try
            {
                var comment = await _CommunityPostRepository.GetCommentById(commentId);
                if (comment == null)
                    return null;

                return MapToCommentResponse(comment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetCommentByIdAsync: {ex.Message}");
                return null;
            }
        }

        private async Task<PostResponse> MapToPostResponseAsync(Post post, int? currentUserId)
        {
            var likeCount = await _CommunityPostRepository.GetLikeCount(post.PostId);
            var isLiked = currentUserId.HasValue 
                ? await _CommunityPostRepository.IsPostLikedByUser(post.PostId, currentUserId.Value) 
                : false;

            return new PostResponse
            {
                PostId = post.PostId,
                UserId = post.UserId,
                UserName = post.User?.FirstName + " " + post.User?.LastName ?? "Unknown",
                ProfilePicture = post.User?.ProfilePicture,
                PostTitle = post.PostTitle,
                PostContent = post.PostContent,
                MediaUrl = post.MediaUrl,
                Category = post.Category,
                CreationDate = post.CreationDate,
                LastEditedDate = post.LastEditedDate,
                LikeCount = likeCount,
                IsLiked = isLiked,
                Comments = BuildCommentTree(post.Comments)
            };
        }

        private List<CommentResponse> RebuildCommentTree(List<CommentResponse> flatComments)
        {
            if (flatComments == null || !flatComments.Any())
                return new List<CommentResponse>();

            var commentDict = flatComments.ToDictionary(c => c.CommentId);
            var rootComments = new List<CommentResponse>();

            foreach (var comment in flatComments)
            {
                if (comment.ParentCommentId.HasValue && commentDict.TryGetValue(comment.ParentCommentId.Value, out var parent))
                {
                    parent.Replies.Add(comment);
                }
                else
                {
                    rootComments.Add(comment);
                }
            }

            return rootComments.OrderBy(c => c.CreationDate).ToList();
        }

        private List<CommentResponse> BuildCommentTree(ICollection<Comment>? comments)
        {
            if (comments == null || !comments.Any())
                return new List<CommentResponse>();

            var allComments = comments.Select(MapToCommentResponse).ToList();
            var commentDict = allComments.ToDictionary(c => c.CommentId);
            var rootComments = new List<CommentResponse>();

            foreach (var comment in allComments)
            {
                if (comment.ParentCommentId.HasValue && commentDict.TryGetValue(comment.ParentCommentId.Value, out var parent))
                {
                    parent.Replies.Add(comment);
                }
                else
                {
                    rootComments.Add(comment);
                }
            }

            return rootComments.OrderBy(c => c.CreationDate).ToList();
        }

        private CommentResponse MapToCommentResponse(Comment comment)
        {
            return new CommentResponse
            {
                CommentId = comment.CommentId,
                PostId = comment.PostId,
                UserId = comment.UserId,
                UserName = comment.User?.FirstName + " " + comment.User?.LastName ?? "Unknown",
                ProfilePicture = comment.User?.ProfilePicture,
                CommentContent = comment.CommentContent,
                CreationDate = comment.CreationDate,
                LastEditedDate = comment.LastEditedDate,
                ParentCommentId = comment.ParentCommentId,
                Media = new List<MediaResponse>() 
            };
        }
    }
}
