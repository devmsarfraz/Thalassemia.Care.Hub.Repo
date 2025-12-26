-- =============================================
-- Thalassemia Care Hub Database Creation Script
-- Server: MUHAMMADSARFRAZ
-- Database: thalassemia_care_hub_v2
-- =============================================

USE [master];
GO

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'thalassemia_care_hub_v2')
BEGIN
    CREATE DATABASE [thalassemia_care_hub_v2];
END
GO

USE [thalassemia_care_hub_v2];
GO

-- =============================================
-- Create Tables
-- =============================================

-- 1. UserRoles Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserRoles](
        [RoleID] [int] IDENTITY(1,1) NOT NULL,
        [RoleName] [nvarchar](200) NOT NULL,
        CONSTRAINT [PK__UserRole__8AFACE3A04C894E6] PRIMARY KEY CLUSTERED ([RoleID] ASC)
    );
END
GO

-- 2. Users Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users](
        [UserID] [int] IDENTITY(1,1) NOT NULL,
        [Email] [nvarchar](200) NOT NULL,
        [Password] [nvarchar](max) NOT NULL,
        [RegistrationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [AssociatedUserID] [int] NULL,
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        [RoleID] [int] NOT NULL,
        [FirstName] [nvarchar](100) NOT NULL,
        [LastName] [nvarchar](100) NOT NULL,
        [PhoneNumber] [nvarchar](15) NULL,
        [Address] [nvarchar](255) NULL,
        [BloodGroup] [nvarchar](10) NULL,
        [Gender] [nvarchar](10) NULL,
        [GuardianName] [nvarchar](100) NULL,
        [GuardianNumber] [nvarchar](15) NULL,
        [Reset Code] [int] NULL,
        [Verified] [bit] NULL DEFAULT 0,
        [ProfilePicture] [nvarchar](max) NULL,
        CONSTRAINT [PK__Users__1788CCAC94241BB4] PRIMARY KEY CLUSTERED ([UserID] ASC)
    );
END
GO

-- 3. AssociationRequests Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AssociationRequests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AssociationRequests](
        [RequestID] [int] IDENTITY(1,1) NOT NULL,
        [RequesterID] [int] NOT NULL,
        [RequestedUserID] [int] NOT NULL,
        [Status] [nvarchar](20) NOT NULL DEFAULT N'Pending',
        [RequestDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [ResponseDate] [datetime2](7) NULL,
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__AssociationRequests__RequestID] PRIMARY KEY CLUSTERED ([RequestID] ASC)
    );
END
GO

-- 4. ChatSessions Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ChatSessions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ChatSessions](
        [ChatSessionID] [int] IDENTITY(1,1) NOT NULL,
        [UserID] [int] NOT NULL,
        [SessionTitle] [nvarchar](200) NOT NULL,
        [CreationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__ChatSess__9AB8242F7DDAFC0E] PRIMARY KEY CLUSTERED ([ChatSessionID] ASC)
    );
END
GO

-- 5. ChatMessage Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ChatMessage]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ChatMessage](
        [MessageID] [int] IDENTITY(1,1) NOT NULL,
        [ChatSessionID] [int] NOT NULL,
        [SenderType] [nvarchar](20) NOT NULL,
        [MessageContent] [nvarchar](max) NOT NULL,
        [Timestamp] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        CONSTRAINT [PK__ChatMess__C87C037CC80B022A] PRIMARY KEY CLUSTERED ([MessageID] ASC)
    );
END
GO

-- 6. NewsPosts Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NewsPosts]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NewsPosts](
        [NewsPostID] [int] IDENTITY(1,1) NOT NULL,
        [UserID] [int] NOT NULL,
        [PostTitle] [nvarchar](200) NOT NULL,
        [PostContent] [nvarchar](max) NOT NULL,
        [Category] [nvarchar](max) NULL,
        [PublicationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [Reference] [nvarchar](500) NULL,
        [MediaUrl] [nvarchar](500) NULL,
        [LastEditedDate] [datetime2](7) NULL,
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__NewsPost__C9F1533E44A79F7C] PRIMARY KEY CLUSTERED ([NewsPostID] ASC)
    );
END
GO

-- 7. Media Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Media]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Media](
        [MediaID] [int] IDENTITY(1,1) NOT NULL,
        [NewsPostID] [int] NOT NULL,
        [MediaUrl] [nvarchar](500) NOT NULL,
        [MediaType] [nvarchar](50) NOT NULL,
        [CreatedDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__Media____MediaId] PRIMARY KEY CLUSTERED ([MediaID] ASC)
    );
END
GO

-- 8. NewsComments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NewsComments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NewsComments](
        [CommentID] [int] IDENTITY(1,1) NOT NULL,
        [NewsPostID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [ParentCommentID] [int] NULL,
        [CommentContent] [nvarchar](max) NOT NULL,
        [CreationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK_NewsComments] PRIMARY KEY CLUSTERED ([CommentID] ASC)
    );
END
GO

-- 9. NewsLikes Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NewsLikes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NewsLikes](
        [LikeID] [int] IDENTITY(1,1) NOT NULL,
        [NewsPostID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [LikeDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        CONSTRAINT [PK_NewsLikes] PRIMARY KEY CLUSTERED ([LikeID] ASC)
    );
END
GO

-- 10. Posts Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Posts]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Posts](
        [PostID] [int] IDENTITY(1,1) NOT NULL,
        [UserID] [int] NOT NULL,
        [PostTitle] [nvarchar](200) NOT NULL,
        [PostContent] [nvarchar](max) NOT NULL,
        [MediaUrl] [nvarchar](500) NULL,
        [Category] [nvarchar](max) NULL,
        [CreationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [LastEditedDate] [datetime2](7) NULL,
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__Posts__AA126038E546A291] PRIMARY KEY CLUSTERED ([PostID] ASC)
    );
END
GO

-- 11. Comments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Comments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Comments](
        [CommentID] [int] IDENTITY(1,1) NOT NULL,
        [PostID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [ParentCommentID] [int] NULL,
        [CommentContent] [nvarchar](max) NOT NULL,
        [CreationDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        [LastEditedDate] [datetime2](7) NULL,
        [IsDelete] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK__Comments__C3B4DFAA36EC494A] PRIMARY KEY CLUSTERED ([CommentID] ASC)
    );
END
GO

-- 12. PostLikes Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PostLikes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PostLikes](
        [LikeID] [int] IDENTITY(1,1) NOT NULL,
        [PostID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [LikeDate] [datetime2](7) NOT NULL DEFAULT (sysutcdatetime()),
        CONSTRAINT [PK_PostLikes] PRIMARY KEY CLUSTERED ([LikeID] ASC)
    );
END
GO

-- =============================================
-- Create Foreign Keys
-- =============================================

-- Users Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Users_AssociatedUser]'))
BEGIN
    ALTER TABLE [dbo].[Users] WITH CHECK ADD CONSTRAINT [FK_Users_AssociatedUser] 
    FOREIGN KEY([AssociatedUserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Users_UserRoles]'))
BEGIN
    ALTER TABLE [dbo].[Users] WITH CHECK ADD CONSTRAINT [FK_Users_UserRoles] 
    FOREIGN KEY([RoleID]) REFERENCES [dbo].[UserRoles] ([RoleID]);
END
GO

-- AssociationRequests Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_AssociationRequests_RequestedUser]'))
BEGIN
    ALTER TABLE [dbo].[AssociationRequests] WITH CHECK ADD CONSTRAINT [FK_AssociationRequests_RequestedUser] 
    FOREIGN KEY([RequestedUserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_AssociationRequests_Requester]'))
BEGIN
    ALTER TABLE [dbo].[AssociationRequests] WITH CHECK ADD CONSTRAINT [FK_AssociationRequests_Requester] 
    FOREIGN KEY([RequesterID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- ChatSessions Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ChatSessions_Users]'))
BEGIN
    ALTER TABLE [dbo].[ChatSessions] WITH CHECK ADD CONSTRAINT [FK_ChatSessions_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- ChatMessage Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_ChatMessage_ChatSessions]'))
BEGIN
    ALTER TABLE [dbo].[ChatMessage] WITH CHECK ADD CONSTRAINT [FK_ChatMessage_ChatSessions] 
    FOREIGN KEY([ChatSessionID]) REFERENCES [dbo].[ChatSessions] ([ChatSessionID]);
END
GO

-- NewsPosts Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsPosts_Users]'))
BEGIN
    ALTER TABLE [dbo].[NewsPosts] WITH CHECK ADD CONSTRAINT [FK_NewsPosts_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- Media Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Media_NewsPosts]'))
BEGIN
    ALTER TABLE [dbo].[Media] WITH CHECK ADD CONSTRAINT [FK_Media_NewsPosts] 
    FOREIGN KEY([NewsPostID]) REFERENCES [dbo].[NewsPosts] ([NewsPostID]);
END
GO

-- NewsComments Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsComments_NewsPosts]'))
BEGIN
    ALTER TABLE [dbo].[NewsComments] WITH CHECK ADD CONSTRAINT [FK_NewsComments_NewsPosts] 
    FOREIGN KEY([NewsPostID]) REFERENCES [dbo].[NewsPosts] ([NewsPostID]) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsComments_Users]'))
BEGIN
    ALTER TABLE [dbo].[NewsComments] WITH CHECK ADD CONSTRAINT [FK_NewsComments_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsComments_ParentComment]'))
BEGIN
    ALTER TABLE [dbo].[NewsComments] WITH CHECK ADD CONSTRAINT [FK_NewsComments_ParentComment] 
    FOREIGN KEY([ParentCommentID]) REFERENCES [dbo].[NewsComments] ([CommentID]);
END
GO

-- NewsLikes Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsLikes_NewsPosts]'))
BEGIN
    ALTER TABLE [dbo].[NewsLikes] WITH CHECK ADD CONSTRAINT [FK_NewsLikes_NewsPosts] 
    FOREIGN KEY([NewsPostID]) REFERENCES [dbo].[NewsPosts] ([NewsPostID]) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_NewsLikes_Users]'))
BEGIN
    ALTER TABLE [dbo].[NewsLikes] WITH CHECK ADD CONSTRAINT [FK_NewsLikes_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- Posts Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Posts_Users]'))
BEGIN
    ALTER TABLE [dbo].[Posts] WITH CHECK ADD CONSTRAINT [FK_Posts_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- Comments Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comments_Posts]'))
BEGIN
    ALTER TABLE [dbo].[Comments] WITH CHECK ADD CONSTRAINT [FK_Comments_Posts] 
    FOREIGN KEY([PostID]) REFERENCES [dbo].[Posts] ([PostID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comments_Users]'))
BEGIN
    ALTER TABLE [dbo].[Comments] WITH CHECK ADD CONSTRAINT [FK_Comments_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Comments_ParentComment]'))
BEGIN
    ALTER TABLE [dbo].[Comments] WITH CHECK ADD CONSTRAINT [FK_Comments_ParentComment] 
    FOREIGN KEY([ParentCommentID]) REFERENCES [dbo].[Comments] ([CommentID]);
END
GO

-- PostLikes Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_PostLikes_Posts]'))
BEGIN
    ALTER TABLE [dbo].[PostLikes] WITH CHECK ADD CONSTRAINT [FK_PostLikes_Posts] 
    FOREIGN KEY([PostID]) REFERENCES [dbo].[Posts] ([PostID]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_PostLikes_Users]'))
BEGIN
    ALTER TABLE [dbo].[PostLikes] WITH CHECK ADD CONSTRAINT [FK_PostLikes_Users] 
    FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
END
GO

-- =============================================
-- Create Indexes
-- =============================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_AssociatedUserID')
    CREATE NONCLUSTERED INDEX [IX_Users_AssociatedUserID] ON [dbo].[Users]([AssociatedUserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_RoleID')
    CREATE NONCLUSTERED INDEX [IX_Users_RoleID] ON [dbo].[Users]([RoleID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AssociationRequests_RequestedUserID')
    CREATE NONCLUSTERED INDEX [IX_AssociationRequests_RequestedUserID] ON [dbo].[AssociationRequests]([RequestedUserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AssociationRequests_RequesterID')
    CREATE NONCLUSTERED INDEX [IX_AssociationRequests_RequesterID] ON [dbo].[AssociationRequests]([RequesterID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ChatSessions_UserID')
    CREATE NONCLUSTERED INDEX [IX_ChatSessions_UserID] ON [dbo].[ChatSessions]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ChatMessage_ChatSessionID')
    CREATE NONCLUSTERED INDEX [IX_ChatMessage_ChatSessionID] ON [dbo].[ChatMessage]([ChatSessionID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsPosts_UserID')
    CREATE NONCLUSTERED INDEX [IX_NewsPosts_UserID] ON [dbo].[NewsPosts]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Media_NewsPostID')
    CREATE NONCLUSTERED INDEX [IX_Media_NewsPostID] ON [dbo].[Media]([NewsPostID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsComments_NewsPostID')
    CREATE NONCLUSTERED INDEX [IX_NewsComments_NewsPostID] ON [dbo].[NewsComments]([NewsPostID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsComments_UserID')
    CREATE NONCLUSTERED INDEX [IX_NewsComments_UserID] ON [dbo].[NewsComments]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsComments_ParentCommentID')
    CREATE NONCLUSTERED INDEX [IX_NewsComments_ParentCommentID] ON [dbo].[NewsComments]([ParentCommentID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsLikes_NewsPostID')
    CREATE NONCLUSTERED INDEX [IX_NewsLikes_NewsPostID] ON [dbo].[NewsLikes]([NewsPostID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_NewsLikes_UserID')
    CREATE NONCLUSTERED INDEX [IX_NewsLikes_UserID] ON [dbo].[NewsLikes]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Posts_UserID')
    CREATE NONCLUSTERED INDEX [IX_Posts_UserID] ON [dbo].[Posts]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Comments_PostID')
    CREATE NONCLUSTERED INDEX [IX_Comments_PostID] ON [dbo].[Comments]([PostID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Comments_UserID')
    CREATE NONCLUSTERED INDEX [IX_Comments_UserID] ON [dbo].[Comments]([UserID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Comments_ParentCommentID')
    CREATE NONCLUSTERED INDEX [IX_Comments_ParentCommentID] ON [dbo].[Comments]([ParentCommentID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PostLikes_PostID')
    CREATE NONCLUSTERED INDEX [IX_PostLikes_PostID] ON [dbo].[PostLikes]([PostID] ASC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PostLikes_UserID')
    CREATE NONCLUSTERED INDEX [IX_PostLikes_UserID] ON [dbo].[PostLikes]([UserID] ASC);
GO

-- =============================================
-- Seed Initial Data
-- =============================================

-- Insert User Roles
IF NOT EXISTS (SELECT * FROM [dbo].[UserRoles] WHERE [RoleName] = 'Patient')
    INSERT INTO [dbo].[UserRoles] ([RoleName]) VALUES ('Patient');
GO

IF NOT EXISTS (SELECT * FROM [dbo].[UserRoles] WHERE [RoleName] = 'Caregiver')
    INSERT INTO [dbo].[UserRoles] ([RoleName]) VALUES ('Caregiver');
GO

IF NOT EXISTS (SELECT * FROM [dbo].[UserRoles] WHERE [RoleName] = 'Doctor')
    INSERT INTO [dbo].[UserRoles] ([RoleName]) VALUES ('Doctor');
GO

IF NOT EXISTS (SELECT * FROM [dbo].[UserRoles] WHERE [RoleName] = 'Admin')
    INSERT INTO [dbo].[UserRoles] ([RoleName]) VALUES ('Admin');
GO

PRINT 'Database schema created successfully!';
PRINT 'Total tables created: 12';
PRINT 'User roles seeded: Patient, Caregiver, Doctor, Admin';
GO
