
using Microsoft.AspNetCore.Mvc;
using thalassemiaCareHubv2.Interface;
using thalassemiaCareHubv2.Models;
using thalassemiaCareHubv2.Repository;
using thalassemiaCareHubv2.DTOs;

namespace thalassemiaCareHubv2.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;
        private readonly IEmailService _emailService;

        public AuthService(IAuthRepository authRepository, IPasswordService passwordService, IJwtService jwtService, IEmailService emailService)
        {
            _authRepository = authRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
            _emailService = emailService;
        }

        public async Task<SignupResult> Signup(string email, string password, string firstName, string lastName, string? phoneNumber, string? address, string? bloodGroup, int roleID)
        {
            var normalizedEmail = email?.Trim().ToLowerInvariant() ?? "";
            if (string.IsNullOrWhiteSpace(normalizedEmail))
            {
                return new SignupResult
                {
                    Success = false,
                    Message = "Email is required."
                };
            }

            bool exists = await _authRepository.UserExists(normalizedEmail);

            if (!exists) {

                // Hash the password before storing
                var hashedPassword = _passwordService.HashPassword(password);

                // Generate 6-digit verification code
                var random = new Random();
                int verificationCode = random.Next(100000, 999999); // Generates a 6-digit code

                var user = new User
                {
                    Email = normalizedEmail,
                    Password = hashedPassword, // Store hashed password instead of plain text
                    FirstName = firstName,
                    LastName = lastName,
                    PhoneNumber = phoneNumber,
                    Address = address,
                    BloodGroup = bloodGroup,
                    RoleId = roleID,
                    ResetCode = verificationCode, // Store verification code
                    Verified = false // Set to false until email is verified
                };

                var response = await _authRepository.CreateUser(user);
                
                // Send verification email
                try
                {
                    bool emailSent = await _emailService.SendVerificationEmailAsync(normalizedEmail, firstName, verificationCode);
                    if (!emailSent)
                    {
                        Console.WriteLine($"Warning: Failed to send verification email to {email}, but user was created successfully.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending verification email to {email}: {ex.Message}");
                    // Don't fail signup if email fails, user can request resend later
                }
                
                return new SignupResult
                {
                    Success = true,
                    Message = "Signup successful! Please check your email for verification code.",
                    UserId = response,
                };
            }

            return new SignupResult
            {
                Success = false,
                Message = "Use a different email, this email already exists."
            };
        }

        public async Task<LoginResult> Login(string email, string password)
        {
            Console.WriteLine($"[AuthDebug] Attempting login for email: {email}");
            var user = await _authRepository.GetUserByEmail(email);

            if (user == null)
            {
                Console.WriteLine($"[AuthDebug] User not found for email: {email} (or IsDelete is true)");
                return new LoginResult
                {
                    Success = false,
                    Message = "Wrong credentials"
                };
            }

            Console.WriteLine($"[AuthDebug] User found: {user.UserId}. Verifying password...");
            bool isPasswordValid = _passwordService.VerifyPassword(password, user.Password);
            
            if (isPasswordValid)
            {
                Console.WriteLine("[AuthDebug] Password verified successfully.");
                // Get full user details for token generation
                var fullUser = await _authRepository.GetUserById(user.UserId);
                if (fullUser == null)
                {
                    Console.WriteLine("[AuthDebug] Full user details not found (unexpected).");
                    return new LoginResult
                    {
                        Success = false,
                        Message = "User not found."
                    };
                }

                // Generate JWT token
                var token = _jwtService.GenerateToken(fullUser.UserId, fullUser.Email, fullUser.Role?.RoleName ?? "User");
                var expiresAt = DateTime.UtcNow.AddMinutes(60); // Token expires in 60 minutes

                return new LoginResult
                {
                    Success = true,
                    Message = "Login successful!",
                    Token = token,
                    ExpiresAt = expiresAt,
                    User = new UserInfo
                    {
                        UserId = fullUser.UserId,
                        Email = fullUser.Email,
                        FirstName = fullUser.FirstName,
                        LastName = fullUser.LastName,
                        Role = fullUser.Role?.RoleName ?? "User"
                    }
                };
            }
            else
            {
                Console.WriteLine($"[AuthDebug] Password verification failed. Stored Hash: {user.Password?.Substring(0, Math.Min(user.Password?.Length ?? 0, 10))}...");
            }

            return new LoginResult
            {
                Success = false,
                Message = "Wrong credentials"
            };
        }
        
        public async Task<bool> UpdatePassword(string email, string currentPassword, string newPassword)
        {
            var userExists = await _authRepository.GetUserByEmail(email);

            if (userExists == null)
            {
                return false;
            }

            // Verify current password before allowing update
            if (!_passwordService.VerifyPassword(currentPassword, userExists.Password))
            {
                return false;
            }

            // Hash the new password before storing
            var hashedNewPassword = _passwordService.HashPassword(newPassword);
            
            bool update = await _authRepository.UpdateUser(email, currentPassword, hashedNewPassword);

            return update;
        }

        public async Task<VerifyEmailResult> VerifyEmail(string email, string code)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(code))
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Email and verification code are required."
                };
            }

            // Parse verification code
            if (!int.TryParse(code, out int verificationCode))
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Invalid verification code format."
                };
            }

            // Get user for verification
            var user = await _authRepository.GetUserByEmailForVerification(email);

            if (user == null)
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            // Check if user is already verified
            if (user.Verified == true)
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Email is already verified."
                };
            }

            // Verify the code
            bool verified = await _authRepository.VerifyUserEmail(email, verificationCode);

            if (verified)
            {
                return new VerifyEmailResult
                {
                    Success = true,
                    Message = "Email verified successfully!"
                };
            }

            return new VerifyEmailResult
            {
                Success = false,
                Message = "Invalid or expired verification code."
            };
        }

        public async Task<VerifyEmailResult> ResendVerificationEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Email is required."
                };
            }

            var user = await _authRepository.GetUserByEmailForVerification(email);

            if (user == null)
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            if (user.Verified == true)
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Email is already verified."
                };
            }

            var random = new Random();
            int verificationCode = random.Next(100000, 999999);

            var updated = await _authRepository.UpdateResetCode(email, verificationCode);

            if (!updated)
            {
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "Failed to generate new verification code."
                };
            }

            try
            {
                var emailSent = await _emailService.SendVerificationEmailAsync(email, user.FirstName ?? string.Empty, verificationCode);

                if (!emailSent)
                {
                    return new VerifyEmailResult
                    {
                        Success = false,
                        Message = "Failed to send verification email. Please try again later."
                    };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error resending verification email to {email}: {ex.Message}");
                return new VerifyEmailResult
                {
                    Success = false,
                    Message = "An error occurred while sending verification email."
                };
            }

            return new VerifyEmailResult
            {
                Success = true,
                Message = "A new verification code has been sent to your email."
            };
        }

        public async Task<bool> ForgotPassword(string email)
        {
            var user = await _authRepository.GetUserByEmailForVerification(email);

            if (user == null)
            {
                // To prevent email enumeration, we might want to return true even if user doesn't exist
                // But for this project, returning false is fine or we can match standard behavior
                return false;
            }

            // Generate 6-digit random code
            var random = new Random();
            int resetCode = random.Next(100000, 999999);

            // Save reset code to database
            bool codeUpdated = await _authRepository.UpdateResetCode(email, resetCode);

            if (!codeUpdated)
            {
                return false;
            }

            // Send reset email
            try
            {

                
                return await _emailService.SendPasswordResetEmailAsync(email, user.FirstName, resetCode);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending password reset email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> VerifyResetCode(string email, string code)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(code) || !int.TryParse(code, out int resetCode))
            {
                return false;
            }

            return await _authRepository.VerifyResetCode(email, resetCode);
        }

        public async Task<bool> ResetPassword(string email, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(newPassword))
            {
                return false;
            }

            // Hash the new password
            var hashedNewPassword = _passwordService.HashPassword(newPassword);

            // Update the password in database
            return await _authRepository.ResetPassword(email, hashedNewPassword);
        }
    }
}

