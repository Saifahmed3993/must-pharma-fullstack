import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Mail, Lock, Loader2, ArrowLeft, MapPin, Phone, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "../context/AccountContext";

const passwordRegex = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).*$/;

const registerSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(11, "Phone number is required"),
  password: z.string().regex(passwordRegex, "Password must have 1 Uppercase, 1 Lowercase, 1 number, 1 special character (6-10 chars)"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  street: z.string().min(2, "Street is required"),
  zipCode: z.string().min(5, "Zip Code is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { user } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      city: "Giza",
      country: "Egypt",
      street: "",
      zipCode: "",
    },
  });

  const onRegister = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await axios.post("https://localhost:5011/api/Account/register", values);
      toast({
        title: "Account Created!",
        description: "Registration successful. Please log in.",
        className: "bg-indigo-600 text-white border-none shadow-2xl"
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Register error", error);
      const errors = error.response?.data?.errors;
      const message = errors ? Object.values(errors).flat().join(", ") : (error.response?.data?.message || "Registration failed.");
      
      toast({
        title: "Error 400",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20 p-8 md:p-12 bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-indigo-500/10 transition-colors relative overflow-hidden">
      {/* Background soft glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full"></div>

      <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm font-bold transition-colors group w-fit relative z-10">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </Link>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl font-black text-white tracking-tight">Create Pharmacy Account</h2>
        <p className="text-slate-400 mt-2 font-medium">Please provide your details and delivery address</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRegister)} className="space-y-8 relative z-10">
          
          <div className="space-y-6">
            <h3 className="text-lg font-black text-indigo-400 border-b border-indigo-500/10 pb-3 flex items-center gap-2">
              <User size={20} className="text-indigo-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="displayName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Display Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Ahmed Nasr" 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input 
                        className="pl-11 h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                        placeholder="email@example.com" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ahmed" 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nasr" 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input 
                        className="pl-11 h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                        placeholder="01xxxxxxxxx" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input 
                        className="pl-11 h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                        type="password" 
                        placeholder="Pa$$w0rd" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-indigo-400 border-b border-indigo-500/10 pb-3 flex items-center gap-2">
              <MapPin size={20} className="text-indigo-500" /> Shipping Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Country</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">City</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="street" render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel className="font-bold text-slate-300">Street Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <Input 
                        className="pl-11 h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                        placeholder="10 Tahrir St." 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="zipCode" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-300">Zip Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345" 
                      {...field} 
                      className="h-12 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] mt-6 border-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </div>
            ) : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
