namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for creating a community post
    /// </summary>
    public class CreatePostRequest
    {
        /// <summary>
        /// Title of the post
        /// </summary>
        /// <example>Tips for Managing Thalassemia Symptoms</example>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Content of the post
        /// </summary>
        /// <example>Here are some helpful tips I've learned...</example>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// URL of the media file attached to the post (optional)
        /// </summary>
        /// <example>https://storage.example.com/files/thalassemia-tips-image.jpg</example>
        public string? MediaUrl { get; set; }

        /// <summary>
        /// Category of the post (optional)
        /// </summary>
        /// <example>Medical Queries</example>
        public string? Category { get; set; }
    }

    /// <summary>
    /// Request model for updating a community post
    /// </summary>
    public class UpdatePostRequest
    {
        /// <summary>
        /// Updated title of the post
        /// </summary>
        /// <example>Updated Tips for Managing Thalassemia Symptoms</example>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated content of the post
        /// </summary>
        /// <example>Here are some updated helpful tips...</example>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated URL of the media file attached to the post (optional)
        /// </summary>
        /// <example>https://storage.example.com/files/updated-thalassemia-image.jpg</example>
        public string? MediaUrl { get; set; }
    }

    /// <summary>
    /// Response model for community post operations
    /// </summary>
    public class PostResponse
    {
        /// <summary>
        /// Unique identifier of the post
        /// </summary>
        public int PostId { get; set; }
        
        /// <summary>
        /// ID of the user who created the post
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Name of the user who created the post
        /// </summary>
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// URL of the user's profile picture
        /// </summary>
        public string? ProfilePicture { get; set; }
        
        /// <summary>
        /// Title of the post
        /// </summary>
        public string PostTitle { get; set; } = string.Empty;
        
        /// <summary>
        /// Content of the post
        /// </summary>
        public string PostContent { get; set; } = string.Empty;
        
        /// <summary>
        /// URL of the media file attached to the post
        /// </summary>
        public string? MediaUrl { get; set; }

        /// <summary>
        /// Category of the post
        /// </summary>
        public string? Category { get; set; }
        
        /// <summary>
        /// Date when the post was created
        /// </summary>
        public DateTime CreationDate { get; set; }
        
        /// <summary>
        /// Date when the post was last edited
        /// </summary>
        public DateTime? LastEditedDate { get; set; }
        
        /// <summary>
        /// List of comments on this post
        /// </summary>
        public List<CommentResponse> Comments { get; set; } = new List<CommentResponse>();
        
        /// <summary>
        /// List of media files attached to this post
        /// </summary>
        public List<MediaResponse> Media { get; set; } = new List<MediaResponse>();

        /// <summary>
        /// Total number of likes for the post
        /// </summary>
        public int LikeCount { get; set; }

        /// <summary>
        /// Whether the current user has liked the post
        /// </summary>
        public bool IsLiked { get; set; }
    }

    /// <summary>
    /// Response model for comment operations
    /// </summary>
    public class CommentResponse
    {
        /// <summary>
        /// Unique identifier of the comment
        /// </summary>
        public int CommentId { get; set; }
        
        /// <summary>
        /// ID of the post this comment belongs to
        /// </summary>
        public int PostId { get; set; }
        
        /// <summary>
        /// ID of the user who created the comment
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// Name of the user who created the comment
        /// </summary>
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// URL of the user's profile picture
        /// </summary>
        public string? ProfilePicture { get; set; }
        
        /// <summary>
        /// Content of the comment
        /// </summary>
        public string CommentContent { get; set; } = string.Empty;
        
        /// <summary>
        /// Date when the comment was created
        /// </summary>
        public DateTime CreationDate { get; set; }
        
        /// <summary>
        /// Date when the comment was last edited
        /// </summary>
        public DateTime? LastEditedDate { get; set; }
        
        /// <summary>
        /// List of media files attached to this comment
        /// </summary>
        public List<MediaResponse> Media { get; set; } = new List<MediaResponse>();

        /// <summary>
        /// ID of the parent comment if this is a reply
        /// </summary>
        public int? ParentCommentId { get; set; }

        /// <summary>
        /// List of replies to this comment
        /// </summary>
        public List<CommentResponse> Replies { get; set; } = new List<CommentResponse>();
    }

    /// <summary>
    /// Request model for creating a comment
    /// </summary>
    public class CreateCommentRequest
    {
        /// <summary>
        /// Content of the comment
        /// </summary>
        /// <example>Great post! I found this very helpful.</example>
        public string CommentContent { get; set; } = string.Empty;

        /// <summary>
        /// ID of the parent comment if replying to a comment (optional)
        /// </summary>
        public int? ParentCommentId { get; set; }
    }

    /// <summary>
    /// Request model for updating a comment
    /// </summary>
    public class UpdateCommentRequest
    {
        /// <summary>
        /// Updated content of the comment
        /// </summary>
        /// <example>Updated comment content</example>
        public string CommentContent { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for media operations
    /// </summary>
    public class MediaResponse
    {
        /// <summary>
        /// Unique identifier of the media file
        /// </summary>
        public int MediaId { get; set; }
        
        /// <summary>
        /// URL of the media file
        /// </summary>
        public string MediaUrl { get; set; } = string.Empty;
        
        /// <summary>
        /// Type of media (image, video, document)
        /// </summary>
        public string MediaType { get; set; } = string.Empty;
        
        /// <summary>
        /// ID of the post this media belongs to (if any)
        /// </summary>
        public int? PostId { get; set; }
        
        /// <summary>
        /// ID of the comment this media belongs to (if any)
        /// </summary>
        public int? CommentId { get; set; }
    }

    /// <summary>
    /// Request model for uploading media
    /// </summary>
    public class UploadMediaRequest
    {
        /// <summary>
        /// URL of the uploaded media file
        /// </summary>
        /// <example>https://storage.example.com/files/image123.jpg</example>
        public string MediaUrl { get; set; } = string.Empty;
        
        /// <summary>
        /// Type of media file
        /// </summary>
        /// <example>image</example>
        public string MediaType { get; set; } = string.Empty;
    }
}
