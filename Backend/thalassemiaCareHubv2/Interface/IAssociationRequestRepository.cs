using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Interface
{
    public interface IAssociationRequestRepository
    {
        Task<AssociationRequest?> CreateRequestAsync(int requesterId, int requestedUserId);
        Task<AssociationRequest?> GetRequestByIdAsync(int requestId);
        Task<AssociationRequest?> GetPendingRequestAsync(int requesterId, int requestedUserId);
        Task<List<AssociationRequest>> GetPendingRequestsForUserAsync(int userId);
        Task<List<AssociationRequest>> GetSentRequestsByUserAsync(int userId);
        Task<AssociationRequest?> UpdateRequestStatusAsync(int requestId, string status);
        Task<bool> HasPendingRequestAsync(int requesterId, int requestedUserId);
    }
}

