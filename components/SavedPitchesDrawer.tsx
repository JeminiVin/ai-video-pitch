'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, ExternalLink, Download, Trash2, Code, Check } from 'lucide-react';

interface Pitch {
  id: string;
  target_url: string;
  widget_title: string;
  widget_sub: string;
  theme: string;
  format: string;
  image_url: string;
  created_at: string;
}

interface SavedPitchesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function SavedPitchesDrawer({ isOpen, onClose, userId }: SavedPitchesDrawerProps) {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchPitches();
    }
  }, [isOpen, userId]);

  const fetchPitches = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPitches(data || []);
    } catch (err: any) {
      console.error('Error fetching pitches:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return;

    try {
      const { error } = await supabase.from('pitches').delete().eq('id', id);
      if (error) throw error;
      setPitches((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete pitch: ' + err.message);
    }
  };

  const copyEmbedHtml = (pitch: Pitch) => {
    const htmlSnippet = `<a href="${pitch.target_url}" target="_blank" rel="noopener noreferrer"><img src="${pitch.image_url}" alt="Audit Preview for ${pitch.target_url}" style="max-width:100%; height:auto; border-radius:8px;" /></a>`;
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedId(pitch.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyShareLink = (pitchId: string) => {
    const shareableUrl = `${window.location.origin}/pitch/${pitchId}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLinkId(pitchId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 h-full shadow-2xl border-l border-white/10 p-6 flex flex-col justify-between text-white overflow-y-auto font-sans">
        <div>
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime-400" />
              Saved Pitches ({pitches.length})
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-sky-200/70">
              <span className="h-5 w-5 border-2 border-lime-400 border-t-transparent rounded-full animate-spin inline-block mb-2" />
              <p>Loading your saved pitches...</p>
            </div>
          ) : pitches.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No saved pitches found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {pitches.map((pitch) => (
                <div 
                  key={pitch.id} 
                  className="bg-slate-950 border border-white/10 rounded-2xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <a 
                      href={pitch.target_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs font-semibold text-lime-400 truncate max-w-[200px] hover:underline flex items-center gap-1"
                    >
                      {pitch.target_url}
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-sky-200">
                      {pitch.format || 'PNG'}
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                    <img 
                      src={pitch.image_url} 
                      alt="Pitch Preview" 
                      className="w-full h-auto block" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => copyEmbedHtml(pitch)}
                      className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        copiedId === pitch.id 
                          ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold' 
                          : 'bg-slate-800 hover:bg-slate-700 text-sky-100 border-white/10'
                      }`}
                    >
                      {copiedId === pitch.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied HTML!</span>
                        </>
                      ) : (
                        <>
                          <Code className="h-3.5 w-3.5 text-lime-400" />
                          <span>Copy HTML</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => copyShareLink(pitch.id)}
                      className={`text-xs font-semibold py-2 px-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        copiedLinkId === pitch.id 
                          ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold' 
                          : 'bg-slate-800 hover:bg-slate-700 text-sky-100 border-white/10'
                      }`}
                    >
                      {copiedLinkId === pitch.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied Link!</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3.5 w-3.5 text-lime-400" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <a
                      href={pitch.image_url}
                      download={`pitch-${pitch.id}.${pitch.format || 'png'}`}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download File</span>
                    </a>

                    <button
                      onClick={() => handleDelete(pitch.id)}
                      className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 p-1"
                      title="Delete Pitch"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}