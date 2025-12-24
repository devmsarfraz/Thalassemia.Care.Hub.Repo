using Microsoft.EntityFrameworkCore;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;

namespace thalassemiaCareHubv2.Repository
{
    public class AssociationRequestRepository : IAssociationRequestRepository
    {
        private readonly AppDbContext _context;

        public AssociationRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AssociationRequest?> CreateRequestAsync(int requesterId, int requestedUserId)
        {
            try
            {
                // Check if a pending request already exists
                var existingRequest = await GetPendingRequestAsync(requesterId, requestedUserId);
                if (existingRequest != null)
                {
                    return null; // Request already exists
                }

                var request = new AssociationRequest
                {
                    RequesterId = requesterId,
                    RequestedUserId = requestedUserId,
                    Status = "Pending",
                    RequestDate = DateTime.UtcNow,
                    IsDelete = false
                };

                _context.AssociationRequests.Add(request);
                await _context.SaveChangesAsync();

                return await GetRequestByIdAsync(request.RequestId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating association request: {ex.Message}");
                return null;
            }
        }

        public async Task<AssociationRequest?> GetRequestByIdAsync(int requestId)
        {
            return await _context.AssociationRequests
                .Include(r => r.Requester)
                .Include(r => r.RequestedUser)
                .FirstOrDefaultAsync(r => r.RequestId == requestId && !r.IsDelete);
        }

        public async Task<AssociationRequest?> GetPendingRequestAsync(int requesterId, int requestedUserId)
        {
            return await _context.AssociationRequests
                .Include(r => r.Requester)
                .Include(r => r.RequestedUser)
                .FirstOrDefaultAsync(r => 
                    r.RequesterId == requesterId && 
                    r.RequestedUserId == requestedUserId && 
                    r.Status == "Pending" && 
                    !r.IsDelete);
        }

        public async Task<List<AssociationRequest>> GetPendingRequestsForUserAsync(int userId)
        {
            return await _context.AssociationRequests
                .Include(r => r.Requester)
                    .ThenInclude(u => u.Role)
                .Include(r => r.RequestedUser)
                    .ThenInclude(u => u.Role)
                .Where(r => r.RequestedUserId == userId && r.Status == "Pending" && !r.IsDelete)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }

        public async Task<List<AssociationRequest>> GetSentRequestsByUserAsync(int userId)
        {
            return await _context.AssociationRequests
                .Include(r => r.Requester)
                    .ThenInclude(u => u.Role)
                .Include(r => r.RequestedUser)
                    .ThenInclude(u => u.Role)
                .Where(r => r.RequesterId == userId && r.Status == "Pending" && !r.IsDelete)
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
        }

        public async Task<AssociationRequest?> UpdateRequestStatusAsync(int requestId, string status)
        {
            try
            {
                var request = await _context.AssociationRequests
                    .FirstOrDefaultAsync(r => r.RequestId == requestId && !r.IsDelete);

                if (request == null)
                    return null;

                request.Status = status;
                request.ResponseDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return await GetRequestByIdAsync(requestId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating association request status: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> HasPendingRequestAsync(int requesterId, int requestedUserId)
        {
            return await _context.AssociationRequests
                .AnyAsync(r => 
                    r.RequesterId == requesterId && 
                    r.RequestedUserId == requestedUserId && 
                    r.Status == "Pending" && 
                    !r.IsDelete);
        }
    }
}

