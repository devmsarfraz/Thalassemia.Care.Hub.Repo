using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace thalassemiaCareHubv2.Middleware
{
    public class JwtBlacklistMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;

        public JwtBlacklistMiddleware(RequestDelegate next, IMemoryCache cache)
        {
            _next = next;
            _cache = cache;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                // Console.WriteLine($"[Middleware Debug] Checking token: {token.Substring(0, Math.Min(10, token.Length))}...");
                if (_cache.TryGetValue($"blacklist_{token}", out _))
                {
                    Console.WriteLine($"[Middleware Debug] REJECTED blacklisted token.");
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.WriteAsync("Token has been revoked/blacklisted.");
                    return;
                }
            }

            await _next(context);
        }
    }
}
