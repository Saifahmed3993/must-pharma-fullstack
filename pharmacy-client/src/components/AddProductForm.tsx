import { useState, useEffect } from "react";
import agent from "../api/agent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PackagePlus } from "lucide-react";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  activeIngredient: z.string(),
  flavor: z.string(),
  size: z.string().min(1, "Please specify the size (e.g., 30 Scoops, 2KG)"),
  price: z.number().min(0.1, "Price must be greater than 0"),
  discountPercentage: z.number().min(0).max(100, "Discount cannot exceed 100%"),
  productBrandId: z.string().min(1, "Please select a product brand"),
  productTypeId: z.string().min(1, "Please select a product type"),
  image: z
    .any()
    .refine((files) => files && files.length > 0, "Product image is required.")
    .refine(
      (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export default function AddProductForm() {
  const [brands, setBrands] = useState<CategoryItem[]>([]);
  const [types, setTypes] = useState<CategoryItem[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      activeIngredient: "",
      flavor: "",
      size: "",
      price: 0,
      discountPercentage: 0,
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
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchDropdownData();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("productBrandId", data.productBrandId);
      formData.append("productTypeId", data.productTypeId);
      formData.append("activeIngredient", data.activeIngredient || "");
      formData.append("discountPercentage", (data.discountPercentage ?? 0).toString());
      formData.append("flavor", data.flavor || "");
      formData.append("size", data.size || "");

      if (data.image && data.image[0]) {
        formData.append("pictureUrl", data.image[0]);
      }

      await agent.Products.create(formData);

      toast({
        title: "Product Added",
        description: `${data.name} saved successfully!`,
        className: "bg-teal-600 text-white",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={48} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-[#0f172a] p-8 rounded-2xl shadow-xl border border-indigo-500/10 transition-colors">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-indigo-400 flex items-center justify-center gap-2">
              <PackagePlus size={28} />
              Add New Medicine
            </h2>
            <p className="text-slate-400 mt-2">Fill in the details to add a new product to the inventory</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-slate-300">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Panadol Extra"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-slate-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter medicine details, usage, and warnings..."
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="price"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Price (EGP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...fieldProps}
                      value={value}
                      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="discountPercentage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...fieldProps}
                      value={value}
                      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="activeIngredient"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-slate-300">Active Ingredient (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Paracetamol 500mg, Caffeine 65mg"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Size / Servings</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 60 Scoops, 2.2 KG, 90 Tablets"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="flavor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Flavor (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Double Rich Chocolate, Watermelon"
                      className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Product Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-[#020617] border border-indigo-500/20 text-white file:text-indigo-400"
                      {...fieldProps}
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="productBrandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Company (Brand)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#020617] border border-indigo-500/20">
                      {brands.map(b => (
                        <SelectItem key={b.id} value={b.id.toString()} className="text-slate-200 focus:bg-indigo-600">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="productTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Dosage Form (Type)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#020617] border border-indigo-500/20 text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#020617] border border-indigo-500/20">
                      {types.map(t => (
                        <SelectItem key={t.id} value={t.id.toString()} className="text-slate-200 focus:bg-indigo-600">
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] mt-4"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </div>
            ) : "Save Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}