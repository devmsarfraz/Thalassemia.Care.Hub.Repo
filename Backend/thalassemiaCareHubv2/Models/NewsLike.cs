using System;

namespace thalassemiaCareHubv2.Models;

public partial class NewsLike
{
    public int LikeId { get; set; }

    public int NewsPostId { get; set; }

    public int UserId { get; set; }

    public DateTime LikeDate { get; set; }

    public virtual NewsPost NewsPost { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
