using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class ChatMessage
{
    public int MessageId { get; set; }

    public int ChatSessionId { get; set; }

    public string SenderType { get; set; } = null!;

    public string MessageContent { get; set; } = null!;

    public DateTime Timestamp { get; set; }

    public virtual ChatSession ChatSession { get; set; } = null!;
}
