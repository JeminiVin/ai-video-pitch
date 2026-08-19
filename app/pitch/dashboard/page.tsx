'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Zap, Eye, Clock, Share2, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DashboardPage() {
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPitches();
  }, []);

  const fetchUserPitches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/login';
      return;
    }

    const { data, error } = await supabase
      .from('pitches')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setPitches(data);
    }
    setLoading(false);
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/pitch/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-800 font-sans pb-16">
      {/* Top Navigation */}
      <header className="bg-[#0052FF] text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white text-[#0052FF] flex items-center justify-center font-black">
              <Zap className="h-4 w-4 fill-[#0052FF]" />
            </div>
            <span className="font-black text-lg tracking-tight">PitchPulse CRM</span>
          </Link>

          <Link
            href="/"
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Create New Pitch</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Lead Outreach Dashboard</h1>
            <p className="text-xs text-slate-500">Track client views & pitch engagement in real-time.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm text-center">
              <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Pitches</p>
              <p className="text-base font-black text-slate-900">{pitches.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm text-center">
              <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Views</p>
              <p className="text-base font-black text-[#0052FF]">
                {pitches.reduce((acc, p) => acc + (p.view_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Pitch List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs font-bold text-slate-400 border border-slate-200 shadow-sm">
            Loading your outreach pitches...
          </div>
        ) : pitches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-slate-700">Abhi tak koi pitch save nahi hua hai.</p>
            <Link
              href="/"
              className="inline-block bg-[#0052FF] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
            >
              Generate First Proposal
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pitches.map((p) => {
              const isViewed = (p.view_count || 0) > 0;
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 truncate max-w-xs">{p.target_url}</span>
                      <a href={p.target_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Widget: <span className="text-slate-800 font-bold">{p.widget_title}</span>
                    </p>
                  </div>

                  {/* Realtime Engagement Metrics */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${isViewed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Eye className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400">Status</p>
                        <p className={`text-xs font-black ${isViewed ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {isViewed ? `Viewed (${p.view_count}x)` : 'Not Viewed Yet'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-[#0052FF] rounded-xl">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400">Last Active</p>
                        <p className="text-xs font-bold text-slate-700">
                          {p.last_viewed_at ? new Date(p.last_viewed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => copyLink(p.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedId === p.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-slate-500" />}
                      <span>{copiedId === p.id ? 'Copied!' : 'Share Link'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}