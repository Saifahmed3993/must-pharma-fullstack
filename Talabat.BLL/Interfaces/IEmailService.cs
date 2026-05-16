using System.Threading.Tasks;
using Talabat.DAL.Entities.Order;

namespace Talabat.BLL.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
        Task SendOrderEmailAsync(string toEmail, Order order);
    }
}
