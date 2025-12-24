using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class NewsPost
{
    public int NewsPostId { get; set; }

    public int UserId { get; set; }

    public string PostTitle { get; set; } = null!;

    public string PostContent { get; set; } = null!;

    public string? Category { get; set; }

    public DateTime PublicationDate { get; set; }

    public string? Reference { get; set; }

    public string? MediaUrl { get; set; }

    public DateTime? LastEditedDate { get; set; }

    public bool IsDelete { get; set; }

    public virtual ICollection<Media> Media { get; set; } = new List<Media>();

    public virtual ICollection<NewsComment> Comments { get; set; } = new List<NewsComment>();

    public virtual ICollection<NewsLike> Likes { get; set; } = new List<NewsLike>();
    
    public virtual User User { get; set; } = null!;
}
