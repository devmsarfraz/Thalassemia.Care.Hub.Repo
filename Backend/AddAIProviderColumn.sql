-- Migration: Add AIProvider column to ChatMessage table
-- This column tracks which AI service (Gemini, ChatterBot, etc.) generated each response

USE thalassemia_care_hub_v2;
GO

-- Check if column already exists
IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[ChatMessage]') 
    AND name = 'AIProvider'
)
BEGIN
    -- Add AIProvider column
    ALTER TABLE [dbo].[ChatMessage]
    ADD [AIProvider] NVARCHAR(50) NULL;
    
    PRINT 'AIProvider column added successfully to ChatMessage table';
END
ELSE
BEGIN
    PRINT 'AIProvider column already exists in ChatMessage table';
END
GO

-- Optional: Update existing records to have a default value
UPDATE [dbo].[ChatMessage]
SET [AIProvider] = 'Gemini'
WHERE [AIProvider] IS NULL AND [SenderType] = 'AI';
GO

PRINT 'Migration completed successfully!';
GO
