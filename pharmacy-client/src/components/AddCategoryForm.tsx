import { useState } from "react";
import agent from "../api/agent";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FolderPlus, Loader2, Tags } from "lucide-react";

export default function AddCategoryForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState("types"); // الافتراضي هو الأنواع

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      // هيبعت الريكويست إما لـ /Products/types أو /Products/brands حسب اختيارك
      await agent.post(`/Products/${categoryType}`, { name });
      
      toast({ title: "Success", description: "Category added successfully!" });
      setName(""); // تفريغ الحقل
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add category", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#0f172a] p-8 rounded-3xl shadow-sm border border-indigo-500/10 mt-10">
      <h2 className="text-2xl font-black text-indigo-400 mb-6 flex items-center gap-2">
        <FolderPlus /> Add New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Category Target</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input type="radio" checked={categoryType === "types"} onChange={() => setCategoryType("types")} className="text-indigo-600 focus:ring-indigo-500" />
              Medicine Type (e.g., Tablets, Syrup)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input type="radio" checked={categoryType === "brands"} onChange={() => setCategoryType("brands")} className="text-indigo-600 focus:ring-indigo-500" />
              Brand/Manufacturer (e.g., Pfizer, Eva)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-1">Name</label>
          <div className="relative">
            <Tags className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              required 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full pl-10 p-3 bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600" 
              placeholder={categoryType === "types" ? "e.g., Antibiotics" : "e.g., GlaxoSmithKline"} 
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <FolderPlus className="mr-2" />}
          Save Category
        </Button>
      </form>
    </div>
  );
}
