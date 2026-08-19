'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Zap, Building2, Link as LinkIcon, Image as ImageIcon, Save, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SettingsPage() {
  const [agencyName, setAgencyName] = useState('');
  const [agencyLogoUrl, setAgencyLogoUrl] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadAgencyProfile();
  }, []);

  const loadAgencyProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/login';
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (data) {
      setAgencyName(data.agency_name || '');
      setAgencyLogoUrl(data.agency_logo_url || '');
      setBookingUrl(data.booking_url || '');
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      agency_name: agencyName,
      agency_logo_url: agencyLogoUrl,
      booking_url: bookingUrl,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Error saving settings: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FF] flex items-center justify-center text-xs font-bold text-slate-500">
        Loading Agency Settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-800 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-[#0052FF] text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/pitch/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white text-[#0052FF] flex items-center justify-center font-black">
              <Zap className="h-4 w-4 fill-[#0052FF]" />
            </div>
            <span className="font-black text-lg tracking-tight">PitchPulse Agency Settings</span>
          </Link>

          <Link
            href="/pitch/dashboard"
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-xl mx-auto px-6 pt-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full">
              Pro White-Label Feature
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Agency Branding</h1>
            <p className="text-xs text-slate-500">
              Set up your agency name and logo. Your client pitches will feature your branding instead of PitchPulse.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Agency Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Agency / Business Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Nexus Growth Agency"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            {/* Logo Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Agency Logo Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com/logo.png"
                value={agencyLogoUrl}
                onChange={(e) => setAgencyLogoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            {/* Booking / Calendly Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Book a Call Link (Calendly / Website)</span>
              </label>
              <input
                type="url"
                placeholder="https://calendly.com/your-agency/15min"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0052FF]"
              />
            </div>

            {/* Live Logo Preview Box */}
            {agencyLogoUrl && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img src={agencyLogoUrl} alt="Logo Preview" className="h-8 max-w-[120px] object-contain" />
                <span className="text-[11px] text-slate-500 font-bold">Logo Preview</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <span>Saving...</span>
              ) : success ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>Branding Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Agency Branding</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}