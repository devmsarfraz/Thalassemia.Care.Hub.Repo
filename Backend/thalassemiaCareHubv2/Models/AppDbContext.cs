using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace thalassemiaCareHubv2.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<ChatSession> ChatSessions { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Media> Media { get; set; }

    public virtual DbSet<NewsComment> NewsComments { get; set; }

    public virtual DbSet<NewsLike> NewsLikes { get; set; }

    public virtual DbSet<NewsPost> NewsPosts { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<AssociationRequest> AssociationRequests { get; set; }

    public virtual DbSet<PostLike> PostLikes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-6K0L31G;Database=thalassemia_care_hub_v2;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__ChatMess__C87C037CC80B022A");

            entity.ToTable("ChatMessage");

            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.ChatSessionId).HasColumnName("ChatSessionID");
            entity.Property(e => e.SenderType).HasMaxLength(20);
            entity.Property(e => e.Timestamp).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.ChatSession).WithMany(p => p.ChatMessages)
                .HasForeignKey(d => d.ChatSessionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatMessage_ChatSessions");
        });

        modelBuilder.Entity<ChatSession>(entity =>
        {
            entity.HasKey(e => e.ChatSessionId).HasName("PK__ChatSess__9AB8242F7DDAFC0E");

            entity.Property(e => e.ChatSessionId).HasColumnName("ChatSessionID");
            entity.Property(e => e.CreationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.SessionTitle).HasMaxLength(200);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.ChatSessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatSessions_Users");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comments__C3B4DFAA36EC494A");

            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.CreationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Comments_Posts");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Comments_Users");

            entity.Property(e => e.ParentCommentId).HasColumnName("ParentCommentID");

            entity.HasOne(d => d.ParentComment)
                .WithMany(p => p.RepliedComments)
                .HasForeignKey(d => d.ParentCommentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Comments_ParentComment");
        });

        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(e => e.MediaId).HasName("PK__Media____MediaId");

            entity.HasIndex(e => e.NewsPostId, "IX_Media_NewsPostID");

            entity.Property(e => e.MediaId).HasColumnName("MediaID");
            entity.Property(e => e.CreatedDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.MediaType).HasMaxLength(50);
            entity.Property(e => e.MediaUrl).HasMaxLength(500);
            entity.Property(e => e.NewsPostId).HasColumnName("NewsPostID");

            entity.HasOne(d => d.NewsPost).WithMany(p => p.Media)
                .HasForeignKey(d => d.NewsPostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Media_NewsPosts");
        });

        modelBuilder.Entity<NewsPost>(entity =>
        {
            entity.HasKey(e => e.NewsPostId).HasName("PK__NewsPost__C9F1533E44A79F7C");

            entity.Property(e => e.NewsPostId).HasColumnName("NewsPostID");
            entity.Property(e => e.MediaUrl).HasMaxLength(500);
            entity.Property(e => e.PostTitle).HasMaxLength(200);
            entity.Property(e => e.PublicationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Reference).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.NewsPosts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NewsPosts_Users");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Posts__AA126038E546A291");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.CreationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.MediaUrl).HasMaxLength(500);
            entity.Property(e => e.PostTitle).HasMaxLength(200);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Posts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Posts_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC94241BB4");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.AssociatedUserId).HasColumnName("AssociatedUserID");
            entity.Property(e => e.BloodGroup).HasMaxLength(10);
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.GuardianName).HasMaxLength(100);
            entity.Property(e => e.GuardianNumber).HasMaxLength(15);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.RegistrationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ResetCode).HasColumnName("Reset Code");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Verified).HasDefaultValue(false);

            entity.HasOne(d => d.AssociatedUser).WithMany(p => p.InverseAssociatedUser)
                .HasForeignKey(d => d.AssociatedUserId)
                .HasConstraintName("FK_Users_AssociatedUser");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_UserRoles");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE3A04C894E6");

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(200);
        });

        modelBuilder.Entity<AssociationRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__AssociationRequests__RequestID");

            entity.ToTable("AssociationRequests");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.RequesterId).HasColumnName("RequesterID");
            entity.Property(e => e.RequestedUserId).HasColumnName("RequestedUserID");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Pending");
            entity.Property(e => e.RequestDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsDelete).HasDefaultValue(false);

            entity.HasOne(d => d.Requester)
                .WithMany()
                .HasForeignKey(d => d.RequesterId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_AssociationRequests_Requester");

            entity.HasOne(d => d.RequestedUser)
                .WithMany()
                .HasForeignKey(d => d.RequestedUserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_AssociationRequests_RequestedUser");
        });

        modelBuilder.Entity<NewsComment>(entity =>
        {
            entity.HasKey(e => e.CommentId);
            entity.ToTable("NewsComments");

            entity.Property(e => e.CommentContent).IsRequired();
            entity.Property(e => e.CreationDate).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsDelete).HasDefaultValue(false);

            entity.HasOne(d => d.NewsPost)
                .WithMany(p => p.Comments)
                .HasForeignKey(d => d.NewsPostId)
                .OnDelete(DeleteBehavior.Cascade) // Deleting post deletes comments
                .HasConstraintName("FK_NewsComments_NewsPosts");

            entity.HasOne(d => d.User)
                .WithMany() // Assuming User doesn't have explicit collection for NewsComments yet, or generic. 
                            // Only 'NewsPosts' collection exists in User. 
                            // If I want bidirectional, I should add 'NewsComments' to User.
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict) // Don't delete comment if user is deleted (or ClientSetNull)
                .HasConstraintName("FK_NewsComments_Users");

            entity.HasOne(d => d.ParentComment)
                .WithMany(p => p.RepliedComments)
                .HasForeignKey(d => d.ParentCommentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_NewsComments_ParentComment");
        });

        modelBuilder.Entity<NewsLike>(entity =>
        {
            entity.HasKey(e => e.LikeId);
            entity.ToTable("NewsLikes");

            entity.Property(e => e.LikeDate).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.NewsPost)
                .WithMany(p => p.Likes)
                .HasForeignKey(d => d.NewsPostId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_NewsLikes_NewsPosts");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_NewsLikes_Users");
        });

        modelBuilder.Entity<PostLike>(entity =>
        {
            entity.HasKey(e => e.LikeId);
            entity.ToTable("PostLikes");

            entity.Property(e => e.LikeId).HasColumnName("LikeID");
            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.LikeDate).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Post)
                .WithMany()
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostLikes_Posts");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PostLikes_Users");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
