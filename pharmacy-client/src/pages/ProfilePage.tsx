import { useState } from "react";
import { useAccount } from "../context/AccountContext";
import { useForm } from "react-hook-form";
import agent from "../api/agent";
import { Camera, User, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const getImageUrl = (path?: string) => {
  if (!path) return "https://api.dicebear.com/7.x/adventurer/svg?seed=saif";
  if (path.startsWith("http")) return path;
  return `https://localhost:5011/${path}`;
};

export default function ProfilePage() {
  const { user, updateUser } = useAccount();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [preview, setPreview] = useState(getImageUrl(user?.image));
  const { register, handleSubmit } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      phoneNumber: user?.phoneNumber || "",
    }
  });

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // معاينة فورية
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("Image", file);
      formData.append("DisplayName", user?.displayName || "");
      formData.append("PhoneNumber", user?.phoneNumber || "");

      const res = await agent.Account.update(formData);
      updateUser({ image: res.image }); // تغيير الصورة في الـ Navbar فوراً
      toast({ 
        title: "Avatar Updated Successfully!", 
        className: "bg-[#0f172a] text-emerald-400 border border-emerald-500/20" 
      });
    } catch (err) { 
      console.error(err); 
      toast({ 
        title: "Failed to upload image", 
        variant: "destructive" 
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("DisplayName", data.displayName || "");
      formData.append("PhoneNumber", data.phoneNumber || "");
      
      const res = await agent.Account.update(formData);
      updateUser({ 
        displayName: res.displayName,
        phoneNumber: res.phoneNumber 
      }); // تغيير الاسم في الـ Navbar فوراً
      
      toast({ 
        title: "Profile Updated Successfully!", 
        className: "bg-[#0f172a] text-emerald-400 border border-emerald-500/20" 
      });
    } catch (err) {
      toast({ title: "Update Failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500 text-white">
      
      {/* 1. Profile Header Card */}
      <div className="bg-[#0f172a] rounded-[2rem] p-8 border border-indigo-500/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-600/10 to-transparent"></div>
        <div className="relative group mt-4">
          <div className="w-36 h-36 rounded-full border-4 border-[#020617] overflow-hidden shadow-2xl relative">
            <img 
              src={preview} 
              alt="Avatar"
              className="w-full h-full object-cover group-hover:brightness-50 transition-all" 
            />
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="animate-spin text-indigo-400" size={24} />
              </div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" size={28} />
            <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
          </label>
        </div>
        <h1 className="text-2xl font-black text-white mt-4">{user?.displayName}</h1>
        <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{user?.role || "Member"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Personal Information (Main Form) */}
        <div className="lg:col-span-2 bg-[#0f172a] rounded-[2rem] p-8 border border-indigo-500/10 shadow-2xl">
          <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3">
            <User className="text-indigo-400" size={20} /> Account Information
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-slate-200 text-xs font-bold ml-1">Display Name</label>
                <Input {...register("displayName")} className="h-12 bg-[#020617] border-indigo-500/10 text-white focus:border-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-200 text-xs font-bold ml-1">Phone Number</label>
                <Input {...register("phoneNumber")} className="h-12 bg-[#020617] border-indigo-500/10 text-white focus:border-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-200 text-xs font-bold ml-1">Email Address (Primary)</label>
              <div className="relative">
                <Input disabled value={user?.email} className="h-12 bg-slate-900/40 border-slate-800 text-slate-400 cursor-not-allowed rounded-xl" />
                <Lock className="absolute right-4 top-3.5 text-slate-700" size={16} />
              </div>
            </div>
            <Button disabled={isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-indigo-600/15">
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <ShieldCheck className="mr-2" size={16} />}
              Update Account Data
            </Button>
          </form>
        </div>

        {/* 3. Security & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-indigo-500/10 shadow-2xl">
            <h3 className="text-white font-bold text-sm mb-4">Account Security</h3>
            <Button variant="outline" className="w-full border-indigo-500/15 text-indigo-400 hover:bg-indigo-500/10 h-11 rounded-xl font-bold text-xs bg-transparent">
              Change Password
            </Button>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
             <p className="text-indigo-200 font-bold text-[10px] uppercase tracking-widest">Your Loyalty Status</p>
             <h4 className="text-xl font-black mt-1 text-white">Elite Member</h4>
             <div className="h-2 bg-black/20 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-white w-3/4 shadow-[0_0_8px_#fff]"></div>
             </div>
             <p className="text-[10px] mt-2 opacity-80">75% to your next reward</p>
          </div>
        </div>
      </div>
    </div>
  );
}
