using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class ChatSession
{
    public int ChatSessionId { get; set; }

    public int UserId { get; set; }

    public string SessionTitle { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public bool IsDelete { get; set; }

    public virtual ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();

    public virtual User User { get; set; } = null!;
}
