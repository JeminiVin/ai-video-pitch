'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Zap, Calendar, ExternalLink } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function PublicPitchPage() {
  const { id } = useParams();
  const [pitch, setPitch] = useState<any>(null);
  const [agencyProfile, setAgencyProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPitchAndBranding = async () => {
      try {
        // 1. Fetch Pitch Details
        const { data: pitchData } = await supabase
          .from('pitches')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (pitchData) {
          setPitch(pitchData);

          // 2. Fetch Creator Agency's Profile for White-Labeling
          if (pitchData.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', pitchData.user_id)
              .maybeSingle();

            if (profileData) {
              setAgencyProfile(profileData);
            }
          }

          // 3. Track View Count
          await supabase
            .from('pitches')
            .update({
              view_count: (pitchData.view_count || 0) + 1,
              last_viewed_at: new Date().toISOString(),
            })
            .eq('id', id);
        }
      } catch (err) {
        console.error('Error fetching pitch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPitchAndBranding();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs font-bold">
        Loading Proposal Preview...
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400 text-xs font-bold">
        Proposal Not Found or Expired.
      </div>
    );
  }

  // Check if White-Label Branding exists
  const hasBranding = agencyProfile?.agency_name || agencyProfile?.agency_logo_url;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
      {/* Top Bar with Agency Branding */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {agencyProfile?.agency_logo_url ? (
            <img src={agencyProfile.agency_logo_url} alt="Agency Logo" className="h-7 max-w-[140px] object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-[#0052FF] flex items-center justify-center font-black">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
          )}
          <span className="font-black text-sm tracking-wide text-white">
            {agencyProfile?.agency_name || 'Visual Growth Concept'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {agencyProfile?.booking_url && (
            <a
              href={agencyProfile.booking_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-[#0052FF] hover:bg-blue-600 text-white font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Strategy Call</span>
            </a>
          )}

          {pitch.target_url && (
            <a
              href={pitch.target_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Visit Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
            Custom UI Overlay Concept
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Interactive Conversion Proposal</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Prepared for: <span className="text-white font-bold">{pitch.target_url}</span>
          </p>
        </div>

        {/* Mockup Canvas */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden relative group">
          <img
            src={pitch.image_url}
            alt="Pitch Preview"
            className="w-full h-auto block object-cover max-h-[500px]"
          />

          {/* Interactive Live Overlay Box */}
          <div className="absolute bottom-6 right-6 bg-gradient-to-br from-[#0052FF] to-blue-700 text-white rounded-2xl p-4 shadow-2xl max-w-[260px] border border-white/20">
            <div className="text-[9px] uppercase font-black tracking-widest text-yellow-300 mb-1">
              Live Widget Preview
            </div>
            <h4 className="text-xs font-black leading-snug">{pitch.widget_title}</h4>
            <p className="text-[10px] text-blue-100 mt-1 leading-normal font-medium">{pitch.widget_sub}</p>
            <button className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-[10px] py-1.5 rounded-xl shadow-sm transition-all cursor-pointer">
              Claim Offer Now →
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-[11px] text-slate-500 font-medium border-t border-slate-900">
        {hasBranding
          ? `Prepared by ${agencyProfile.agency_name} — Interactive Client Proposal`
          : 'Prepared for Client Review — Interactive Proposal Concept'}
      </footer>
    </div>
  );
}