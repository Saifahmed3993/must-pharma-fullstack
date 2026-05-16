import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccount } from "../context/AccountContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LockKeyhole, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, login } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast({
        title: "Welcome Back!",
        description: "Login successful.",
        className: "bg-indigo-600 text-white border-none shadow-2xl"
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your email and password.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 md:p-12 bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-indigo-500/10 transition-colors relative overflow-hidden">
      {/* Background radial soft light glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="bg-[#020617] border border-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <LockKeyhole size={30} className="text-indigo-400" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 mt-2 font-medium">Sign in to manage your pharmacy account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 font-bold">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input 
                      className="pl-11 h-14 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                      placeholder="saif@example.com" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 font-bold">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input 
                      className="pl-11 h-14 bg-[#020617] text-white border border-indigo-500/10 placeholder-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl transition-all shadow-inner font-semibold" 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95 border-none mt-4"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </div>
            ) : "Sign In"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400 font-medium">
              Don't have an account? <Link to="/register" className="text-indigo-400 font-bold hover:underline cursor-pointer">Register now</Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
