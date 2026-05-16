import { useEffect, useState } from "react";
import { useBasket } from "../context/BasketContext";
import agent from "../api/agent";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "../components/StripePayment";
import {
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  ShieldCheck,
  DollarSign
} from "lucide-react";

// مفتاح التجربة
const stripePromise = loadStripe("pk_test_51Pxxxx...");

export default function CheckoutPage() {
  const { basket, basketTotal, basketCount, clearBasket } = useBasket();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "COD">("COD");
  const { register, handleSubmit, reset, getValues } = useForm();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await agent.Account.getAddress();
        if (address) reset(address);
      } catch (error) {
        console.error("Could not fetch address", error);
      }
    };
    fetchAddress();
  }, [reset]);

  const handleOrderSubmit = async (addressData: any) => {
    if (!basket) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        basketId: localStorage.getItem("basket_id"),
        deliveryMethodId: 1,
        shipToAddress: addressData,
        paymentMethod: paymentMethod === "COD" ? "CashOnDelivery" : "Stripe"
      };

      await agent.Orders.create(orderData);

      toast({
        title: "Order Placed Successfully!",
        description: "Check your email for details, Dr. Saif.",
        className: "bg-indigo-600 text-white border-none"
      });

      clearBasket();
      navigate("/success");

    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStripeSuccess = (_paymentIntentId: string) => {
    const addressData = getValues();
    handleOrderSubmit(addressData);
  };

  if (!basket || basket.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#0f172a] border border-indigo-500/10 rounded-[3rem] shadow-2xl w-full max-w-5xl mx-auto my-10 animate-in fade-in zoom-in-95 duration-500 text-center">
        <div className="w-28 h-28 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20 shadow-inner">
          <ShoppingBag className="text-indigo-500" size={56} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Your Basket is Empty</h2>
        <p className="text-slate-400 text-sm md:text-base mb-10 max-w-md leading-relaxed mx-auto">Add some medicines to your cart first!</p>
        <Link to="/shop">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto px-4 lg:px-0">
      <div className="lg:col-span-8 space-y-8">
        
        {/* قسم العنوان */}
        <div className="bg-[#0f172a] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-indigo-500/10 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-8 border-b border-indigo-500/10 pb-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <MapPin size={22} />
            </div>
            <h2 className="text-2xl font-black text-white">Shipping Address</h2>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit(handleOrderSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              placeholder="First Name" 
              {...register("firstName")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="Last Name" 
              {...register("lastName")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="Street Address" 
              {...register("street")} 
              className="col-span-2 h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="City" 
              {...register("city")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="Country" 
              {...register("country")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="Zip Code" 
              {...register("zipCode")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="Phone Number" 
              {...register("phoneNumber")} 
              className="h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
            <Input 
              placeholder="WhatsApp Number" 
              {...register("whatsAppNumber")} 
              className="col-span-2 h-14 bg-[#020617] border border-indigo-500/10 text-white placeholder:text-slate-600 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-all focus-visible:border-indigo-500" 
            />
          </form>
        </div>

        {/* قسم الدفع */}
        <div className="bg-[#0f172a] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-indigo-500/10 transition-all">
          <div className="flex items-center gap-3 mb-8 border-b border-indigo-500/10 pb-4">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <CreditCard size={22} />
            </div>
            <h2 className="text-2xl font-black text-white">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${paymentMethod === "COD" ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5" : "border-indigo-500/10 bg-[#020617] hover:border-indigo-500/30"}`}
            >
              <div className={`p-3 rounded-xl transition-colors ${paymentMethod === "COD" ? "bg-indigo-600 text-white shadow-lg" : "bg-[#0f172a] border border-indigo-500/10 text-slate-400 group-hover:text-white"}`}>
                <DollarSign size={24} />
              </div>
              <div>
                <span className="block font-black text-lg text-white">Cash on Delivery</span>
                <span className="text-xs text-slate-400">Pay when you receive items</span>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("Stripe")}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${paymentMethod === "Stripe" ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5" : "border-indigo-500/10 bg-[#020617] hover:border-indigo-500/30"}`}
            >
              <div className={`p-3 rounded-xl transition-colors ${paymentMethod === "Stripe" ? "bg-indigo-600 text-white shadow-lg" : "bg-[#0f172a] border border-indigo-500/10 text-slate-400 group-hover:text-white"}`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="block font-black text-lg text-white">Credit Card</span>
                <span className="text-xs text-slate-400">Secure payment via Stripe</span>
              </div>
            </div>
          </div>

          {/* فورم الفيزا بتظهر بس لو اخترنا Stripe */}
          {paymentMethod === "Stripe" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <Elements stripe={stripePromise}>
                <StripePayment amount={basketTotal} onSuccess={onStripeSuccess} />
              </Elements>
            </div>
          )}
        </div>
      </div>

      {/* الجزء اليمين: ملخص الطلب */}
      <div className="lg:col-span-4">
        <div className="bg-[#0f172a] text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24 border border-indigo-500/10">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2 border-b border-indigo-500/10 pb-4">
            <CheckCircle2 className="text-indigo-400" size={24} />
            Summary
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-slate-400 font-semibold">
              <span>Items ({basketCount})</span>
              <span className="font-black text-white">{basketTotal} EGP</span>
            </div>
            <div className="flex justify-between text-slate-400 font-semibold border-b border-indigo-500/10 pb-4">
              <span>Shipping</span>
              <span className="text-indigo-400 font-black uppercase text-xs tracking-wider">Free</span>
            </div>
            <div className="flex justify-between text-2xl font-black pt-2">
              <span>Total</span>
              <span className="text-indigo-400">{basketTotal} EGP</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 text-sm text-slate-400 bg-[#020617]/50 p-5 rounded-2xl border border-indigo-500/10">
            <div className="flex gap-3">
              <Truck size={18} className="text-indigo-400 shrink-0" />
              <p className="leading-relaxed">Fast delivery in Giza within 24 hours.</p>
            </div>
          </div>

          {paymentMethod === "COD" ? (
            <Button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-900/20 hover:shadow-indigo-600/30 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 className="animate-spin" />
                  Processing...
                </div>
              ) : (
                "Confirm COD Order"
              )}
            </Button>
          ) : (
            <p className="text-xs text-center text-slate-500 italic font-medium leading-relaxed">
              Please enter your card details to complete payment above.
            </p>
          )}

          <p className="text-[10px] text-center text-slate-500 mt-6 uppercase tracking-widest font-bold">
            Secure 256-bit SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
