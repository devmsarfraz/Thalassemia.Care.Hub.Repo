namespace thalassemiaCareHubv2.DTOs
{
    /// <summary>
    /// Request model for creating caregiver-patient association
    /// </summary>
    public class AssociateUserRequest
    {
        /// <summary>
        /// ID of the caregiver (user who will be associated with the patient)
        /// </summary>
        /// <example>2</example>
        public int CaregiverId { get; set; }
        
        /// <summary>
        /// ID of the patient (user who will be cared for)
        /// </summary>
        /// <example>1</example>
        public int PatientId { get; set; }
    }

    /// <summary>
    /// Response model for caregiver-patient association operation
    /// </summary>
    public class AssociateUserResponse
    {
        /// <summary>
        /// Indicates whether the association was successful
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// Message describing the result of the association operation
        /// </summary>
        public string Message { get; set; } = string.Empty;
        
        /// <summary>
        /// Association details showing which caregiver is associated with which patient
        /// </summary>
        public string AssociationDetails { get; set; } = string.Empty;
        
        /// <summary>
        /// Updated caregiver information
        /// </summary>
        public UserProfileResponse? Caregiver { get; set; }
        
        /// <summary>
        /// Updated patient information
        /// </summary>
        public UserProfileResponse? Patient { get; set; }
    }
}
