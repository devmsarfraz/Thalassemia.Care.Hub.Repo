-- =============================================
-- Migration: Add Conversation Memory Support
-- Description: Creates tables and columns for LLM conversation history
-- Date: 2025-12-30
-- =============================================

-- Step 1: Create ConversationHistory table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ConversationHistory')
BEGIN
    CREATE TABLE ConversationHistory (
        Id INT PRIMARY KEY IDENTITY(1,1),
        ConversationId UNIQUEIDENTIFIER NOT NULL,
        UserId INT NOT NULL,
        Role NVARCHAR(20) NOT NULL, -- 'user' or 'assistant'
        Message NVARCHAR(MAX) NOT NULL,
        Timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
        
        -- Foreign key to Users table (using UserId, not Id)
        CONSTRAINT FK_ConversationHistory_Users 
            FOREIGN KEY (UserId) REFERENCES Users(UserId)
            ON DELETE CASCADE
    );
    
    PRINT 'ConversationHistory table created successfully';
END
ELSE
BEGIN
    PRINT 'ConversationHistory table already exists';
END
GO

-- Step 2: Create indexes for performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_ConversationId')
BEGIN
    CREATE INDEX IX_ConversationHistory_ConversationId 
    ON ConversationHistory(ConversationId);
    
    PRINT 'Index IX_ConversationHistory_ConversationId created';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_UserId')
BEGIN
    CREATE INDEX IX_ConversationHistory_UserId 
    ON ConversationHistory(UserId);
    
    PRINT 'Index IX_ConversationHistory_UserId created';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_Timestamp')
BEGIN
    CREATE INDEX IX_ConversationHistory_Timestamp 
    ON ConversationHistory(Timestamp DESC);
    
    PRINT 'Index IX_ConversationHistory_Timestamp created';
END
GO

-- Step 3: Add ConversationId to ChatMessage table
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('ChatMessage') 
    AND name = 'ConversationId'
)
BEGIN
    ALTER TABLE ChatMessage
    ADD ConversationId UNIQUEIDENTIFIER NULL;
    
    PRINT 'ConversationId column added to ChatMessage table';
END
ELSE
BEGIN
    PRINT 'ConversationId column already exists in ChatMessage table';
END
GO

-- Step 4: Add UsedLLM flag to ChatMessage table
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('ChatMessage') 
    AND name = 'UsedLLM'
)
BEGIN
    ALTER TABLE ChatMessage
    ADD UsedLLM BIT NOT NULL DEFAULT 0;
    
    PRINT 'UsedLLM column added to ChatMessage table';
END
ELSE
BEGIN
    PRINT 'UsedLLM column already exists in ChatMessage table';
END
GO

-- Step 5: Create stored procedure to get conversation history
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetConversationHistory')
BEGIN
    DROP PROCEDURE GetConversationHistory;
END
GO

CREATE PROCEDURE GetConversationHistory
    @ConversationId UNIQUEIDENTIFIER,
    @Limit INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@Limit)
        Id,
        ConversationId,
        UserId,
        Role,
        Message,
        Timestamp
    FROM ConversationHistory
    WHERE ConversationId = @ConversationId
    ORDER BY Timestamp DESC;
END
GO

PRINT 'Stored procedure GetConversationHistory created';
GO

-- Step 6: Create stored procedure to clean old conversations
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'CleanOldConversations')
BEGIN
    DROP PROCEDURE CleanOldConversations;
END
GO

CREATE PROCEDURE CleanOldConversations
    @DaysToKeep INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CutoffDate DATETIME2 = DATEADD(DAY, -@DaysToKeep, GETDATE());
    
    DELETE FROM ConversationHistory
    WHERE Timestamp < @CutoffDate;
    
    PRINT 'Deleted ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' old conversation records';
END
GO

PRINT 'Stored procedure CleanOldConversations created';
GO

-- Step 7: Verify all changes
PRINT '';
PRINT '==============================================';
PRINT 'Migration Summary:';
PRINT '==============================================';

-- Check ConversationHistory table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'ConversationHistory')
    PRINT '✓ ConversationHistory table exists';
ELSE
    PRINT '✗ ConversationHistory table MISSING';

-- Check ChatMessage columns
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ChatMessage') AND name = 'ConversationId')
    PRINT '✓ ChatMessage.ConversationId column exists';
ELSE
    PRINT '✗ ChatMessage.ConversationId column MISSING';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('ChatMessage') AND name = 'UsedLLM')
    PRINT '✓ ChatMessage.UsedLLM column exists';
ELSE
    PRINT '✗ ChatMessage.UsedLLM column MISSING';

-- Check indexes
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_ConversationId')
    PRINT '✓ Index IX_ConversationHistory_ConversationId exists';

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_UserId')
    PRINT '✓ Index IX_ConversationHistory_UserId exists';

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ConversationHistory_Timestamp')
    PRINT '✓ Index IX_ConversationHistory_Timestamp exists';

-- Check stored procedures
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetConversationHistory')
    PRINT '✓ Stored procedure GetConversationHistory exists';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'CleanOldConversations')
    PRINT '✓ Stored procedure CleanOldConversations exists';

PRINT '==============================================';
PRINT 'Migration completed successfully!';
PRINT '==============================================';
GO
