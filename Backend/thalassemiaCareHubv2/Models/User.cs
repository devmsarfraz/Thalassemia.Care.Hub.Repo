using System;
using System.Collections.Generic;

namespace thalassemiaCareHubv2.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateTime RegistrationDate { get; set; }

    public int? AssociatedUserId { get; set; }

    public bool IsDelete { get; set; }

    public int RoleId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public string? BloodGroup { get; set; }

    public string? Gender { get; set; }

    public string? GuardianName { get; set; }

    public string? GuardianNumber { get; set; }

    public int? ResetCode { get; set; }

    public bool? Verified { get; set; }

    public string? ProfilePicture { get; set; }

    public virtual User? AssociatedUser { get; set; }

    public virtual ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<User> InverseAssociatedUser { get; set; } = new List<User>();

    public virtual ICollection<NewsPost> NewsPosts { get; set; } = new List<NewsPost>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual UserRole Role { get; set; } = null!;
}
