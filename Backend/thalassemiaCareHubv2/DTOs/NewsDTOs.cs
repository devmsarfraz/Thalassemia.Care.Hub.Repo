namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for creating a news post
    /// </summary>
    public class CreateNewsPostRequest
    {
        /// <summary>
        /// Title of the news post
        /// </summary>
        /// <example>New Thalassemia Treatment Breakthrough</example>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Content of the news post
        /// </summary>
        /// <example>Researchers have announced a breakthrough in thalassemia treatment...</example>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// Reference or source URL for the news post (optional)
        /// </summary>
        /// <example>https://medicaljournal.org/thalassemia-breakthrough</example>
        public string? Reference { get; set; }
        
        /// <summary>
        /// URL of the media file attached to the post (optional)
        /// </summary>
        /// <example>https://storage.example.com/files/news-image.jpg</example>
        public string? MediaUrl { get; set; }

        /// <summary>
        /// Category of the news post (e.g. Research, General)
        /// </summary>
        public string? Category { get; set; }



        /// <summary>
        /// List of media files to attach to the news post
        /// </summary>
        public List<UploadNewsMediaRequest>? MediaList { get; set; }
    }

    /// <summary>
    /// Request model for updating a news post
    /// </summary>
    public class UpdateNewsPostRequest
    {
        /// <summary>
        /// Updated title of the news post
        /// </summary>
        /// <example>Updated: New Thalassemia Treatment Breakthrough</example>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated content of the news post
        /// </summary>
        /// <example>Updated information about the breakthrough...</example>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated reference or source URL for the news post (optional)
        /// </summary>
        /// <example>https://medicaljournal.org/thalassemia-breakthrough-updated</example>
        public string? Reference { get; set; }
        
        /// <summary>
        /// Updated URL of the media file attached to the post (optional)
        /// </summary>
        /// <example>https://storage.example.com/files/updated-news-image.jpg</example>
        public string? MediaUrl { get; set; }

        /// <summary>
        /// List of new media files to attach to the news post
        /// </summary>
        public List<UploadNewsMediaRequest>? MediaList { get; set; }
    }

    /// <summary>
    /// Response model for news post operations
    /// </summary>
    public class NewsPostResponse
    {
        /// <summary>
        /// Unique identifier of the news post
        /// </summary>
        public int NewsPostId { get; set; }
        
        /// <summary>
        /// ID of the user who created the news post
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Name of the user who created the news post
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// Title of the news post
        /// </summary>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Content of the news post
        /// </summary>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// Date when the news post was published
        /// </summary>
        public DateTime PublicationDate { get; set; }
        
        /// <summary>
        /// Reference or source URL for the news post
        /// </summary>
        public string? Reference { get; set; }
        
        /// <summary>
        /// URL of the media file attached to the post
        /// </summary>
        public string? MediaUrl { get; set; }

        /// <summary>
        /// Category of the news post
        /// </summary>
        public string? Category { get; set; }
        
        /// <summary>
        /// Date when the news post was last edited
        /// </summary>
        public DateTime? LastEditedDate { get; set; }
        
        /// <summary>
        /// List of media files attached to this news post
        /// </summary>
        public List<MediaResponse> Media { get; set; } = new List<MediaResponse>();
        
        // Social Features
        /// <summary>
        /// The number of likes the news post has received.
        /// </summary>
        public int LikeCount { get; set; }
        
        /// <summary>
        /// Indicates if the current user has liked this news post.
        /// </summary>
        public bool IsLikedByCurrentUser { get; set; }
        
        /// <summary>
        /// List of comments associated with this news post.
        /// </summary>
        public List<NewsCommentResponse> Comments { get; set; } = new List<NewsCommentResponse>();
    }

    /// <summary>
    /// Request model for adding a comment to a news post
    /// </summary>
    public class NewsCommentRequest
    {
        /// <summary>
        /// The content of the comment.
        /// </summary>
        public string CommentContent { get; set; } = string.Empty;
        
        /// <summary>
        /// The ID of the parent comment if this is a reply, otherwise null.
        /// </summary>
        public int? ParentCommentId { get; set; }
    }

    /// <summary>
    /// Response model for a news comment
    /// </summary>
    public class NewsCommentResponse
    {
        /// <summary>
        /// Unique identifier of the comment.
        /// </summary>
        public int CommentId { get; set; }
        
        /// <summary>
        /// The ID of the news post this comment belongs to.
        /// </summary>
        public int NewsPostId { get; set; }
        
        /// <summary>
        /// The ID of the user who made the comment.
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// The username of the user who made the comment.
        /// </summary>
        public string UserName { get; set; } = string.Empty;
        
        /// <summary>
        /// The URL of the user's profile image.
        /// </summary>
        public string UserProfileImage { get; set; } = string.Empty;
        
        /// <summary>
        /// The content of the comment.
        /// </summary>
        public string CommentContent { get; set; } = string.Empty;
        
        /// <summary>
        /// The date and time when the comment was created.
        /// </summary>
        public DateTime CreationDate { get; set; }
        
        /// <summary>
        /// The ID of the parent comment if this is a reply, otherwise null.
        /// </summary>
        public int? ParentCommentId { get; set; }
        
        /// <summary>
        /// A list of replies to this comment.
        /// </summary>
        public List<NewsCommentResponse> RepliedComments { get; set; } = new List<NewsCommentResponse>();
    }

    /// <summary>
    /// Request model for uploading media to a news post
    /// </summary>
    public class UploadNewsMediaRequest
    {
        /// <summary>
        /// URL of the uploaded media file
        /// </summary>
        /// <example>https://storage.example.com/files/news-medical-image.jpg</example>
        public string MediaUrl { get; set; } = string.Empty;
        
        /// <summary>
        /// Type of media file (image, video, document)
        /// </summary>
        /// <example>image</example>
        public string MediaType { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for news media operations
    /// </summary>
    public class NewsMediaResponse
    {
        /// <summary>
        /// Unique identifier of the media file
        /// </summary>
        public int MediaId { get; set; }
        
        /// <summary>
        /// ID of the news post this media belongs to
        /// </summary>
        public int NewsPostId { get; set; }
        
        /// <summary>
        /// URL of the media file
        /// </summary>
        public string MediaUrl { get; set; } = string.Empty;
        
        /// <summary>
        /// Type of media (image, video, document)
        /// </summary>
        public string MediaType { get; set; } = string.Empty;
        
        /// <summary>
        /// Date when the media was uploaded
        /// </summary>
        public DateTime CreatedDate { get; set; }
    }
}
