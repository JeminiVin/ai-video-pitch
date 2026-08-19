'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'Starter',
      name: 'Starter',
      price: '₹2,499',
      features: [
        '10 Visual Pitches / month',
        'Standard GIF & Visual Overlay',
        'Basic Performance Badges',
        '1-Click Email Template Generator',
      ],
      popular: false,
    },
    {
      id: 'Agency Pro',
      name: 'Agency Pro',
      price: '₹6,999',
      features: [
        'Unlimited Visual Pitches',
        'High Resolution GIF & Video Overlay',
        'Advanced Conversion Badges & Audits',
        'Custom Branding & White-label Options',
        'Priority Email Support',
      ],
      popular: true,
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: '₹14,999',
      features: [
        'Everything in Agency Pro',
        'Dedicated API Access',
        'Custom Webhook Integrations',
        'Dedicated Account Manager',
        'SLA & Priority Infra',
      ],
      popular: false,
    },
  ];

  const handleRazorpayCheckout = async (planName: string) => {
    setLoadingPlan(planName);

    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          userEmail: '',
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setLoadingPlan(null);
        return;
      }

      // Razorpay Checkout Popup Configuration
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PitchPulse',
        description: `Subscription for ${planName} Plan`,
        order_id: data.orderId,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.href = '/pitch/dashboard?success=true';
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#0052FF',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      alert('Checkout error: ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-800 font-sans pb-20">
      {/* Load Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <div className="bg-[#0052FF] text-white pt-8 pb-24 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white text-[#0052FF] flex items-center justify-center font-black shadow-sm">
              <Zap className="h-5 w-5 fill-[#0052FF]" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Pitch<span className="text-yellow-300">Pulse</span>
            </span>
          </Link>
          <Link href="/" className="text-xs text-white/90 font-bold hover:underline">
            ← Back to Generator
          </Link>
        </div>

        <div className="max-w-2xl mx-auto text-center mt-10 space-y-3">
          <span className="bg-white/10 border border-white/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
            Flexible & Simple Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Upgrade Your Pitching Superpowers</h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Select a plan to unlock full potential and generate unlimited client proposals.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-3xl p-7 border ${
              plan.popular ? 'border-[#0052FF] shadow-2xl relative ring-2 ring-[#0052FF]/20' : 'border-slate-200 shadow-xl'
            } space-y-6 flex flex-col justify-between`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 right-6 bg-yellow-400 text-slate-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Most Popular
              </span>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-xs font-bold">/ month</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-100">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <Check className="h-4 w-4 text-[#0052FF] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleRazorpayCheckout(plan.id)}
              disabled={loadingPlan === plan.id}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                plan.popular
                  ? 'bg-[#0052FF] hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {loadingPlan === plan.id ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Opening Razorpay...</span>
                </>
              ) : (
                <>
                  <span>Subscribe to {plan.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto text-center mt-12 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Secured with Razorpay 256-bit SSL Encrypted Gateway</span>
      </div>
    </div>
  );
}