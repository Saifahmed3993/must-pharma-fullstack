using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;
using Talabat.BLL.Interfaces;
using Talabat.DAL.Entities.Order;

namespace Talabat.BLL.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var smtpHost = _config["EmailSettings:Host"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_config["EmailSettings:Port"] ?? "587");
            var smtpUser = _config["EmailSettings:Email"];
            var smtpPass = _config["EmailSettings:Password"];

            if (string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(smtpPass))
            {
                System.Console.WriteLine("Email skipped: No SMTP credentials found in appsettings.json.");
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MUST PHARMA", smtpUser));
            message.To.Add(new MailboxAddress(toEmail, toEmail));
            message.Subject = subject;
            message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

            using var client = new SmtpClient();
            try
            {
                System.Console.WriteLine($"[EmailService] Attempting to send email to {toEmail} via {smtpHost}:{smtpPort}...");
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                System.Console.WriteLine($"[EmailService] Email sent successfully to {toEmail}!");
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[EmailService] Email Error sending to {toEmail}: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Email Error: {ex.Message}");
            }
        }

        public async Task SendOrderEmailAsync(string toEmail, Order order)
        {
            var htmlBody = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;'>
                        <h1 style='color: #0d9488; text-align: center;'>New Order Received!</h1>
                        <p>Hello Dr. Saif,</p>
                        <p>A new order has been placed in your pharmacy system.</p>
                        <div style='background-color: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0;'>
                            <h3 style='margin-top: 0;'>Order Details:</h3>
                            <p><strong>Order ID:</strong> #{order.Id}</p>
                            <p><strong>Customer:</strong> {order.BuyerEmail}</p>
                            <p><strong>Address:</strong> {order.ShipToAddress.Street}, {order.ShipToAddress.City}</p>
                            <p><strong>Phone:</strong> {order.ShipToAddress.PhoneNumber}</p>
                            <p><strong>WhatsApp:</strong> {order.ShipToAddress.WhatsAppNumber}</p>
                            <p><strong>Total Amount:</strong> {order.GetTotal()} EGP</p>
                        </div>
                        <p>Please check your dashboard to process this order.</p>
                        <footer style='margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;'>
                            Pharmacy Management System &copy; 2026
                        </footer>
                    </div>";

            await SendEmailAsync(toEmail, $"New Order #{order.Id} - Confirmation", htmlBody);
        }
    }
}
