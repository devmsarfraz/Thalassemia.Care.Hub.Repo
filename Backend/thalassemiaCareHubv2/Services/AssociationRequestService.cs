using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    public class AssociationRequestService : IAssociationRequestService
    {
        private readonly IAssociationRequestRepository _requestRepository;
        private readonly IUserRepository _userRepository;

        public AssociationRequestService(
            IAssociationRequestRepository requestRepository,
            IUserRepository userRepository)
        {
            _requestRepository = requestRepository;
            _userRepository = userRepository;
        }

        public async Task<AssociationRequestResultDTO> CreateRequestAsync(CreateAssociationRequestDTO request)
        {
            try
            {
                // Validate that requester and requested user are different
                if (request.RequesterId == request.RequestedUserId)
                {
                    return new AssociationRequestResultDTO
                    {
                        Success = false,
                        Message = "Cannot create association request to yourself."
                    };
                }

                // Check if request already exists
                var existingRequest = await _requestRepository.GetPendingRequestAsync(
                    request.RequesterId, 
                    request.RequestedUserId);
                
                if (existingRequest != null)
                {
                    return new AssociationRequestResultDTO
                    {
                        Success = false,
                        Message = "A pending association request already exists."
                    };
                }

                // Create the request
                var associationRequest = await _requestRepository.CreateRequestAsync(
                    request.RequesterId, 
                    request.RequestedUserId);

                if (associationRequest == null)
                {
                    return new AssociationRequestResultDTO
                    {
                        Success = false,
                        Message = "Failed to create association request."
                    };
                }

                return new AssociationRequestResultDTO
                {
                    Success = true,
                    Message = "Association request created successfully.",
                    Request = MapToResponseDTO(associationRequest)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AssociationRequestService.CreateRequestAsync: {ex.Message}");
                return new AssociationRequestResultDTO
                {
                    Success = false,
                    Message = "An error occurred while creating the association request."
                };
            }
        }

        public async Task<List<AssociationRequestResponseDTO>> GetPendingRequestsForUserAsync(int userId)
        {
            var requests = await _requestRepository.GetPendingRequestsForUserAsync(userId);
            return requests.Select(MapToResponseDTO).ToList();
        }

        public async Task<List<AssociationRequestResponseDTO>> GetSentRequestsByUserAsync(int userId)
        {
            var requests = await _requestRepository.GetSentRequestsByUserAsync(userId);
            return requests.Select(MapToResponseDTO).ToList();
        }

        public async Task<AssociationRequestActionResponseDTO> AcceptRequestAsync(int requestId, int userId)
        {
            try
            {
                var request = await _requestRepository.GetRequestByIdAsync(requestId);
                
                if (request == null)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "Association request not found."
                    };
                }

                // Verify that the user accepting is the requested user
                if (request.RequestedUserId != userId)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "You are not authorized to accept this request."
                    };
                }

                // Check if request is still pending
                if (request.Status != "Pending")
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = $"This request has already been {request.Status.ToLower()}."
                    };
                }

                // Update request status
                var updatedRequest = await _requestRepository.UpdateRequestStatusAsync(requestId, "Accepted");
                
                if (updatedRequest == null)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "Failed to update association request."
                    };
                }

                // Create the actual association
                var (caregiver, patient) = await _userRepository.AssociateUser(
                    request.RequesterId, 
                    request.RequestedUserId);

                if (caregiver == null || patient == null)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "Failed to create association after accepting request."
                    };
                }

                var caregiverProfile = new UserProfileResponse
                {
                    UserId = caregiver.UserId,
                    Email = caregiver.Email,
                    FirstName = caregiver.FirstName,
                    LastName = caregiver.LastName,
                    PhoneNumber = caregiver.PhoneNumber,
                    Address = caregiver.Address,
                    BloodGroup = caregiver.BloodGroup,
                    Gender = caregiver.Gender,
                    GuardianName = caregiver.GuardianName,
                    GuardianNumber = caregiver.GuardianNumber,
                    Role = caregiver.Role?.RoleName ?? "Unknown"
                };

                var patientProfile = new UserProfileResponse
                {
                    UserId = patient.UserId,
                    Email = patient.Email,
                    FirstName = patient.FirstName,
                    LastName = patient.LastName,
                    PhoneNumber = patient.PhoneNumber,
                    Address = patient.Address,
                    BloodGroup = patient.BloodGroup,
                    Gender = patient.Gender,
                    GuardianName = patient.GuardianName,
                    GuardianNumber = patient.GuardianNumber,
                    Role = patient.Role?.RoleName ?? "Unknown"
                };

                return new AssociationRequestActionResponseDTO
                {
                    Success = true,
                    Message = "Association request accepted and association created successfully.",
                    Request = MapToResponseDTO(updatedRequest),
                    Caregiver = caregiverProfile,
                    Patient = patientProfile
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AssociationRequestService.AcceptRequestAsync: {ex.Message}");
                return new AssociationRequestActionResponseDTO
                {
                    Success = false,
                    Message = "An error occurred while accepting the association request."
                };
            }
        }

        public async Task<AssociationRequestActionResponseDTO> RejectRequestAsync(int requestId, int userId)
        {
            try
            {
                var request = await _requestRepository.GetRequestByIdAsync(requestId);
                
                if (request == null)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "Association request not found."
                    };
                }

                // Verify that the user rejecting is the requested user
                if (request.RequestedUserId != userId)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "You are not authorized to reject this request."
                    };
                }

                // Check if request is still pending
                if (request.Status != "Pending")
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = $"This request has already been {request.Status.ToLower()}."
                    };
                }

                // Update request status
                var updatedRequest = await _requestRepository.UpdateRequestStatusAsync(requestId, "Rejected");
                
                if (updatedRequest == null)
                {
                    return new AssociationRequestActionResponseDTO
                    {
                        Success = false,
                        Message = "Failed to update association request."
                    };
                }

                return new AssociationRequestActionResponseDTO
                {
                    Success = true,
                    Message = "Association request rejected successfully.",
                    Request = MapToResponseDTO(updatedRequest)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AssociationRequestService.RejectRequestAsync: {ex.Message}");
                return new AssociationRequestActionResponseDTO
                {
                    Success = false,
                    Message = "An error occurred while rejecting the association request."
                };
            }
        }

        private AssociationRequestResponseDTO MapToResponseDTO(Models.AssociationRequest request)
        {
            return new AssociationRequestResponseDTO
            {
                RequestId = request.RequestId,
                RequesterId = request.RequesterId,
                RequesterName = $"{request.Requester?.FirstName} {request.Requester?.LastName}",
                RequesterEmail = request.Requester?.Email ?? "",
                RequestedUserId = request.RequestedUserId,
                RequestedUserName = $"{request.RequestedUser?.FirstName} {request.RequestedUser?.LastName}",
                RequestedUserEmail = request.RequestedUser?.Email ?? "",
                Status = request.Status,
                RequestDate = request.RequestDate,
                ResponseDate = request.ResponseDate
            };
        }
    }
}

