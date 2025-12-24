using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public string CommentContent { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public DateTime? LastEditedDate { get; set; }

    public bool IsDelete { get; set; }

    public int? ParentCommentId { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual Comment? ParentComment { get; set; }
    
    public virtual ICollection<Comment> RepliedComments { get; set; } = new List<Comment>();
}
