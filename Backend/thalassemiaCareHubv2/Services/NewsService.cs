using System.Security.Claims;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Services
{
    public class NewsService : INewsService
    {
        private readonly INewsRepository _newsRepository;

        public NewsService(INewsRepository newsRepository)
        {
            _newsRepository = newsRepository;
        }

        // News Post operations
        public async Task<bool?> CreateNewsPostAsync(CreateNewsPostRequest request, int userId)
        {
                var newsPost = new NewsPost
                {
                    UserId = userId,
                    PostTitle = request.PostTitle,
                    PostContent = request.PostContent,
                    Reference = request.Reference,
                    MediaUrl = request.MediaUrl,
                    Category = request.Category
                };

                Console.WriteLine($"[NewsService] Creating NewsPost object. Title: {newsPost.PostTitle}, Category: {newsPost.Category}");

                // Add media items if present
                if (request.MediaList != null && request.MediaList.Any())
                {
                    Console.WriteLine($"[NewsService] Adding {request.MediaList.Count} media items");
                    foreach (var mediaItem in request.MediaList)
                    {
                        newsPost.Media.Add(new Media
                        {
                            MediaUrl = mediaItem.MediaUrl,
                            MediaType = mediaItem.MediaType,
                            CreatedDate = DateTime.Now,
                            IsDelete = false
                        });
                    }
                }

                Console.WriteLine("[NewsService] Calling Repository.CreateNewsPost");
                var createdNewsPost = await _newsRepository.CreateNewsPost(newsPost);
                if (createdNewsPost == null)
                {
                    Console.WriteLine("[NewsService] Repository returned null");
                    return null;
                }
                
                Console.WriteLine($"[NewsService] Successfully created post ID: {createdNewsPost.NewsPostId}");

                return true;
        }

        public async Task<List<NewsPostResponse>> GetAllNewsPostsAsync()
        {
            try
            {
                var newsPosts = await _newsRepository.GetAllNewsPosts();
                return newsPosts.Select(MapToNewsPostResponse).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllNewsPostsAsync: {ex.Message}");
                return new List<NewsPostResponse>();
            }
        }

        public async Task<NewsPostResponse?> GetNewsPostByIdAsync(int newsPostId)
        {
            try
            {
                var newsPost = await _newsRepository.GetNewsPostById(newsPostId);
                if (newsPost == null)
                    return null;

                return MapToNewsPostResponse(newsPost);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetNewsPostByIdAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<NewsPostResponse?> UpdateNewsPostAsync(int newsPostId, UpdateNewsPostRequest request, int userId)
        {
            try
            {
                var newsPost = await _newsRepository.GetNewsPostById(newsPostId);
                if (newsPost == null)
                    return null;

                // Check if user owns the news post or is admin (assuming admin role ID is 3)
                if (newsPost.UserId != userId)
                {
                    // You might want to add admin check here
                    return null;
                }

                // Add new media items if present
                if (request.MediaList != null && request.MediaList.Any())
                {
                    foreach (var mediaItem in request.MediaList)
                    {
                        await _newsRepository.CreateMedia(new Media
                        {
                            NewsPostId = newsPostId,
                            MediaUrl = mediaItem.MediaUrl,
                            MediaType = mediaItem.MediaType,
                            CreatedDate = DateTime.Now,
                            IsDelete = false
                        });
                    }
                }

                var updatedNewsPost = await _newsRepository.UpdateNewsPost(newsPostId, request);
                if (updatedNewsPost == null)
                    return null;

                return await GetNewsPostByIdAsync(newsPostId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateNewsPostAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteNewsPostAsync(int newsPostId, int userId)
        {
            try
            {
                var newsPost = await _newsRepository.GetNewsPostById(newsPostId);
                if (newsPost == null)
                    return false;

                // Admin check is done in the controller, so we can proceed with deletion
                return await _newsRepository.DeleteNewsPost(newsPostId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteNewsPostAsync: {ex.Message}");
                return false;
            }
        }

        // Media operations
        public async Task<NewsMediaResponse?> UploadMediaAsync(int newsPostId, UploadNewsMediaRequest request, int userId)
        {
            try
            {
                var newsPost = await _newsRepository.GetNewsPostById(newsPostId);
                if (newsPost == null)
                    return null;

                // Check if user owns the news post or is admin
                if (newsPost.UserId != userId)
                {
                    return null;
                }

                var media = new Media
                {
                    NewsPostId = newsPostId,
                    MediaUrl = request.MediaUrl,
                    MediaType = request.MediaType
                };

                var createdMedia = await _newsRepository.CreateMedia(media);
                if (createdMedia == null)
                    return null;

                return new NewsMediaResponse
                {
                    MediaId = createdMedia.MediaId,
                    NewsPostId = createdMedia.NewsPostId,
                    MediaUrl = createdMedia.MediaUrl,
                    MediaType = createdMedia.MediaType,
                    CreatedDate = createdMedia.CreatedDate
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UploadMediaAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteMediaAsync(int mediaId, int userId)
        {
            try
            {
                var media = await _newsRepository.GetMediaById(mediaId);
                if (media == null)
                    return false;

                // Get the news post to check ownership
                var newsPost = await _newsRepository.GetNewsPostById(media.NewsPostId);
                if (newsPost == null)
                    return false;

                // Check if user owns the news post or is admin
                if (newsPost.UserId != userId)
                {
                    return false;
                }

                return await _newsRepository.DeleteMedia(mediaId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteMediaAsync: {ex.Message}");
                return false;
            }
        }

    // Social Features
        public async Task<NewsCommentResponse?> AddCommentAsync(int newsPostId, NewsCommentRequest request, int userId)
        {
            try
            {
                var newsPost = await _newsRepository.GetNewsPostById(newsPostId);
                if (newsPost == null) return null;

                var comment = new NewsComment
                {
                    NewsPostId = newsPostId,
                    UserId = userId,
                    CommentContent = request.CommentContent,
                    ParentCommentId = request.ParentCommentId,
                    CreationDate = DateTime.Now,
                    IsDelete = false
                };

                var createdComment = await _newsRepository.AddComment(comment);
                
                // Fetch the full comment with includes to return detailed response
                var fullComment = await _newsRepository.GetCommentById(createdComment.CommentId);
                if (fullComment == null) return null;

                return MapToNewsCommentResponse(fullComment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding comment: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            try
            {
                var comment = await _newsRepository.GetCommentById(commentId);
                if (comment == null) return false;

                // Allow delete if user owns comment
                if (comment.UserId != userId)
                {
                    // Optionally check if user is admin or owns the post?
                    // For now, only comment owner can delete
                    return false; 
                }

                return await _newsRepository.DeleteComment(commentId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting comment: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ToggleLikeAsync(int newsPostId, int userId)
        {
            try
            {
                var isLiked = await _newsRepository.IsLikedByUser(newsPostId, userId);
                if (isLiked)
                {
                    await _newsRepository.RemoveLike(newsPostId, userId);
                    return false; // Now Unliked
                }
                else
                {
                    var like = new NewsLike
                    {
                        NewsPostId = newsPostId,
                        UserId = userId,
                        LikeDate = DateTime.Now
                    };
                    await _newsRepository.AddLike(like);
                    return true; // Now Liked
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling like: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> IsLikedByUserAsync(int newsPostId, int userId)
        {
            return await _newsRepository.IsLikedByUser(newsPostId, userId);
        }

        private NewsPostResponse MapToNewsPostResponse(NewsPost newsPost)
        {
            // Note: This mapping assumes Includes are loaded or lazy loading is enabled.
            // If Includes are missing, Comments/Likes will be empty.
            
            return new NewsPostResponse
            {
                NewsPostId = newsPost.NewsPostId,
                UserId = newsPost.UserId,
                UserName = newsPost.User?.FirstName + " " + newsPost.User?.LastName ?? "Unknown",
                PostTitle = newsPost.PostTitle,
                PostContent = newsPost.PostContent,
                PublicationDate = newsPost.PublicationDate,
                Reference = newsPost.Reference,
                MediaUrl = newsPost.MediaUrl,
                Category = newsPost.Category,
                LastEditedDate = newsPost.LastEditedDate,
                Media = newsPost.Media?.Select(m => new MediaResponse
                {
                    MediaId = m.MediaId,
                    MediaUrl = m.MediaUrl,
                    MediaType = m.MediaType,
                    PostId = null,
                    CommentId = null
                }).ToList() ?? new List<MediaResponse>(),
                
                LikeCount = newsPost.Likes.Count, // Requires Include or Separate Query
                // IsLikedByCurrentUser needs to be set separately if not in context
                // For list views, we might need to pass userId to Map function?
                // Or let the Controller handle it? 
                // Currently MapToNewsPostResponse is private helper.
                Comments = newsPost.Comments
                            .Where(c => c.ParentCommentId == null) // Top level only
                            .Select(MapToNewsCommentResponse)
                            .ToList()
            };
        }

        private NewsCommentResponse MapToNewsCommentResponse(NewsComment comment)
        {
            return new NewsCommentResponse
            {
                CommentId = comment.CommentId,
                NewsPostId = comment.NewsPostId,
                UserId = comment.UserId,
                UserName = comment.User?.FirstName + " " + comment.User?.LastName ?? "Unknown",
                UserProfileImage = comment.User?.ProfilePicture ?? "", // Assuming ProfilePicture exists
                CommentContent = comment.CommentContent,
                CreationDate = comment.CreationDate,
                ParentCommentId = comment.ParentCommentId,
                RepliedComments = comment.RepliedComments
                    .Where(r => !r.IsDelete)
                    .Select(MapToNewsCommentResponse) 
                    .ToList()
            };
        }
    }
}
