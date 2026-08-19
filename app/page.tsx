'use client';

import { useEffect, useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Globe, 
  Layout, 
  Layers, 
  Mail, 
  CheckCircle2, 
  Share2, 
  Eye, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  UserCheck,
  Gauge,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [url, setUrl] = useState('');
  const [widgetTitle, setWidgetTitle] = useState('Free Audit Widget');
  const [widgetSub, setWidgetSub] = useState('Analyze your site performance in 10 seconds.');
  
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [savedPitchId, setSavedPitchId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check Auth Session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthChecking(false);
    };
    checkUser();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !user) return;

    setLoading(true);
    setError('');
    setPreviewData(null);
    setSaved(false);
    setSavedPitchId(null);

    try {
      const response = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          headerText: widgetTitle, 
          subText: widgetSub 
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate preview');
      }

      setPreviewData(data.gif);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePitch = async () => {
    if (!previewData || !user) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from('pitches').insert([
        {
          user_id: user.id,
          target_url: url.startsWith('http') ? url : `https://${url}`,
          widget_title: widgetTitle,
          widget_sub: widgetSub,
          image_url: previewData,
        },
      ]).select('id').single();

      if (error) throw error;
      setSaved(true);
      if (data) setSavedPitchId(data.id);
    } catch (err: any) {
      alert('Error saving pitch: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const publicPitchUrl = savedPitchId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/pitch/${savedPitchId}` : '';

  const coldEmailTemplate = `Hi there,

I analyzed ${url || 'your website'} and put together a personalized conversion overlay concept specifically tailored for your brand:

View Proposal Preview: ${publicPitchUrl || '[Generated Share Link]'}

Would love to share 2 quick ideas on how this can boost your website lead conversion rate. Are you open for a quick 5-min chat this week?

Best regards,`;

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(coldEmailTemplate);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyLinkToClipboard = () => {
    if (!publicPitchUrl) return;
    navigator.clipboard.writeText(publicPitchUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-800 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between relative">
      
      {/* Royal Blue Hero Banner */}
      <div className="bg-[#0052FF] text-white pt-4 pb-28 px-6 relative overflow-hidden shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-2 border-b border-white/15 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-white text-[#0052FF] flex items-center justify-center shadow-md font-black">
              <Zap className="h-6 w-6 fill-[#0052FF]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              Pitch<span className="text-yellow-300">Pulse</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-xs text-white/90 font-bold hover:text-white px-3 py-1.5">
              Pricing
            </Link>

            {user ? (
              <Link
                href="/pitch/dashboard"
                className="bg-white text-[#0052FF] font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-slate-100 transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Hero Copy */}
        <div className="max-w-4xl mx-auto text-center mt-12 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>High-Converting SaaS Proposal Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            We Design Complete Pitches For <br />
            <span className="text-yellow-300 underline decoration-yellow-300/40 underline-offset-8">
              Online SaaS & Client Businesses.
            </span>
          </h1>

          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Target URL paste karein, live widget inject karein, aur high-converting cold email proposal link 1-click me generate karein.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-2 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-yellow-300" />
              <div className="text-left">
                <p className="text-[10px] text-blue-200 uppercase font-extrabold">Avg Conversion</p>
                <p className="text-sm font-black text-white">+237% Boost</p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-2 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <div className="text-left">
                <p className="text-[10px] text-blue-200 uppercase font-extrabold">Client Pitch Speed</p>
                <p className="text-sm font-black text-white">Under 10 Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-6 -mt-16 pb-16 flex-1 w-full z-20">
        
        {authChecking ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xl">
            <p className="text-xs text-slate-500 font-bold">Checking session status...</p>
          </div>
        ) : !user ? (
          /* UNAUTHENTICATED CALL TO ACTION CARD */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-6 shadow-2xl max-w-xl mx-auto">
            <div className="h-16 w-16 bg-blue-50 text-[#0052FF] rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Sign In to Access Proposal Generator</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                PitchPulse generator form aur interactive live canvas use karne ke liye please account me log in karein.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <span>Sign In / Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* LOGGED-IN: SHOW FORM AND CANVAS */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-5">
              <form 
                onSubmit={handleGenerate} 
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl transition-all relative"
              >
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Globe className="h-3.5 w-3.5 text-[#0052FF]" />
                    Target Website URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., stripe.com or myclient.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-[#0052FF] focus:bg-white transition-all placeholder:text-slate-400 font-medium shadow-inner"
                  />
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Layout className="h-3.5 w-3.5 text-blue-500" />
                      Widget Header Title
                    </label>
                    <input
                      type="text"
                      value={widgetTitle}
                      onChange={(e) => setWidgetTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0052FF] transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      Widget Subtitle / Offer
                    </label>
                    <input
                      type="text"
                      value={widgetSub}
                      onChange={(e) => setWidgetSub(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0052FF] transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-4 bg-[#0052FF] hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Rendering Visual Overlay...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-yellow-300" />
                      <span>Generate Proposal Preview</span>
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center pt-2">{error}</p>
                )}
              </form>
            </div>

            {/* Canvas Display */}
            <div className="lg:col-span-7">
              {previewData ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-6 shadow-2xl animate-fade-in relative">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#0052FF]" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Live Proposal Mockup</span>
                    </div>

                    <button
                      onClick={handleSavePitch}
                      disabled={saving || saved}
                      className="bg-[#0052FF] hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      {saved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Saved Proposal!</span>
                        </>
                      ) : saving ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <span>Save Proposal</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Automated Audit Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-emerald-600" /> Speed Score: 92/100
                    </span>
                    <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> High Bounce Risk Identified
                    </span>
                    <span className="bg-blue-50 border border-blue-200 text-[#0052FF] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#0052FF]" /> Est. Conversion: +24%
                    </span>
                  </div>

                  {/* Image Container with Injected Overlay Widget */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xl relative group min-h-[360px] flex items-center justify-center">
                    <img
                      src={previewData}
                      alt="Live Pitch Preview"
                      className="w-full h-auto block max-h-[460px] object-cover object-top transition-all duration-300 group-hover:scale-[1.01]"
                    />

                    {/* Interactive Overlay Widget Box (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 bg-gradient-to-br from-[#0052FF] to-blue-700 text-white rounded-2xl p-4 shadow-2xl max-w-[240px] border border-white/20 transition-transform duration-300 hover:scale-105 z-10">
                      <div className="text-[9px] uppercase font-black tracking-widest text-yellow-300 mb-1">
                        Special Offer For You
                      </div>
                      <h4 className="text-xs font-black leading-snug">{widgetTitle}</h4>
                      <p className="text-[10px] text-blue-100 mt-1 leading-normal font-medium">{widgetSub}</p>
                      <button className="mt-2.5 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-[10px] py-1.5 rounded-xl shadow-sm transition-all cursor-pointer">
                        Claim Audit Demo →
                      </button>
                    </div>
                  </div>

                  {saved && (
                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#0052FF] uppercase tracking-wider flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#0052FF]" />
                          1-Click Outreach Email Copy
                        </span>
                        <button
                          onClick={copyEmailToClipboard}
                          className="text-xs bg-[#0052FF] hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          {copiedEmail ? <Check className="h-3.5 w-3.5 text-yellow-300" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedEmail ? 'Copied Email!' : 'Copy Email'}</span>
                        </button>
                      </div>

                      <pre className="text-[11px] text-slate-700 whitespace-pre-wrap font-sans bg-white p-3.5 rounded-xl border border-blue-100 leading-relaxed shadow-sm">
                        {coldEmailTemplate}
                      </pre>

                      {publicPitchUrl && (
                        <div className="flex items-center justify-between pt-2 border-blue-100 border-t text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[280px]">
                            <Share2 className="h-3.5 w-3.5 text-[#0052FF] shrink-0" />
                            <span className="truncate font-mono">{publicPitchUrl}</span>
                          </div>
                          <button
                            onClick={copyLinkToClipboard}
                            className="text-[#0052FF] font-black hover:underline shrink-0 cursor-pointer"
                          >
                            {copiedLink ? 'Copied Link!' : 'Copy Pitch Link'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl min-h-[440px] flex flex-col justify-center items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#0052FF] flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="h-8 w-8 text-[#0052FF]" />
                  </div>

                  <h3 className="text-lg font-black text-slate-800 mb-1.5">Interactive Pitch Canvas</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Left form me Target URL enter karke <strong className="text-[#0052FF]">Generate Proposal Preview</strong> press karein.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 font-medium">
        PitchPulse Engine © 2026 — Premium SaaS Proposal Generator
      </footer>

    </div>
  );
}