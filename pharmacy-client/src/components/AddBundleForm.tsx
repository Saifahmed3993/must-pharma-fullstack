import { useState, useEffect } from "react";
import agent from "../api/agent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Layers, Sparkles, X, UploadCloud } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CategoryItem {
  id: number;
  name: string;
}


const formSchema = z.object({
  name: z.string().min(2, "Bundle name must be at least 2 characters"),
  description: z.string().min(10, "Bundle description must be at least 10 characters"),
  activeIngredient: z.string().optional().default(""),
  flavor: z.string().optional().default(""),
  size: z.string().min(1, "Please specify the bundle size (e.g., 3-In-1 Stack, 3 Items)"),
  price: z.coerce.number().min(0.1, "Price must be greater than 0"),
  discountPercentage: z.coerce.number().min(0).max(100, "Discount cannot exceed 100%"),
  productBrandId: z.string().min(1, "Please select a product brand"),
  productTypeId: z.string().min(1, "Please select a product type"),
});

export default function AddBundleForm() {
  const [brands, setBrands] = useState<CategoryItem[]>([]);
  const [types, setTypes] = useState<CategoryItem[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // دالة التعامل مع اختيار الصور
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // إنشاء روابط للمعاينة
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // حذف صورة من المعاينة قبل الرفع
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      activeIngredient: "Premium Supplements Stack",
      flavor: "Mixed Flavors",
      size: "3 Items Combo",
      price: 0,
      discountPercentage: 15,
      productBrandId: "",
      productTypeId: "",
      image: undefined,
    },
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [brandsRes, typesRes] = await Promise.all([
          agent.get("/products/brands"),
          agent.get("/products/types"),
        ]);
        setBrands(brandsRes);
        setTypes(typesRes);
        
        // Auto-select "Bundles" or first type if available
        const bundlesType = typesRes.find((t: CategoryItem) => t.name.toLowerCase().includes("bundle"));
        if (bundlesType) {
          form.setValue("productTypeId", String(bundlesType.id));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchDropdownData();
  }, [form]);

  const onSubmit = async (values: any) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one image for the bundle.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("activeIngredient", values.activeIngredient || "");
      formData.append("flavor", values.flavor || "");
      formData.append("size", values.size);
      formData.append("price", String(values.price));
      formData.append("discountPercentage", String(values.discountPercentage));
      formData.append("productBrandId", values.productBrandId);
      formData.append("productTypeId", values.productTypeId);
      
      selectedFiles.forEach((file) => {
        formData.append("PictureUrl", file);
      });

      await agent.Products.create(formData);
      
      toast({
        title: "Bundle Created!",
        description: `Successfully added "${values.name}" bundle to the catalog.`,
      });
      
      form.reset({
        name: "",
        description: "",
        activeIngredient: "Premium Supplements Stack",
        flavor: "Mixed Flavors",
        size: "3 Items Combo",
        price: 0,
        discountPercentage: 15,
        productBrandId: "",
        productTypeId: form.getValues("productTypeId"),
      });

      setSelectedFiles([]);
      setPreviews([]);
    } catch (error: any) {
      toast({
        title: "Failed to Add Bundle",
        description: error.message || "An error occurred while uploading the bundle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto bg-[#0f172a] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-indigo-500/10 mt-10 relative overflow-hidden animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <h2 className="text-3xl md:text-4xl font-black text-indigo-400 mb-8 flex items-center gap-3 tracking-tight">
        <Layers className="text-indigo-500" size={32} /> Create Supplement Stack / Bundle
        <span className="text-xs bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
          <Sparkles size={12} /> Commercial Pack
        </span>
      </h2>

      {isFetchingData ? (
        <div className="flex items-center justify-center py-20 text-indigo-400 gap-3 font-bold">
          <Loader2 className="animate-spin" size={24} /> Fetching system configurations...
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Bundle Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Bundle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Extreme Muscle Gainer Stack (Creatine + Whey)"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Bundle Size / Contents count */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Bundle Contents / Size</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 3 Items Combo, 2 tubs + shaker"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Bundle Standard Price (EGP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 2450.00"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Discount Percentage */}
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Promotional Bundle Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 15"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Brand Selector */}
              <FormField
                control={form.control}
                name="productBrandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Select Manufacturer / Brand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#020617] border-indigo-500/20 text-white rounded-xl py-6">
                          <SelectValue placeholder="Choose premium supplement brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#020617] border-slate-800 text-white">
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={String(brand.id)} className="hover:bg-indigo-500/10 focus:bg-indigo-500/10 text-white font-semibold cursor-pointer">
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Type Selector */}
              <FormField
                control={form.control}
                name="productTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Select Category / Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#020617] border-indigo-500/20 text-white rounded-xl py-6">
                          <SelectValue placeholder="Choose category target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#020617] border-slate-800 text-white">
                        {types.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)} className="hover:bg-indigo-500/10 focus:bg-indigo-500/10 text-white font-semibold cursor-pointer">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Flavour & Composition info */}
              <FormField
                control={form.control}
                name="flavor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Bundle Flavor Details (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Chocolate Cream & Berry Blast"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />

              {/* Active ingredient Composition */}
              <FormField
                control={form.control}
                name="activeIngredient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-extrabold text-slate-300">Active Contents/Ingedients (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Whey Protein + Pure Micronized Creatine"
                        className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-xl py-6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold" />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-extrabold text-slate-300">Bundle Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a highly persuasive copy about the bundle benefits, including items list..."
                      rows={5}
                      className="bg-[#020617] border-indigo-500/20 text-white placeholder:text-slate-600 rounded-2xl p-4 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold" />
                </FormItem>
              )}
            />

            {/* Multiple Images Upload & Previews */}
            <div className="space-y-4">
              <label className="text-sm font-extrabold text-slate-300 flex items-center gap-2">
                <UploadCloud size={20} className="text-indigo-400" />
                Upload Bundle Images (Multiple Files Supported)
              </label>
              
              <div className="relative">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-[#020617] border-indigo-500/20 text-slate-300 rounded-xl py-3 cursor-pointer file:bg-indigo-600 file:text-white file:border-none file:rounded-lg file:px-4 file:mr-4 hover:border-indigo-500/50 transition-colors"
                />
              </div>

              {/* Previews Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                  {previews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-indigo-500/30 group bg-slate-950/40 p-2 flex items-center justify-center">
                      <img src={url} className="max-h-full max-w-full object-contain rounded-xl" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors shadow-lg active:scale-90"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-7 rounded-2xl text-lg shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Creating commercial bundle...
                </>
              ) : (
                <>
                  <Layers size={22} />
                  Launch Premium Bundle
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
