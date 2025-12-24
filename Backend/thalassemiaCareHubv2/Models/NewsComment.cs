using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class NewsComment
{
    public int CommentId { get; set; }

    public int NewsPostId { get; set; }

    public int UserId { get; set; }

    public string CommentContent { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public bool IsDelete { get; set; }

    public int? ParentCommentId { get; set; }

    public virtual NewsPost NewsPost { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual NewsComment? ParentComment { get; set; }

    public virtual ICollection<NewsComment> RepliedComments { get; set; } = new List<NewsComment>();
}
