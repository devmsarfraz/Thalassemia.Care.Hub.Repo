
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
using System.IdentityModel.Tokens.Jwt;
using thalassemiaCareHubv2.DTOs;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Services;

namespace thalassemiaCareHubv2.Controllers
{
    /// <summary>
    /// Controller for handling user authentication operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMemoryCache _cache;
        
        /// <summary>
        /// Initializes a new instance of the AuthController
        /// </summary>
        /// <param name="authService">The authentication service</param>
        /// <param name="cache">Memory cache for blacklisting tokens</param>
        public AuthController(IAuthService authService, IMemoryCache cache)
        {
            _authService = authService;
            _cache = cache;
        }

        /// <summary>
        /// Register a new user account
        /// </summary>
        /// <param name="request">User registration details</param>
        /// <returns>Success message if registration is successful</returns>
        /// <response code="200">Registration successful</response>
        /// <response code="400">Registration failed due to validation errors or existing email</response>
        [HttpPost("signup")]
        [EnableRateLimiting("LoginPolicy")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> Signup([FromBody] Signup request)
        {
            try
            {
                var result = await _authService.Signup(
                    request.Email,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    request.PhoneNumber,
                    request.Address,
                    request.BloodGroup,
                    request.RoleID
                    );

                if (!result.Success)
                    return BadRequest(new { message = result.Message });

                return Ok(new { message = "Signup Successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Authenticate user and login
        /// </summary>
        /// <param name="request">User login credentials</param>
        /// <returns>Login result with JWT token and user information</returns>
        /// <response code="200">Login successful</response>
        /// <response code="401">Invalid credentials</response>
        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<ActionResult> Login([FromBody] Login request)
        {
            var result = await _authService.Login(request.Email, request.Password);

            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(result);
        }

        /// <summary>
        /// Update user password
        /// </summary>
        /// <param name="request">Password update details including current and new password</param>
        /// <returns>Success message if password update is successful</returns>
        /// <response code="200">Password updated successfully</response>
        /// <response code="400">Current password is incorrect or email not found</response>
        [HttpPost("update-password")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> UpdatePassword([FromBody] UpdatePassword request)
        {
            var result = await _authService.UpdatePassword(request.Email, request.CurrentPassword, request.NewPassword);

            if (result)
                return Ok(new { message = "Password updated successfully." });

            return BadRequest(new { message = "Incorrect old password. Please try again." });
        }

        /// <summary>
        /// Logout user (client-side token invalidation)
        /// </summary>
        /// <returns>Success message</returns>
        /// <response code="200">Logout successful</response>


        // ... Signup and Login methods ...

        // Skip to Logout method replacement
        /// <summary>
        /// Logout user (invalidates token via blacklist)
        /// </summary>
        /// <returns>Success message</returns>
        /// <response code="200">Logout successful</response>
        /// <response code="401">Unauthorized</response>
        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(typeof(object), 200)]
        public ActionResult Logout()
        {
            // Extract token from header
            var header = Request.Headers["Authorization"].FirstOrDefault();
            Console.WriteLine($"[Logout Debug] Authorization Header: {header}");

            var token = header?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token))
            {
                // Decode token to find expiration
                var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                
                if (jwtToken != null)
                {
                    var expirationDate = jwtToken.ValidTo;
                    var timeRemaining = expirationDate - DateTime.UtcNow;

                    Console.WriteLine($"[Logout Debug] Token Expiry: {expirationDate}, TimeRemaining: {timeRemaining}");

                    if (timeRemaining > TimeSpan.Zero)
                    {
                        // Add to blacklist with expiration
                        var key = $"blacklist_{token}";
                        _cache.Set(key, "revoked", timeRemaining);
                        Console.WriteLine($"[Logout Debug] Token blacklisted with key: {key}");
                        
                        // Verify immediate addition
                        if (_cache.TryGetValue(key, out _))
                        {
                            Console.WriteLine("[Logout Debug] VERIFIED: Token is present in cache immediately.");
                        }
                    }
                }
            }
            else 
            {
                Console.WriteLine("[Logout Debug] No token found in header.");
            }

            return Ok(new { message = "Logout successful. Token invalidated." });
        }

        /// <summary>
        /// Verify user email with verification code
        /// </summary>
        /// <param name="request">Email verification details including email and code</param>
        /// <returns>Verification result</returns>
        /// <response code="200">Email verified successfully</response>
        /// <response code="400">Verification failed due to invalid code or other errors</response>
        [HttpPost("verify-email")]
        [ProducesResponseType(typeof(VerifyEmailResult), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                Console.WriteLine("---------------------------------");
                var result = await _authService.VerifyEmail(request.Email, request.Code);

                if (result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error verifying email: {ex.Message}" });
            }
        }

        /// <summary>
        /// Resend email verification code
        /// </summary>
        /// <param name="request">Request containing email</param>
        /// <returns>Result of resend operation</returns>
        [HttpPost("resend-verification-email")]
        [ProducesResponseType(typeof(VerifyEmailResult), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> ResendVerificationEmail([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { message = "Email is required." });
                }

                var result = await _authService.ResendVerificationEmail(request.Email);

                if (result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error resending verification email: {ex.Message}" });
            }
        }
        /// <summary>
        /// Request a password reset code
        /// </summary>
        /// <param name="request">Request containing email</param>
        /// <returns>Success message if email exists</returns>
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email is required." });

            var result = await _authService.ForgotPassword(request.Email);

            if (result)
                return Ok(new { message = "If your email is registered, you will receive a password reset code shortly." });

            // Even if user not found, we might want to return same message for security, 
            // but based on AuthService implementation returning false if user not found:
            return BadRequest(new { message = "User with this email does not exist." });
        }

        /// <summary>
        /// Verify the password reset code
        /// </summary>
        /// <param name="request">Request containing email and code</param>
        /// <returns>Success message if code is valid</returns>
        [HttpPost("verify-reset-code")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> VerifyResetCode([FromBody] VerifyResetCodeRequest request)
        {
            var result = await _authService.VerifyResetCode(request.Email, request.Code);

            if (result)
                return Ok(new { message = "Code verified successfully." });

            return BadRequest(new { message = "Invalid or expired code." });
        }

        /// <summary>
        /// Reset password with new password
        /// </summary>
        /// <param name="request">Request containing email and new password</param>
        /// <returns>Success message</returns>
        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(object), 400)]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPassword(request.Email, request.NewPassword);

            if (result)
                return Ok(new { message = "Password has been reset successfully. You can now login with your new password." });

            return BadRequest(new { message = "Failed to reset password." });
        }
    }
}
