import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import agent from "../api/agent";
import { ArrowLeft, ShoppingCart, Package, Activity, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useBasket as useBasketFromContext } from "../context/BasketContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Product {
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

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItemToBasket } = useBasketFromContext();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const data = await agent.Products.details(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItemToBasket(product);
    toast({
      title: "Added to Basket!",
      description: `${product.name} is now in your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-100">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">Loading premium details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl py-16 animate-in fade-in duration-500">
        <AlertCircle className="mx-auto h-16 w-16 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 mb-6">The requested product does not exist or may have been deleted.</p>
        <Link to="/shop">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 py-5">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const finalPrice = product.discountPercentage && product.discountPercentage > 0
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Link to="/shop" className="inline-flex items-center text-slate-400 hover:text-white mb-8 font-bold text-sm tracking-wide group transition-colors">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> BACK TO SHOP
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 md:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 relative overflow-hidden">
        {/* Glow Effects in Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* الصورة الفاخرة لمنتج المكمل */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-slate-950/40 border border-slate-800 rounded-3xl p-8 relative group overflow-hidden min-h-[300px] lg:min-h-[450px]">
          <img 
            src={product.pictureUrl} 
            alt={product.name} 
            className="max-h-96 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
          />
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/20">
              {product.discountPercentage}% OFF
            </span>
          ) : null}
        </div>

        {/* تفاصيل المنتج الحصرية */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            {/* الشارات العلوية */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {product.productBrand}
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {product.productType}
              </span>
            </div>

            {/* الاسم الفخم */}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none">
              {product.name}
            </h1>

            {/* المادة الفعالة لو موجودة */}
            {product.activeIngredient && (
              <div className="text-xs text-teal-400 font-extrabold mb-6 bg-teal-950/30 border border-teal-500/25 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <Sparkles size={14} /> Active Ingredient: {product.activeIngredient}
              </div>
            )}

            {/* الوصف */}
            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* تفاصيل المكملات الغذائية */}
            {(product.size || product.flavor) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {product.size && (
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 hover:border-indigo-500/20 transition-all">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl">
                      <Package className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Size / Servings</p>
                      <p className="text-white font-extrabold text-sm">{product.size}</p>
                    </div>
                  </div>
                )}
                {product.flavor && (
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5 hover:border-indigo-500/20 transition-all">
                    <div className="p-2.5 bg-pink-500/10 rounded-xl">
                      <Activity className="text-pink-400" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Flavor</p>
                      <p className="text-white font-extrabold text-sm">{product.flavor}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* الفاتورة و الإضافة */}
          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Investment</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {finalPrice.toFixed(2)} <span className="text-indigo-400 text-lg">EGP</span>
                </span>
                {product.discountPercentage && product.discountPercentage > 0 ? (
                  <span className="text-slate-500 line-through text-base font-bold">
                    {product.price.toFixed(2)}
                  </span>
                ) : null}
              </div>
            </div>

            <Button 
              onClick={handleAddToCart} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-7 rounded-2xl text-base shadow-xl shadow-indigo-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Basket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
