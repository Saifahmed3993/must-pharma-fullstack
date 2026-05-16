import { useState, useEffect } from "react";
import { Trash2, Plus, Tags, Layers, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import agent from "../api/agent";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function ManageMetadata() {
  const [activeTab, setActiveTab] = useState<"brands" | "types">("brands");
  const [items, setItems] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = activeTab === "brands" 
        ? await agent.Products.brands() 
        : await agent.Products.types();
      setItems(data);
    } catch (error) {
      toast({
        title: "Failed to load data",
        description: "Please check your network connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      if (activeTab === "brands") {
        await agent.Metadata.addBrand(newName);
      } else {
        await agent.Metadata.addType(newName);
      }
      
      toast({
        title: "Success",
        description: `${activeTab === "brands" ? "Brand" : "Type"} added successfully!`,
        className: "bg-indigo-600 text-white border-none shadow-xl"
      });
      setNewName("");
      loadData();
    } catch (error) {
      toast({
        title: "Error adding item",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      if (activeTab === "brands") {
        await agent.Metadata.deleteBrand(id);
      } else {
        await agent.Metadata.deleteType(id);
      }
      
      toast({
        title: "Item Deleted",
        description: "Successfully removed from inventory options.",
        className: "bg-indigo-600 text-white border-none shadow-xl"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Cannot delete item",
        description: "It might be currently linked to active products.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 px-4 md:px-0">
      
      <div className="flex items-center gap-4 mb-2">
        <Link to="/shop" className="p-3 bg-[#0f172a] rounded-full shadow-lg border border-indigo-500/10 text-slate-400 hover:text-white transition-all hover:scale-115">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Metadata Control</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your pharmacy brands and dosage forms globally.</p>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-indigo-500/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full"></div>

        {/* Toggle Tabs */}
        <div className="relative z-10 flex bg-[#020617] p-2 rounded-2xl mb-12 border border-indigo-500/10 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab("brands")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${activeTab === "brands" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Tags size={20} /> Brands
          </button>
          <button 
            onClick={() => setActiveTab("types")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${activeTab === "types" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Layers size={20} /> Types
          </button>
        </div>

        {/* Input Field */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-12">
          <input 
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Add new ${activeTab.slice(0, -1)} name...`}
            className="flex-grow bg-[#020617] border border-indigo-500/10 text-white p-5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 font-bold"
          />
          <button 
            onClick={handleAdd} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
          >
            <Plus size={24} /> Create
          </button>
        </div>

        {/* List of Items */}
        {loading ? (
          <div className="flex justify-center py-20 relative z-10">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#020617] border border-indigo-500/5 p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <span className="text-white font-black">{item.name}</span>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="text-slate-600 hover:text-red-500 transition-colors p-2 bg-[#0f172a] rounded-xl border border-indigo-500/5 hover:border-red-500/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* System Alert */}
        <div className="relative z-10 mt-12 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-start gap-4">
          <AlertCircle className="text-indigo-400 shrink-0 mt-0.5" size={24} />
          <p className="text-slate-400 text-sm leading-relaxed">
            <strong className="text-indigo-400">Pro Tip:</strong> Removing a category that has active medicines will result in a database error. Please clear or reassign all products before deleting.
          </p>
        </div>

      </div>
    </div>
  );
}
