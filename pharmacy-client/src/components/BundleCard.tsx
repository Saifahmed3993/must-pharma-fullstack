import { ShoppingCart, Flame, Package } from "lucide-react";
import { useBasket as useBasketFromContext } from "../context/BasketContext";
import { useToast } from "@/hooks/use-toast";

interface Bundle {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  productType: string;
  productBrand: string;
  discountPercentage?: number;
  activeIngredient?: string;
  flavor?: string;
  size?: string;
}

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addItemToBasket } = useBasketFromContext();
  const { toast } = useToast();

  const finalPrice = bundle.discountPercentage && bundle.discountPercentage > 0
    ? bundle.price - (bundle.price * (bundle.discountPercentage / 100))
    : bundle.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToBasket(bundle);
    toast({
      title: "Added Bundle to Basket!",
      description: `${bundle.name} is now in your cart.`,
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-[#1e1b4b]/50 to-[#0f172a] border border-indigo-500/15 hover:border-indigo-500/40 rounded-[2.5rem] p-6 md:p-8 hover:shadow-[0_0_50px_rgba(79,70,229,0.15)] transition-all duration-500 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8 items-center">
      
      {/* Glow highlight effect behind image */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />
      
      {/* Bundle Image Container */}
      <div className="w-full md:w-44 h-44 flex-shrink-0 bg-[#020617]/60 rounded-3xl p-4 flex items-center justify-center border border-indigo-500/10 relative group overflow-hidden">
        <img 
          src={bundle.pictureUrl} 
          alt={bundle.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" 
        />
        {bundle.discountPercentage && bundle.discountPercentage > 0 ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg">
            -{bundle.discountPercentage}%
          </span>
        ) : null}
      </div>

      {/* Bundle Details Section */}
      <div className="flex-1 text-center md:text-left flex flex-col justify-between h-full min-w-0">
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase animate-pulse">
              <Flame size={12} /> Hot Stack
            </span>
            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase">
              <Package size={12} /> {bundle.size || "Combo"}
            </span>
            {bundle.flavor && (
              <span className="bg-pink-500/10 border border-pink-500/25 text-pink-400 text-[10px] font-black px-3 py-1 rounded-full">
                🍓 {bundle.flavor}
              </span>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors leading-none">
            {bundle.name}
          </h3>
          
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
            {bundle.description}
          </p>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex items-center justify-between bg-slate-950/40 border border-indigo-500/5 p-4 rounded-2xl">
          <div className="flex flex-col text-left">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Stack Deal</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {finalPrice.toFixed(2)} <span className="text-sm text-indigo-400 font-bold">EGP</span>
              </p>
              {bundle.discountPercentage && bundle.discountPercentage > 0 ? (
                <p className="text-slate-500 line-through text-xs font-bold">
                  {bundle.price.toFixed(2)}
                </p>
              ) : null}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 font-black group/btn"
          >
            <ShoppingCart size={18} />
            <span className="text-xs uppercase tracking-wider hidden sm:inline-block">Grab Stack</span>
          </button>
        </div>
      </div>
    </div>
  );
}
