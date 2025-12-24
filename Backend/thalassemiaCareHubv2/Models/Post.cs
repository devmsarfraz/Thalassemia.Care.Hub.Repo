using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public string PostTitle { get; set; } = null!;

    public string PostContent { get; set; } = null!;

    public string? MediaUrl { get; set; }

    public string? Category { get; set; }

    public DateTime CreationDate { get; set; }

    public DateTime? LastEditedDate { get; set; }

    public bool IsDelete { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual User User { get; set; } = null!;
}
