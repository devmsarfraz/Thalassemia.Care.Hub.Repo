-- Create Database
CREATE DATABASE thalassemia_care_hub_v2;
GO

USE thalassemia_care_hub_v2;
GO

-- Create UserRoles Table
CREATE TABLE [UserRoles] (
    [RoleID] int IDENTITY(1,1) NOT NULL,
    [RoleName] nvarchar(200) NOT NULL,
    CONSTRAINT [PK__UserRole__8AFACE3A04C894E6] PRIMARY KEY ([RoleID])
);
GO

-- Insert Default Roles
SET IDENTITY_INSERT [UserRoles] ON;
INSERT INTO [UserRoles] ([RoleID], [RoleName]) VALUES (1, 'Patient');
INSERT INTO [UserRoles] ([RoleID], [RoleName]) VALUES (2, 'Caregiver');
INSERT INTO [UserRoles] ([RoleID], [RoleName]) VALUES (3, 'Admin');
INSERT INTO [UserRoles] ([RoleID], [RoleName]) VALUES (4, 'Doctor');
SET IDENTITY_INSERT [UserRoles] OFF;
GO

-- Create Users Table
CREATE TABLE [Users] (
    [UserID] int IDENTITY(1,1) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [RegistrationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [AssociatedUserID] int NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    [RoleID] int NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [PhoneNumber] nvarchar(15) NULL,
    [Address] nvarchar(255) NULL,
    [BloodGroup] nvarchar(10) NULL,
    [Gender] nvarchar(10) NULL,
    [GuardianName] nvarchar(100) NULL,
    [GuardianNumber] nvarchar(15) NULL,
    [Reset Code] int NULL,
    [Verified] bit DEFAULT 0 NULL,
    [ProfilePicture] nvarchar(max) NULL,
    CONSTRAINT [PK__Users__1788CCAC94241BB4] PRIMARY KEY ([UserID]),
    CONSTRAINT [FK_Users_AssociatedUser] FOREIGN KEY ([AssociatedUserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_Users_UserRoles] FOREIGN KEY ([RoleID]) REFERENCES [UserRoles] ([RoleID])
);
GO

-- Create AssociationRequests Table
CREATE TABLE [AssociationRequests] (
    [RequestID] int IDENTITY(1,1) NOT NULL,
    [RequesterID] int NOT NULL,
    [RequestedUserID] int NOT NULL,
    [Status] nvarchar(20) DEFAULT ('Pending') NOT NULL,
    [RequestDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [ResponseDate] datetime2 NULL,
    [IsDelete] bit DEFAULT 0 NOT NULL,
    CONSTRAINT [PK__AssociationRequests__RequestID] PRIMARY KEY ([RequestID]),
    CONSTRAINT [FK_AssociationRequests_RequestedUser] FOREIGN KEY ([RequestedUserID]) REFERENCES [Users] ([UserID]),
    CONSTRAINT [FK_AssociationRequests_Requester] FOREIGN KEY ([RequesterID]) REFERENCES [Users] ([UserID])
);
GO

-- Create ChatSessions Table
CREATE TABLE [ChatSessions] (
    [ChatSessionID] int IDENTITY(1,1) NOT NULL,
    [UserID] int NOT NULL,
    [SessionTitle] nvarchar(200) NOT NULL,
    [CreationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK__9AB8242F7DDAFC0E] PRIMARY KEY ([ChatSessionID]),
    CONSTRAINT [FK_ChatSessions_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID])
);
GO

-- Create ChatMessage Table
CREATE TABLE [ChatMessage] (
    [MessageID] int IDENTITY(1,1) NOT NULL,
    [ChatSessionID] int NOT NULL,
    [SenderType] nvarchar(20) NOT NULL,
    [MessageContent] nvarchar(max) NOT NULL,
    [Timestamp] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [AIProvider] nvarchar(max) NULL,
    CONSTRAINT [PK__C87C037CC80B022A] PRIMARY KEY ([MessageID]),
    CONSTRAINT [FK_ChatMessage_ChatSessions] FOREIGN KEY ([ChatSessionID]) REFERENCES [ChatSessions] ([ChatSessionID])
);
GO

-- Create Posts Table
CREATE TABLE [Posts] (
    [PostID] int IDENTITY(1,1) NOT NULL,
    [UserID] int NOT NULL,
    [PostTitle] nvarchar(200) NOT NULL,
    [PostContent] nvarchar(max) NOT NULL,
    [MediaUrl] nvarchar(500) NULL,
    [Category] nvarchar(max) NULL,
    [CreationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [LastEditedDate] datetime2 NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK__Posts__AA126038E546A291] PRIMARY KEY ([PostID]),
    CONSTRAINT [FK_Posts_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID])
);
GO

-- Create PostLikes Table
CREATE TABLE [PostLikes] (
    [LikeID] int IDENTITY(1,1) NOT NULL,
    [PostID] int NOT NULL,
    [UserID] int NOT NULL,
    [LikeDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    CONSTRAINT [PK_PostLikes] PRIMARY KEY ([LikeID]),
    CONSTRAINT [FK_PostLikes_Posts] FOREIGN KEY ([PostID]) REFERENCES [Posts] ([PostID]),
    CONSTRAINT [FK_PostLikes_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID])
);
GO

-- Create Comments Table
CREATE TABLE [Comments] (
    [CommentID] int IDENTITY(1,1) NOT NULL,
    [PostID] int NOT NULL,
    [UserID] int NOT NULL,
    [CommentContent] nvarchar(max) NOT NULL,
    [CreationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [LastEditedDate] datetime2 NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    [ParentCommentID] int NULL,
    CONSTRAINT [PK__Comments__C3B4DFAA36EC494A] PRIMARY KEY ([CommentID]),
    CONSTRAINT [FK_Comments_ParentComment] FOREIGN KEY ([ParentCommentID]) REFERENCES [Comments] ([CommentID]),
    CONSTRAINT [FK_Comments_Posts] FOREIGN KEY ([PostID]) REFERENCES [Posts] ([PostID]),
    CONSTRAINT [FK_Comments_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID])
);
GO

-- Create NewsPosts Table
CREATE TABLE [NewsPosts] (
    [NewsPostID] int IDENTITY(1,1) NOT NULL,
    [UserID] int NOT NULL,
    [PostTitle] nvarchar(200) NOT NULL,
    [PostContent] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NULL,
    [PublicationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [Reference] nvarchar(500) NULL,
    [MediaUrl] nvarchar(500) NULL,
    [LastEditedDate] datetime2 NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK__NewsPost__C9F1533E44A79F7C] PRIMARY KEY ([NewsPostID]),
    CONSTRAINT [FK_NewsPosts_Users] FOREIGN KEY ([UserID]) REFERENCES [Users] ([UserID])
);
GO

-- Create Media Table
CREATE TABLE [Media] (
    [MediaID] int IDENTITY(1,1) NOT NULL,
    [NewsPostID] int NOT NULL,
    [MediaUrl] nvarchar(500) NOT NULL,
    [MediaType] nvarchar(50) NOT NULL,
    [CreatedDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [IsDelete] bit NOT NULL DEFAULT 0,
    CONSTRAINT [PK__Media____MediaId] PRIMARY KEY ([MediaID]),
    CONSTRAINT [FK_Media_NewsPosts] FOREIGN KEY ([NewsPostID]) REFERENCES [NewsPosts] ([NewsPostID])
);
GO

-- Create NewsComments Table
CREATE TABLE [NewsComments] (
    [CommentId] int IDENTITY(1,1) NOT NULL,
    [NewsPostId] int NOT NULL,
    [UserId] int NOT NULL,
    [CommentContent] nvarchar(max) NOT NULL,
    [CreationDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    [IsDelete] bit DEFAULT 0 NOT NULL,
    [ParentCommentId] int NULL,
    CONSTRAINT [PK_NewsComments] PRIMARY KEY ([CommentId]),
    CONSTRAINT [FK_NewsComments_NewsPosts] FOREIGN KEY ([NewsPostId]) REFERENCES [NewsPosts] ([NewsPostID]) ON DELETE CASCADE,
    CONSTRAINT [FK_NewsComments_ParentComment] FOREIGN KEY ([ParentCommentId]) REFERENCES [NewsComments] ([CommentId]),
    CONSTRAINT [FK_NewsComments_Users] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserID])
);
GO

-- Create NewsLikes Table
CREATE TABLE [NewsLikes] (
    [LikeId] int IDENTITY(1,1) NOT NULL,
    [NewsPostId] int NOT NULL,
    [UserId] int NOT NULL,
    [LikeDate] datetime2 DEFAULT (sysutcdatetime()) NOT NULL,
    CONSTRAINT [PK_NewsLikes] PRIMARY KEY ([LikeId]),
    CONSTRAINT [FK_NewsLikes_NewsPosts] FOREIGN KEY ([NewsPostId]) REFERENCES [NewsPosts] ([NewsPostID]) ON DELETE CASCADE,
    CONSTRAINT [FK_NewsLikes_Users] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserID])
);
GO

-- Create Indexes for performance
CREATE INDEX [IX_Media_NewsPostID] ON [Media] ([NewsPostID]);
CREATE INDEX [IX_Comments_PostID] ON [Comments] ([PostID]);
CREATE INDEX [IX_Comments_UserID] ON [Comments] ([UserID]);
CREATE INDEX [IX_NewsComments_NewsPostId] ON [NewsComments] ([NewsPostId]);
CREATE INDEX [IX_Posts_UserID] ON [Posts] ([UserID]);
GO
