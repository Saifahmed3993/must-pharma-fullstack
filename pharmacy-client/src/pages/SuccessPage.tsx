import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-indigo-500/10 p-10 md:p-16 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
        
        {/* تأثير ضوئي خفيف في الخلفية */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>

        {/* أيقونة النجاح المتحركة */}
        <div className="relative z-10 w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <CheckCircle size={56} className="text-emerald-500 animate-bounce" />
        </div>

        {/* النصوص */}
        <h1 className="relative z-10 text-4xl md:text-5xl font-black text-white mb-4">
          Order Confirmed!
        </h1>
        <p className="relative z-10 text-slate-400 text-lg mb-10 leading-relaxed">
          Your order has been placed successfully. <br/>
          We've sent a confirmation email to your inbox with all the details.
        </p>

        {/* الأزرار */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/orders" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
          >
            <ShoppingBag size={20} />
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="bg-[#020617] border border-indigo-500/20 text-slate-300 hover:text-white hover:border-indigo-500/50 px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Back to Home
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* رسالة شكر صغيرة */}
        <p className="mt-12 text-slate-600 text-xs font-bold uppercase tracking-widest">
          Thank you for choosing MUST PHARMA
        </p>
      </div>
    </div>
  );
}
