-- Create AssociationRequests table for pending association requests
-- Run this script in your SQL Server database

USE thalassemia_care_hub_v2;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AssociationRequests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AssociationRequests] (
        [RequestID] INT IDENTITY(1,1) PRIMARY KEY,
        [RequesterID] INT NOT NULL,
        [RequestedUserID] INT NOT NULL,
        [Status] NVARCHAR(20) DEFAULT 'Pending',
        [RequestDate] DATETIME2 DEFAULT GETUTCDATE(),
        [ResponseDate] DATETIME2 NULL,
        [IsDelete] BIT DEFAULT 0,
        
        CONSTRAINT [FK_AssociationRequests_Requester] 
            FOREIGN KEY ([RequesterID]) 
            REFERENCES [Users]([UserID])
            ON DELETE NO ACTION,
            
        CONSTRAINT [FK_AssociationRequests_RequestedUser] 
            FOREIGN KEY ([RequestedUserID]) 
            REFERENCES [Users]([UserID])
            ON DELETE NO ACTION
    );
    
    -- Create indexes for better query performance
    CREATE INDEX [IX_AssociationRequests_RequesterID] 
        ON [AssociationRequests]([RequesterID]);
        
    CREATE INDEX [IX_AssociationRequests_RequestedUserID] 
        ON [AssociationRequests]([RequestedUserID]);
        
    CREATE INDEX [IX_AssociationRequests_Status] 
        ON [AssociationRequests]([Status]);
    
    PRINT 'AssociationRequests table created successfully.';
END
ELSE
BEGIN
    PRINT 'AssociationRequests table already exists.';
END
GO

