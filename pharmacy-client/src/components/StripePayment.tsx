import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface StripePaymentProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
}

export default function StripePayment({ onSuccess, amount }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        setProcessing(false);
        return;
    }

    // هنا المفروض نكلم الباك اند نكريت PaymentIntent ونعمل Confirm
    // بس للتجربة، هنفترض إن العملية نجحت
    setTimeout(() => {
        setProcessing(false);
        onSuccess("pi_mock_12345");
    }, 2000);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1e293b", // Slate 800
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: "#94a3b8", // Slate 400
        },
      },
      invalid: {
        color: "#ef4444", // Red 500
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4 text-teal-600 dark:text-teal-400 font-bold text-sm uppercase tracking-wider">
          <ShieldCheck size={18} />
          Secure Card Payment
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-teal-500 transition-all">
          <CardElement options={cardElementOptions} />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-2">
        <span className="flex items-center gap-1 italic">
          <ShieldCheck size={14} className="text-teal-500" />
          Encrypted by Stripe
        </span>
        <span className="font-bold">Total: {amount} EGP</span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={processing || !stripe || !elements}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-900/20 transition-all active:scale-95"
      >
        {processing ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="animate-spin" />
            Processing Payment...
          </div>
        ) : (
          `Pay ${amount} EGP`
        )}
      </Button>
    </div>
  );
}
