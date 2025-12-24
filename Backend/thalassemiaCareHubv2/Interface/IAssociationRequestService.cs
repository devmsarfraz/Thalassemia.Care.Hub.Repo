using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Interface
{
    public interface IAssociationRequestService
    {
        Task<AssociationRequestResultDTO> CreateRequestAsync(CreateAssociationRequestDTO request);
        Task<List<AssociationRequestResponseDTO>> GetPendingRequestsForUserAsync(int userId);
        Task<List<AssociationRequestResponseDTO>> GetSentRequestsByUserAsync(int userId);
        Task<AssociationRequestActionResponseDTO> AcceptRequestAsync(int requestId, int userId);
        Task<AssociationRequestActionResponseDTO> RejectRequestAsync(int requestId, int userId);
    }
}

