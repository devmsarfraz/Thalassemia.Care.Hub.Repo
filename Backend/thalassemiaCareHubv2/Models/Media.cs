using System;

namespace thalassemiaCareHubv2.Models;

public partial class Media
{
    public int MediaId { get; set; }

    public int NewsPostId { get; set; }

    public string MediaUrl { get; set; } = null!;

    public string MediaType { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public bool IsDelete { get; set; }

    public virtual NewsPost NewsPost { get; set; } = null!;
}
