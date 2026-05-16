import { Link } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, Truck, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-24 lg:space-y-32 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[450px] lg:h-[500px] py-12 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#020617] border border-indigo-500/20 mx-4 shadow-2xl transition-all duration-500">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 tracking-tight leading-tight">
            Pharmacy <br className="hidden lg:block" /> <span className="text-indigo-400 italic">Management</span> System
          </h1>
          <p className="text-sm sm:text-base lg:text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed text-slate-400">
            Your trusted digital partner for modern pharmaceutical care and inventory management in Giza.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-slate-100 text-sm sm:text-lg font-bold px-8 py-4 lg:py-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
              <Link to="/shop" className="flex items-center justify-center">
                <ShoppingBag className="mr-2 text-indigo-600" /> Shop Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-2 border-indigo-500 text-white hover:bg-indigo-500/10 text-sm sm:text-lg font-bold px-8 py-4 lg:py-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
              <Link to="/admin/add-product" className="flex items-center justify-center">
                <LayoutDashboard className="mr-2 text-indigo-400" /> Admin Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Truck size={40} className="text-indigo-500" />}
          title="Fast Delivery"
          desc="Speedy delivery for all your pharmaceutical needs directly to your doorstep in Giza and Cairo."
        />
        <FeatureCard
          icon={<ShieldCheck size={40} className="text-indigo-500" />}
          title="Certified Care"
          desc="All products are managed by expert pharmacy professionals with deep practical experience."
        />
        <FeatureCard
          icon={<Clock size={40} className="text-indigo-500" />}
          title="24/7 Access"
          desc="Manage inventory and browse orders at any time with our robust digital infrastructure."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-[#0f172a] rounded-3xl border border-indigo-500/10 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 text-center">
      <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
