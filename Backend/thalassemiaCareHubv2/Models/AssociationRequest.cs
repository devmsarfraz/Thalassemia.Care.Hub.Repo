using System;

namespace thalassemiaCareHubv2.Models
{
    public partial class AssociationRequest
    {
        public int RequestId { get; set; }
        
        public int RequesterId { get; set; } // User who initiated the request (caregiver/doctor)
        
        public int RequestedUserId { get; set; } // User who needs to accept (patient)
        
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected
        
        public DateTime RequestDate { get; set; }
        
        public DateTime? ResponseDate { get; set; }
        
        public bool IsDelete { get; set; }
        
        // Navigation properties
        public virtual User Requester { get; set; } = null!;
        
        public virtual User RequestedUser { get; set; } = null!;
    }
}

