import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import agent from "../api/agent";
import { Loader2, Trash2, ShoppingCart, Search, Filter, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useBasket as useBasketFromContext } from "../context/BasketContext";
import { useAccount } from "../context/AccountContext";
import { useToast } from "@/hooks/use-toast";

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

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  // States الخاصة بالفلترة والبحث
  const [brandId, setBrandId] = useState(0);
  const [typeId, setTypeId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  const { addItemToBasket } = useBasketFromContext();
  const { user } = useAccount();
  const { toast } = useToast();

  // جلب التصنيفات والماركات عند التحميل الأول
  useEffect(() => {
    agent.Products.brands().then(setBrands).catch(console.error);
    agent.Products.types().then(setTypes).catch(console.error);
  }, []);

  // جلب المنتجات عند تغير أي من الفلاتر أو البحث أو الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = { 
          pageSize: pageSize,
          pageIndex: pageIndex 
        };
        if (brandId > 0) params.brandId = brandId;
        if (typeId > 0) params.typeId = typeId;
        if (searchTerm) params.search = searchTerm;

        const response = await agent.Products.list(params);
        
        let resolvedProducts = [];
        if (response && response.data) {
          resolvedProducts = response.data;
          setTotalCount(response.count || 0);
        } else if (Array.isArray(response)) {
          resolvedProducts = response;
          setTotalCount(response.length);
        }
        
        const sorted = [...resolvedProducts].sort((a, b) => {
          const aIsBundle = a.productType?.toLowerCase().includes("bundle") || a.name?.toLowerCase().includes("bundle");
          const bIsBundle = b.productType?.toLowerCase().includes("bundle") || b.name?.toLowerCase().includes("bundle");

          if (aIsBundle && !bIsBundle) return -1;
          if (!aIsBundle && bIsBundle) return 1;
          return 0;
        });

        setProducts(sorted);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [brandId, typeId, searchTerm, pageIndex]);

  // تصفير الصفحة عند البحث أو الفلترة
  useEffect(() => {
    setPageIndex(1);
  }, [brandId, typeId, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await agent.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Product Deleted",
        description: "The product has been removed from inventory.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItemToBasket(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your basket.`,
        className: "bg-indigo-600 text-white border-none"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add to cart.",
        variant: "destructive"
      });
    }
  };

  const renderProductCard = (product: Product, isVip: boolean = false) => {
    return (
      <div
        key={product.id}
        className={`group bg-[#0f172a] border rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between relative max-w-[310px] mx-auto w-full ${
          isVip 
            ? "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.12)] hover:border-indigo-500/50 scale-[1.01]" 
            : "border-indigo-500/10 hover:border-indigo-500/20 hover:shadow-indigo-500/5"
        }`}
      >
        {isVip && (
          <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 border border-amber-300/30 z-10 animate-bounce">
            👑 Premium
          </div>
        )}

        {/* منطقة الصورة - خلي خلفيتها أسود أعمق عشان الصورة تنطق */}
        <div className="relative aspect-square bg-[#020617] rounded-2xl mb-3.5 overflow-hidden flex items-center justify-center">
          <img
            src={product.pictureUrl}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* الـ Badges (Brand & Type) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            <span className="bg-indigo-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">{product.productBrand}</span>
            <span className="bg-slate-800/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">{product.productType}</span>
          </div>

          {/* الـ Badge بتاع الخصم لو موجود */}
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse z-10">
              {product.discountPercentage}% OFF
            </span>
          ) : null}
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col flex-grow justify-between">
          <div>
            {/* اسم المنتج - أبيض ناصع */}
            <h3 className="text-white font-bold text-lg truncate mb-0.5 group-hover:text-indigo-400 transition-colors">
              {product.name}
            </h3>

            {/* المادة الفعالة لو موجودة */}
            {product.activeIngredient && (
              <div className="text-[10px] text-teal-400 font-bold mb-2 bg-teal-950/30 border border-teal-500/10 px-2 py-0.5 rounded-md inline-block truncate max-w-full">
                🧪 {product.activeIngredient}
              </div>
            )}

            {/* نكهة وحجم المكمل لو موجودين */}
            {(product.flavor || product.size) && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.size && (
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded-md">
                    ⚖️ {product.size}
                  </span>
                )}
                {product.flavor && (
                  <span className="text-[9px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-extrabold px-1.5 py-0.5 rounded-md">
                    🍓 {product.flavor}
                  </span>
                )}
              </div>
            )}

            {/* الوصف - رمادي هادي */}
            <p className="text-slate-400 text-xs line-clamp-2 mb-3 h-8">
              {product.description}
            </p>
          </div>

          <div>
            {/* السعر والـ Trash Icon */}
            <div className="flex justify-between items-end mb-3.5">
              <div>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Price</p>
                <div className="flex items-baseline gap-1.5">
                  {product.discountPercentage && product.discountPercentage > 0 ? (
                    <>
                      <p className="text-white font-black text-xl tracking-tighter">
                        {(product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)} <span className="text-indigo-500 text-xs">EGP</span>
                      </p>
                      <p className="text-slate-500 line-through text-xs">
                        {product.price.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-white font-black text-xl tracking-tighter">
                      {product.price.toFixed(2)} <span className="text-indigo-500 text-xs">EGP</span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* أيقونة الحذف للأدمن - خليها نيلي خفيف */}
              {user?.role === "Admin" && (
                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors" title="Delete Product">
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* زرار التفاصيل والإضافة للسلة - نيلي فخم */}
            <div className="flex gap-2">
              {/* زرار التفاصيل (مفرغ Outline) */}
              <Link to={`/product/${product.id}`} className="w-1/2">
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600/10 font-bold transition-all text-xs">
                  <Info size={14} />
                  Details
                </button>
              </Link>

              {/* زرار الإضافة للسلة (مليان Solid) */}
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-900/20 active:scale-95 text-xs"
              >
                <ShoppingCart size={14} />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. استخراج المنتجات الـ VIP (الباقات)
  const vipProducts = products.filter(p => {
    const typeName = p.productType?.toLowerCase() || "";
    const productName = p.name?.toLowerCase() || "";
    const activeIngredient = p.activeIngredient?.toLowerCase() || "";
    const size = p.size?.toLowerCase() || "";
    
    // بيمسك أي منتج نوعه أو اسمه أو مادته الفعالة أو حجمه يحتوي على bundle أو stack أو combo
    return (
      typeName.includes("bundle") || 
      typeName.includes("stack") ||
      productName.includes("bundle") || 
      productName.includes("stack") ||
      productName.includes("combo") ||
      activeIngredient.includes("stack") ||
      activeIngredient.includes("bundle") ||
      size.includes("combo") ||
      size.includes("stack") ||
      size.includes("bundle")
    );
  });

  // 2. باقي المنتجات (الكتالوج العام)
  const regularProducts = products.filter(p => !vipProducts.find(vip => vip.id === p.id));

  return (
    <div className="w-full space-y-8">
      {/* شريط البحث والفلترة */}
      <div className="bg-[#0f172a] p-4 rounded-3xl shadow-sm border border-indigo-500/10 flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search medicines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#020617] p-2.5 rounded-xl border border-indigo-500/20 flex-1 min-w-[160px]">
            <Filter size={18} className="text-indigo-400 ml-1" />
            <select 
              value={typeId} 
              onChange={(e) => setTypeId(Number(e.target.value))}
              className="bg-transparent outline-none text-sm text-white w-full cursor-pointer"
            >
              <option value={0} className="bg-[#020617] text-white">All Types</option>
              {types.map(t => <option key={t.id} value={t.id} className="bg-[#020617] text-white">{t.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#020617] p-2.5 rounded-xl border border-indigo-500/20 flex-1 min-w-[160px]">
            <Filter size={18} className="text-indigo-400 ml-1" />
            <select 
              value={brandId} 
              onChange={(e) => setBrandId(Number(e.target.value))}
              className="bg-transparent outline-none text-sm text-white w-full cursor-pointer"
            >
              <option value={0} className="bg-[#020617] text-white">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.id} className="bg-[#020617] text-white">{b.name}</option>)}
            </select>
          </div>
        </div>

      </div>

       {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-indigo-400" size={48} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-lg">
          No medicines found matching your criteria.
        </div>
      ) : (
        <div className="space-y-16">
          {/* القسم الأول: الـ VIP (الباقات) */}
          {vipProducts.length > 0 && (
            <section className="animate-in fade-in slide-in-from-top-10 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  Premium VIP Stacks 
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-md uppercase tracking-widest animate-pulse">
                    Exclusive Offers
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vipProducts.map((product) => renderProductCard(product, true))}
              </div>
            </section>
          )}

          {/* فاصل جمالي بين القسمين */}
          {vipProducts.length > 0 && (
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          )}

          {/* القسم الثاني: الكتالوج العادي */}
          <section className="animate-in fade-in duration-1000">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-2 bg-slate-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-300 tracking-tight flex items-center gap-3">
                General Catalog 
                <span className="text-sm font-normal text-slate-500 italic">
                  ({regularProducts.length} items available)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {regularProducts.map((product) => renderProductCard(product, false))}
            </div>
          </section>

          {/* أزرار التنقل بين الصفحات (Pagination) */}
          {totalCount > pageSize && (
            <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-indigo-500/10">
              <button
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="p-2 rounded-xl bg-[#020617] border border-indigo-500/20 text-slate-300 hover:text-white hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="text-slate-400 font-medium">
                Page <span className="text-white font-bold">{pageIndex}</span> of <span className="text-white font-bold">{Math.ceil(totalCount / pageSize)}</span>
              </div>

              <button
                onClick={() => setPageIndex((p) => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                disabled={pageIndex >= Math.ceil(totalCount / pageSize)}
                className="p-2 rounded-xl bg-[#020617] border border-indigo-500/20 text-slate-300 hover:text-white hover:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
