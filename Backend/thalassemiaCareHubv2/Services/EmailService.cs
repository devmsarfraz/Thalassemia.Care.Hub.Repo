using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using thalassemiaCareHubv2.Interface;

namespace thalassemiaCareHubv2.Services
{
    public class EmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public EmailService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiKey = _configuration["Brevo:ApiKey"] ?? throw new ArgumentNullException("Brevo:ApiKey");
            _senderEmail = _configuration["Brevo:SenderEmail"] ?? throw new ArgumentNullException("Brevo:SenderEmail");
            _senderName = _configuration["Brevo:SenderName"] ?? "Thalassemia Care Hub";

            // Configure HttpClient for Brevo API
            _httpClient.BaseAddress = new Uri("https://api.brevo.com/v3/");
            _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<bool> SendVerificationEmailAsync(string email, string firstName, int verificationCode)
        {
            try
            {
                // Create email content
                var emailBody = new
                {
                    sender = new
                    {
                        name = _senderName,
                        email = _senderEmail
                    },
                    to = new[]
                    {
                        new
                        {
                            email = email,
                            name = firstName
                        }
                    },
                    subject = "Verify Your Thalassemia Care Hub Account",
                    htmlContent = GetVerificationEmailHtml(firstName, verificationCode),
                    textContent = GetVerificationEmailText(firstName, verificationCode)
                };

                // Serialize to JSON
                var jsonContent = JsonSerializer.Serialize(emailBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // Send email via Brevo API
                var response = await _httpClient.PostAsync("smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Verification email sent successfully to {email}");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Failed to send verification email to {email}. Status: {response.StatusCode}, Error: {errorContent}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred while sending verification email to {email}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string firstName, int resetCode)
        {
            try
            {
                // Create email content
                var emailBody = new
                {
                    sender = new
                    {
                        name = _senderName,
                        email = _senderEmail
                    },
                    to = new[]
                    {
                        new
                        {
                            email = email,
                            name = firstName
                        }
                    },
                    subject = "Reset Your Password - Thalassemia Care Hub",
                    htmlContent = GetPasswordResetEmailHtml(firstName, resetCode),
                    textContent = GetPasswordResetEmailText(firstName, resetCode)
                };

                // Serialize to JSON
                var jsonContent = JsonSerializer.Serialize(emailBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // Send email via Brevo API
                var response = await _httpClient.PostAsync("smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Password reset email sent successfully to {email}");
                    return true;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Failed to send password reset email to {email}. Status: {response.StatusCode}, Error: {errorContent}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred while sending password reset email to {email}: {ex.Message}");
                return false;
            }
        }

        private string GetVerificationEmailHtml(string firstName, int verificationCode)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .container {{
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }}
        .header {{
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }}
        .code-box {{
            background-color: #ffffff;
            border: 2px solid #3498db;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            color: #3498db;
            letter-spacing: 5px;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #777;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Welcome to Thalassemia Care Hub!</h1>
        </div>
        
        <p>Hello <strong>{firstName}</strong>,</p>
        
        <p>Thank you for registering with Thalassemia Care Hub. To complete your registration and verify your email address, please use the verification code below:</p>
        
        <div class=""code-box"">
            {verificationCode}
        </div>
        
        <p>This code will expire in 15 minutes. Please enter this code in the verification page to activate your account.</p>
        
        <p>If you didn't create an account with Thalassemia Care Hub, please ignore this email.</p>
        
        <div class=""footer"">
            <p>Best regards,<br>Thalassemia Care Hub Team</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetVerificationEmailText(string firstName, int verificationCode)
        {
            return $@"
Welcome to Thalassemia Care Hub!

Hello {firstName},

Thank you for registering with Thalassemia Care Hub. To complete your registration and verify your email address, please use the verification code below:

Verification Code: {verificationCode}

This code will expire in 15 minutes. Please enter this code in the verification page to activate your account.

If you didn't create an account with Thalassemia Care Hub, please ignore this email.

Best regards,
Thalassemia Care Hub Team

This is an automated email, please do not reply.";
        }

        private string GetPasswordResetEmailHtml(string firstName, int resetCode)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .container {{
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }}
        .header {{
            text-align: center;
            color: #dc3545;
            margin-bottom: 30px;
        }}
        .code-box {{
            background-color: #ffffff;
            border: 2px solid #dc3545;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            color: #dc3545;
            letter-spacing: 5px;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #777;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Reset Your Password</h1>
        </div>
        
        <p>Hello <strong>{firstName}</strong>,</p>
        
        <p>We received a request to reset your password for your Thalassemia Care Hub account. Please use the verification code below to reset your password:</p>
        
        <div class=""code-box"">
            {resetCode}
        </div>
        
        <p>This code will expire in 15 minutes. Do not share this code with anyone.</p>
        
        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        
        <div class=""footer"">
            <p>Best regards,<br>Thalassemia Care Hub Team</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetPasswordResetEmailText(string firstName, int resetCode)
        {
            return $@"
Reset Your Password - Thalassemia Care Hub

Hello {firstName},

We received a request to reset your password for your Thalassemia Care Hub account. Please use the verification code below to reset your password:

Verification Code: {resetCode}

This code will expire in 15 minutes. Do not share this code with anyone.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
Thalassemia Care Hub Team

This is an automated email, please do not reply.";
        }
    }
}

