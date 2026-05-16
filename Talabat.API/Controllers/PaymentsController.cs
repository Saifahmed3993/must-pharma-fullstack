using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using System.IO;
using System.Threading.Tasks;
using Talabat.API.Errors;
using Talabat.BLL.Interfaces;
using Talabat.DAL.Entities;
using Talabat.DAL.Entities.Order;

namespace Talabat.API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IConfiguration _config;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger, IConfiguration config)
        {
            _logger = logger;
            _paymentService = paymentService;
            _config = config;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return basket;
        }
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var webhookSecret = _config["StripeSettings:WebhookSecret"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], webhookSecret);

                PaymentIntent intent;
                Order order;

                switch (stripeEvent.Type)
                {
                    case Events.PaymentIntentSucceeded:
                        intent = (PaymentIntent)stripeEvent.Data.Object;
                        _logger.LogInformation("Payment Succeeded for: {PaymentIntentId}", intent.Id);
                        order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                        break;
                    case Events.PaymentIntentPaymentFailed:
                        intent = (PaymentIntent)stripeEvent.Data.Object;
                        _logger.LogInformation("Payment failed: {PaymentIntentId}", intent.Id);
                        order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                        _logger.LogInformation("Order marked payment failed: {OrderId}", order?.Id);
                        break;
                }
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe webhook processing failed");
                return BadRequest();
            }

            return new EmptyResult();
        }
    }
}
