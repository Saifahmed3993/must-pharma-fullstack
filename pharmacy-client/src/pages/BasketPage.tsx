import { useBasket } from "../context/BasketContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BasketPage() {
  const {
    basket,
    removeItemFromBasket,
    incrementItemQuantity,
    decrementItemQuantity,
    basketTotal
  } = useBasket();

  if (!basket || basket.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#0f172a] border border-indigo-500/10 rounded-[3rem] shadow-2xl w-full max-w-5xl mx-auto my-10 animate-in fade-in zoom-in-95 duration-500 text-center">
        {/* أيقونة السلة (متظبطة بألوان النيلي) */}
        <div className="w-28 h-28 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20 shadow-inner">
          <ShoppingCart size={56} className="text-indigo-500" />
        </div>
        
        {/* النصوص */}
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Your basket is empty
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-10 max-w-md leading-relaxed mx-auto">
          Looks like you haven't added anything to your cart yet. Browse our inventory to find what you need.
        </p>
        
        {/* الزرار (متظبط على الـ Theme الجديد) */}
        <Link 
          to="/shop" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3 justify-center"
        >
          <ShoppingCart size={20} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/shop" className="p-3 bg-[#0f172a] rounded-full shadow-lg border border-indigo-500/10 text-slate-400 hover:text-white transition-all hover:scale-115">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Shopping Basket</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {basket.items.map(item => (
            <div key={item.id} className="flex flex-wrap sm:flex-nowrap items-center gap-6 bg-[#0f172a] p-6 rounded-[2rem] shadow-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all group relative">
              <div className="w-24 h-24 bg-[#020617] rounded-2xl p-2 flex-shrink-0 flex items-center justify-center overflow-hidden border border-indigo-500/5">
                <img src={item.pictureUrl} alt={item.productName} className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{item.productName}</h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                    {item.brand}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/90 text-white px-2.5 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[#020617] rounded-xl p-1 border border-indigo-500/10">
                    <button
                      onClick={() => decrementItemQuantity(item.id)}
                      className="p-1.5 hover:bg-[#0f172a] rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-white">{item.quantity}</span>
                    <button
                      onClick={() => incrementItemQuantity(item.id)}
                      className="p-1.5 hover:bg-[#0f172a] rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 line-through">{(item.price * 1.2).toFixed(2)} EGP</p>
                  <p className="text-2xl font-black text-indigo-400">{item.price.toFixed(2)} EGP</p>
                </div>
                <button
                  onClick={() => removeItemFromBasket(item.id)}
                  className="p-2.5 text-slate-500 hover:text-red-500 transition-colors bg-[#020617] rounded-xl border border-indigo-500/5 hover:border-red-500/20"
                  title="Remove Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl border border-indigo-500/10 sticky top-24">
            <h2 className="text-2xl font-black mb-6 text-white flex items-center gap-2">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Subtotal</span>
                <span className="font-black text-white">{basketTotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Shipping</span>
                <span className="text-indigo-400 font-black uppercase tracking-wider text-xs">Free</span>
              </div>
              <div className="flex justify-between text-slate-400 font-semibold">
                <span>Tax (VAT)</span>
                <span className="font-black text-white">0.00 EGP</span>
              </div>
            </div>

            <div className="flex justify-between mb-8 text-2xl font-black border-t border-indigo-500/10 pt-6">
              <span className="text-white">Total</span>
              <span className="text-indigo-400">{basketTotal.toFixed(2)} EGP</span>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-black rounded-2xl shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/30 transition-all active:scale-95">
                Proceed to Checkout
              </Button>
            </Link>

            <p className="text-center text-[10px] uppercase tracking-wider text-slate-500 mt-5 font-bold">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
