using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talabat.DAL.Entities;
using Talabat.DAL.Entities.Order;

namespace Talabat.BLL.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress, string paymentMethod);

        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<IReadOnlyList<Order>> GetAllOrdersAsync();

        Task<Order> GetOrderByIdAsync(int orderId, string buyerEmail);

        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
        Task<Order?> UpdateOrderStatusAsync(int orderId, string newStatus);
    }
}
