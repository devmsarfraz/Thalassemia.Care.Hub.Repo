namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for creating an association request
    /// </summary>
    public class CreateAssociationRequestDTO
    {
        /// <summary>
        /// ID of the requester (caregiver/doctor who wants to associate)
        /// </summary>
        public int RequesterId { get; set; }
        
        /// <summary>
        /// ID of the requested user (patient who needs to accept)
        /// </summary>
        public int RequestedUserId { get; set; }
    }

    /// <summary>
    /// Response model for association request operations
    /// </summary>
    public class AssociationRequestResponseDTO
    {
        public int RequestId { get; set; }
        public int RequesterId { get; set; }
        public string RequesterName { get; set; } = string.Empty;
        public string RequesterEmail { get; set; } = string.Empty;
        public int RequestedUserId { get; set; }
        public string RequestedUserName { get; set; } = string.Empty;
        public string RequestedUserEmail { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime RequestDate { get; set; }
        public DateTime? ResponseDate { get; set; }
    }

    /// <summary>
    /// Response wrapper for association request operations
    /// </summary>
    public class AssociationRequestResultDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AssociationRequestResponseDTO? Request { get; set; }
    }

    /// <summary>
    /// Response for accepting/rejecting association request
    /// </summary>
    public class AssociationRequestActionResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AssociationRequestResponseDTO? Request { get; set; }
        public UserProfileResponse? Caregiver { get; set; }
        public UserProfileResponse? Patient { get; set; }
    }
}

