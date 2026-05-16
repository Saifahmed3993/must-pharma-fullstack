import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, Pill, LayoutDashboard, Package, X, LogOut, ShoppingCart, ChevronDown, Settings, User, Tags, PlusCircle, Layers } from 'lucide-react';
import { useBasket } from '../context/BasketContext';
import { useAccount } from '../context/AccountContext';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // ربط الـ Hooks الحقيقية للمشروع
  const { basketCount, clearBasket } = useBasket();
  const { user, logout } = useAccount();

  const isAdmin = user?.role === 'Admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#020617]/95 backdrop-blur-2xl border-b border-indigo-500/10 transition-all">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2 sm:gap-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 cursor-pointer group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-all duration-300">
               <Pill size={28} className="text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              MUST <span className="text-indigo-500">PHARMA</span>
            </span>
          </Link>

          {/* Premium Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-grow max-w-3xl relative items-center group">
            <Search 
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" 
              size={20} 
            />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for medicines, vitamins, or pharmaceutical brands..." 
              className="w-full bg-[#0f172a] border border-indigo-500/10 text-white pl-14 pr-6 py-3.5 rounded-full focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-medium shadow-inner"
            />
          </form>

          {/* Action Icons & Auth */}
          <div className="flex items-center gap-3 sm:gap-8 text-slate-400">
            <Link to="/shop" className="hidden lg:flex flex-col items-center hover:text-white transition-colors group">
              <ShoppingBag size={24} className="group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest">
                SHOP
              </span>
            </Link>

            {user && (
              <Link to="/orders" className="hidden lg:flex flex-col items-center hover:text-white transition-colors group">
                <Package size={24} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest">Orders</span>
              </Link>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link to="/admin/add-product" className="hidden lg:flex flex-col items-center hover:text-white transition-colors group">
                  <LayoutDashboard size={24} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest">Inventory</span>
                </Link>
              </>
            )}

            {/* Basket Link with dynamic badge */}
            <Link to="/basket" className="flex flex-col items-center hover:text-white transition-colors group relative">
              <div className="relative">
                <ShoppingCart size={24} className="group-hover:-translate-y-1 transition-transform" />
                {user && basketCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#020617] shadow-lg shadow-indigo-600/40">
                    {basketCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1.5 font-black uppercase tracking-widest">
                CART
              </span>
            </Link>

            <div className="h-10 w-px bg-indigo-500/10 hidden lg:block"></div>
            
            {/* User Profile / Login Dropdown / Login Button */}
            {user ? (
              <div className="hidden sm:flex items-center gap-4 relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-3 bg-[#0f172a] border border-indigo-500/20 pl-2 pr-4 py-2 rounded-2xl hover:bg-indigo-500/10 transition-all group cursor-pointer focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-indigo-600 text-white font-black shadow-lg text-lg">
                    {user.image ? (
                      <img 
                        src={user.image.startsWith("http") ? user.image : `https://localhost:5011/${user.image}`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      user.displayName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-sm font-black text-white">{user.displayName}</span>
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                      {isAdmin ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-500 group-hover:text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    {/* Backdrop to dismiss dropdown click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#020617] border border-indigo-500/20 p-2 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all font-semibold"
                      >
                        <User size={18} className="text-indigo-500" />
                        My Profile
                      </Link>
                      {isAdmin && (
                        <>
                          <Link 
                            to="/admin/add-product" 
                            onClick={() => setIsDropdownOpen(false)} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all font-semibold"
                          >
                            <Settings size={18} className="text-indigo-500" />
                            Add Product
                          </Link>
                          <Link 
                            to="/admin/add-category" 
                            onClick={() => setIsDropdownOpen(false)} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all font-semibold"
                          >
                            <PlusCircle size={18} className="text-indigo-500" />
                            Add Category
                          </Link>
                          <Link 
                            to="/admin/add-bundle" 
                            onClick={() => setIsDropdownOpen(false)} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-400 hover:text-white hover:bg-indigo-600/20 transition-all font-black border border-indigo-500/10"
                          >
                            <Layers size={18} className="text-indigo-400 animate-pulse" />
                            Add Bundle
                          </Link>
                          <Link 
                            to="/admin/manage-metadata" 
                            onClick={() => setIsDropdownOpen(false)} 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all font-semibold"
                          >
                            <Tags size={18} className="text-indigo-500" />
                            Manage Metadata
                          </Link>
                        </>
                      )}
                      <div className="h-px bg-indigo-500/10 my-1"></div>
                      <button 
                        onClick={() => { logout(); clearBasket(); setIsDropdownOpen(false); }} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-semibold text-left"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                Login
              </Link>
            )}

          </div>
          
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-indigo-500 p-2 hover:scale-105 transition-all">
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay / Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl p-8 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-10 border-b border-indigo-500/20 pb-6">
            <span className="text-2xl font-black text-white">MUST <span className="text-indigo-500">PHARMA</span></span>
            <button onClick={() => setIsMenuOpen(false)} className="bg-[#0f172a] p-2 rounded-xl text-slate-400 hover:text-white transition-colors border border-indigo-500/10">
              <X size={28} />
            </button>
          </div>
          
          <div className="space-y-6 flex flex-col overflow-y-auto max-h-[80vh] pb-10">
            
            {/* --- 👤 User Profile Header --- */}
            {user && (
              <div className="flex items-center gap-4 mb-4 pb-6 border-b border-indigo-500/10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-indigo-500 overflow-hidden flex items-center justify-center bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20 text-xl">
                    {user.image ? (
                      <img 
                        src={user.image.startsWith("http") ? user.image : `https://localhost:5011/${user.image}`} 
                        className="w-full h-full object-cover" 
                        alt="profile"
                      />
                    ) : (
                      user.displayName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-lg leading-tight">{user.displayName}</span>
                  <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                    {isAdmin ? "Pharmacy Admin" : "Customer Account"}
                  </span>
                </div>
              </div>
            )}

            {/* 1. روابط أساسية للجميع */}
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 transition-all">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 transition-all">Shop</Link>
            
            {user ? (
              <>
                {/* 2. فلترة حسب الصلاحيات (Role-based Links) */}
                {isAdmin ? (
                  // 🔴 روابط الطلبات والمخزن للأدمن فقط
                  <div className="pt-6 mt-2 border-t border-indigo-500/10">
                    <p className="text-indigo-500 text-xs font-black mb-4 uppercase tracking-widest">Admin Panel</p>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 mb-6 transition-all">Orders Dashboard</Link>
                    <Link to="/admin/add-product" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 mb-6 transition-all">Add Product</Link>
                    <Link to="/admin/add-category" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 mb-6 transition-all">Add Category</Link>
                    <Link to="/admin/add-bundle" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-indigo-400 hover:text-indigo-300 hover:translate-x-2 mb-6 transition-all">Add Bundle 📦</Link>
                    <Link to="/admin/manage-metadata" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 transition-all">Manage Metadata</Link>
                  </div>
                ) : (
                  // 🔵 روابط الحساب الشخصي للمستخدم العادي
                  <div className="pt-6 mt-2 border-t border-indigo-500/10">
                    <p className="text-indigo-500 text-xs font-black mb-4 uppercase tracking-widest">My Account</p>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 mb-6 transition-all">My Profile</Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-white hover:translate-x-2 transition-all">My Orders</Link>
                  </div>
                )}
                
                {/* 3. تسجيل الخروج */}
                <button onClick={() => { logout(); clearBasket(); setIsMenuOpen(false); }} className="text-left text-2xl font-black text-red-500 hover:text-red-400 mt-8 pt-6 border-t border-red-500/10 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              // ⚪ روابط تسجيل الدخول والإنشاء
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-indigo-400 hover:text-indigo-300 mt-8 pt-6 border-t border-indigo-500/10 transition-colors">
                Login / Register
              </Link>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
