using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Talabat.API.Dtos;
using Talabat.API.Errors;
using Talabat.BLL.Interfaces;
using Talabat.DAL.Entities.Order;

namespace Talabat.API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public OrdersController(IOrderService orderService, IMapper mapper, IEmailService emailService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var displayName = User.FindFirstValue(ClaimTypes.GivenName)
                ?? User.FindFirstValue(ClaimTypes.Name)
                ?? email;

            var address = _mapper.Map<AddressDto, Address>(orderDto.shipToAddress);

            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address, orderDto.PaymentMethod);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem Occured with Creating The Order"));

            var paymentLabel = string.IsNullOrEmpty(order.PaymentIntentId) ? "Cash on Delivery" : "Stripe";
            var emailBody = $@"
                <h1>New Order Received!</h1>
                <p>Order ID: {order.Id}</p>
                <p>Customer: {displayName}</p>
                <p>Address: {order.ShipToAddress.Street}, {order.ShipToAddress.City}</p>
                <p><strong>Phone:</strong> {order.ShipToAddress.PhoneNumber}</p>
                <p><strong>WhatsApp:</strong> {order.ShipToAddress.WhatsAppNumber}</p>
                <p>Total: {order.GetTotal()} EGP</p>
                <p>Payment Method: {paymentLabel}</p>";

            await _emailService.SendEmailAsync("saifahmedelbattawy@gmail.com", "New Pharmacy Order", emailBody);

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var orders = await _orderService.GetOrdersForUserAsync(email);
            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("all-orders")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetAllStoreOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if(order == null) return NotFound(new ApiResponse(404));
            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _orderService.GetDeliveryMethodsAsync();
            return Ok(deliveryMethods);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")] // حماية: الأدمن بس اللي يقدر يغير الحالة
        public async Task<ActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            // 1. تحديث الحالة في السيرفيس أولاً
            var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, dto.Status);
            if (updatedOrder == null) return NotFound(new ApiResponse(404, "Order not found"));

            // 2. سحب بيانات الأوردر كاملة (بما فيها الـ Items والـ DeliveryMethod) عشان الإيميل وعشان الـ Total يحسب صح
            var fullOrder = await _orderService.GetOrderByIdAsync(id, updatedOrder.BuyerEmail);

            if (fullOrder != null)
            {
                // 3. تحضير محتوى الإيميل (HTML Template)
                var orderItemsHtml = "";
                foreach (var item in fullOrder.Items)
                {
                    orderItemsHtml += $"<li>{item.ItemOrdered.ProductItemName} - Qty: {item.Quantity} - Price: {item.Price} EGP</li>";
                }

                var emailBody = $@"
                    <div style='font-family: Arial, sans-serif; border: 1px solid #4f46e5; padding: 20px; border-radius: 15px;'>
                        <h2 style='color: #4f46e5;'>تنبيه بتحديث حالة الطلب # {fullOrder.Id}</h2>
                        <p>تم تغيير حالة الأوردر إلى: <strong>{fullOrder.Status}</strong></p>
                        <hr/>
                        <h4>تفاصيل العميل:</h4>
                        <p>الإيميل: {fullOrder.BuyerEmail}</p>
                        <p>العنوان: {fullOrder.ShipToAddress.Street}, {fullOrder.ShipToAddress.City}</p>
                        <p>التليفون: {fullOrder.ShipToAddress.PhoneNumber}</p>
                        
                        <h4>المنتجات:</h4>
                        <ul>{orderItemsHtml}</ul>
                        
                        <h3 style='color: #4f46e5;'>الإجمالي: {fullOrder.GetTotal()} EGP</h3>
                        <p style='font-size: 12px; color: gray;'>تم إرسال هذا التنبيه تلقائياً من سيستم MUST PHARMA</p>
                    </div>";

                // 4. إرسال الإيميل لإيميلك الشخصي كأدمن
                await _emailService.SendEmailAsync("saifahmedelattawy@gmail.com", $"Update: Order #{fullOrder.Id} is {fullOrder.Status}", emailBody);
            }

            return Ok(new { message = "Status updated and email sent successfully", newStatus = updatedOrder.Status.ToString() });
        }
    }
}
