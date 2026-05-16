using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talabat.BLL.Interfaces;
using Talabat.BLL.Specifications.Order_Specifications;
using Talabat.DAL.Entities;
using Talabat.DAL.Entities.Order;

namespace Talabat.BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        //private readonly IGenericRepository<Product> _productsRepo;
        //private readonly IGenericRepository<DeliveryMethod> _deliveryMethodsRepo;
        //private readonly IGenericRepository<Order> _ordersRepo;

        public OrderService(IBasketRepository basketRepo,
            //IGenericRepository<Product> productsRepo,
            //IGenericRepository<DeliveryMethod> deliveryMethodsRepo,
            //IGenericRepository<Order> ordersRepo
            IUnitOfWork unitOfWork, 
            IPaymentService paymentService)
        {
            _basketRepo = basketRepo;
            _unitOfWork = unitOfWork;
            _paymentService = paymentService;
            //_productsRepo = productsRepo;
            //_deliveryMethodsRepo = deliveryMethodsRepo;
            //_ordersRepo = ordersRepo;
        }
        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shipToAddress, string paymentMethod)
        {
            // 1. Get Basket From Baskets Repo
            var basket = await _basketRepo.GetBasketAsync(basketId);
            if (basket == null || basket.Items == null || basket.Items.Count == 0) return null;

            var isCashOnDelivery = paymentMethod?.Equals("CashOnDelivery", StringComparison.OrdinalIgnoreCase) == true
                || paymentMethod?.Equals("COD", StringComparison.OrdinalIgnoreCase) == true;

            // 2. Get Selected Items at Basket From Products Repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                if (product == null) continue;
                var productItemOrdered = new ProductItemOrdered(product.Id, product.Name, product.PictureUrl);

                // Always take the latest DB price to prevent client-side price tampering.
                var orderItem = new OrderItem(productItemOrdered, product.Price, item.Quantity);

                items.Add(orderItem);   
            }
            if (items.Count == 0) return null;

            // 3. Get Delivery Method From DeliveryMethods Repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // 4. Calculate SubTotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);


            string paymentIntentId = basket.PaymentIntentId;

            // Stripe flow keeps payment intent lifecycle, COD skips it entirely.
            if (!isCashOnDelivery && !string.IsNullOrEmpty(paymentIntentId))
            {
                var spec = new OrderWithItemsByPaymentIntentSpecification(paymentIntentId);
                var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
                if (existingOrder != null)
                {
                    _unitOfWork.Repository<Order>().Delete(existingOrder);
                    await _paymentService.CreateOrUpdatePaymentIntent(basket.Id);
                }
            }
            else if (isCashOnDelivery)
            {
                paymentIntentId = null;
            }

            // 5. Create Order
            var order = new Order(buyerEmail, shipToAddress, deliveryMethod, items, subtotal, paymentIntentId);
            _unitOfWork.Repository<Order>().Add(order);

           

            // 6. Save To Database [TODO]
            var result = await _unitOfWork.Complete();
            if(result <= 0) return null;

            await _basketRepo.DeleteBasketAsync(basketId);

            return order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrderWithItemsAndDeliveryMethodSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(spec);
        }

        public async Task<IReadOnlyList<Order>> GetAllOrdersAsync()
        {
            var spec = new OrderWithItemsAndDeliveryMethodSpecification();
            return await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(spec);
        }
       

        public async Task<Order> GetOrderByIdAsync(int orderId, string buyerEmail)
        {
            var spec = new OrderWithItemsAndDeliveryMethodSpecification(orderId, buyerEmail);

            return await  _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }
        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().GetAllAsync();
        }

        public async Task<Order?> UpdateOrderStatusAsync(int orderId, string newStatus)
        {
            var order = await _unitOfWork.Repository<Order>().GetByIdAsync(orderId);
            
            if (order == null) return null;

            if (Enum.TryParse<OrderStatus>(newStatus, true, out var parsedStatus))
            {
                order.Status = parsedStatus;
                _unitOfWork.Repository<Order>().Update(order);
                await _unitOfWork.Complete();
            }
            
            return order;
        }
    }
}
