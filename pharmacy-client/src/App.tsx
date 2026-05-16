import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProductForm from "./components/AddProductForm";
import AddCategoryForm from "./components/AddCategoryForm";
import AddBundleForm from "./components/AddBundleForm";
import ProductList from "./components/ProductList";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; // استدعاء حماية الأدمن
import AppErrorBoundary from "./components/AppErrorBoundary";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import BasketPage from "./pages/BasketPage";
import OrdersPage from "./pages/OrdersPage";
import SuccessPage from "./pages/SuccessPage";
import HomePage from "./pages/HomePage"; // استدعاء الصفحة الرئيسية
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ManageMetadata from "./pages/ManageMetadata";
import { Toaster } from "@/components/ui/toaster";
import { BasketProvider } from "./context/BasketContext";
import { AccountProvider } from "./context/AccountContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AccountProvider>
          <BasketProvider>
            <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 flex flex-col font-sans">
              <Navbar />

              <main className="flex-grow w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-12">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/basket" element={<BasketPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* صفحات محمية لأي مستخدم */}
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />

                  {/* صفحات محمية للأدمن فقط */}
                  <Route path="/admin/add-product" element={<AdminRoute><AddProductForm /></AdminRoute>} />
                  <Route path="/admin/add-category" element={<AdminRoute><AddCategoryForm /></AdminRoute>} />
                  <Route path="/admin/add-bundle" element={<AdminRoute><AddBundleForm /></AdminRoute>} />
                  <Route path="/admin/manage-metadata" element={<AdminRoute><ManageMetadata /></AdminRoute>} />

                  <Route path="*" element={
                    <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-xl font-semibold">
                      404 - Not Found
                    </div>
                  } />
                </Routes>
              </main>

              {/* --- Global Footer Area --- */}
              <footer className="w-full mt-auto pt-16 pb-8 px-4 sm:px-6 lg:px-10">
                
                {/* المستطيل الكحلي (The Rectangular Stats Box) */}
                <div className="w-full max-w-[1700px] mx-auto bg-[#0f172a] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 border border-indigo-500/10 shadow-2xl mb-10">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {[
                      { label: 'Medicines', value: '2000+' },
                      { label: 'Trusted Brands', value: '50+' },
                      { label: 'Secure Payments', value: '100%' },
                      { label: 'Admin Support', value: '24/7' }
                    ].map((stat, i) => (
                      <div key={i} className="text-center lg:text-left flex flex-col items-center lg:items-start group cursor-default">
                        <p className="text-4xl sm:text-5xl xl:text-6xl font-black text-white mb-2 group-hover:text-indigo-500 transition-colors duration-500">
                          {stat.value}
                        </p>
                        <p className="text-indigo-400 font-black text-[10px] xl:text-xs uppercase tracking-[0.2em] xl:tracking-[0.3em] opacity-80">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* قسم حقوق الملكية والروابط (تحت المستطيل) */}
                <div className="w-full max-w-[1700px] mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs sm:text-sm font-bold">
                   <p className="text-center md:text-left">
                     © 2026 MUST PHARMA. All Rights Reserved. Giza, Egypt.
                   </p>
                   <div className="flex flex-wrap justify-center md:justify-end gap-6 sm:gap-8">
                      <button className="hover:text-indigo-400 transition-colors">Privacy Policy</button>
                      <button className="hover:text-indigo-400 transition-colors">Terms of Service</button>
                      <button className="hover:text-indigo-400 transition-colors">Contact Us</button>
                   </div>
                </div>
                
              </footer>

              <Toaster />
            </div>
          </BasketProvider>
        </AccountProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;