/**
 * MediaWorkspace Component
 * AI Media Generation Studio for creating visual assets, photography, and illustrations for websites.
 */

import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { SiteDocument } from '../types/site';

interface MediaWorkspaceProps {
  currentSite: SiteDocument;
  onUpdateHeroImage: (imageUrl: string) => void;
}

export const MediaWorkspace: React.FC<MediaWorkspaceProps> = ({
  currentSite,
  onUpdateHeroImage,
}) => {
  const [prompt, setPrompt] = useState(
    'Luxury modern architectural resort with private infinity pool and serene evening lighting'
  );
  const [style, setStyle] = useState<'photorealistic' | 'minimalist' | 'isometric' | 'editorial' | 'vector'>('photorealistic');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '4:3' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<
    { id: string; url: string; prompt: string; style: string; applied: boolean }[]
  >([
    {
      id: 'ast-1',
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
      prompt: 'Luxury architectural sanctuary with private terrace and ocean view',
      style: 'Photorealistic',
      applied: false,
    },
    {
      id: 'ast-2',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80',
      prompt: 'Enterprise SaaS analytics dashboard and pipeline metrics graph',
      style: 'Editorial',
      applied: false,
    },
    {
      id: 'ast-3',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      prompt: 'Minimalist concrete villa with warm wood textures and architectural geometry',
      style: 'Minimalist',
      applied: false,
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const resp = await fetch('/api/ai/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      const data = await resp.json();
      if (data.imageUrl) {
        setGeneratedAssets(prev => [
          {
            id: `ast-${Date.now()}`,
            url: data.imageUrl,
            prompt,
            style,
            applied: false,
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      console.warn('Media generation failed:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToProject = (assetId: string, url: string) => {
    onUpdateHeroImage(url);
    setGeneratedAssets(prev =>
      prev.map(a => ({ ...a, applied: a.id === assetId }))
    );
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden select-none">
      {/* Media Studio Header */}
      <div className="h-12 px-6 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#0F1118]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <ImagePlus className="w-4 h-4 text-[#8B9BFF]" />
          <span className="font-bold text-[#F3F5FA]">AI Media Studio</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[#A1A8B8]">Visual Assets & Photography Generator</span>
        </div>
        <div className="text-xs text-[#737C90] font-mono">
          Target: <span className="text-[#F3F5FA]">{currentSite.name}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Generator Controls Card */}
        <form
          onSubmit={handleGenerate}
          className="p-5 rounded-2xl bg-[#131620] border border-[#292E3D] space-y-4 shadow-xl"
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA] flex items-center gap-1.5">
              <span>Visual Asset Prompt</span>
              <span className="text-[#737C90] font-normal lowercase">(website hero, cards, illustrations)</span>
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Modernist coffee roastery interior with warm sunlight and artisan espresso bar..."
              className="w-full bg-[#0B0D12] border border-[#292E3D] rounded-xl p-3 text-xs text-[#F3F5FA] placeholder-[#737C90] resize-none focus:outline-none focus:border-[#8B9BFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Style Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#A1A8B8]">Style</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0B0D12] border border-[#292E3D] rounded-xl text-[11px]">
                {(['photorealistic', 'minimalist', 'editorial', 'isometric', 'vector'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`py-1.5 px-2 capitalize rounded-lg transition-colors ${
                      style === s
                        ? 'bg-[#8B9BFF] text-black font-bold'
                        : 'text-[#737C90] hover:text-[#F3F5FA]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[#A1A8B8]">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0B0D12] border border-[#292E3D] rounded-xl text-[11px]">
                {(['16:9', '1:1', '4:3', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-2 rounded-lg transition-colors font-mono ${
                      aspectRatio === ratio
                        ? 'bg-[#8B9BFF] text-black font-bold'
                        : 'text-[#737C90] hover:text-[#F3F5FA]'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#292E3D]/60">
            <span className="text-[10px] text-[#737C90]">
              Assets are optimized for high-resolution responsive web displays.
            </span>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2 rounded-xl bg-[#8B9BFF] hover:bg-[#A5B4FC] disabled:opacity-40 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-[#8B9BFF]/20"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating Asset...' : 'Generate Visual Asset'}</span>
            </button>
          </div>
        </form>

        {/* Generated Assets Gallery */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F3F5FA]">
              Generated Assets & Photography ({generatedAssets.length})
            </h2>
            <span className="text-[10px] text-[#737C90]">1-click assign to project</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generatedAssets.map(asset => (
              <div
                key={asset.id}
                className="rounded-2xl bg-[#131620] border border-[#292E3D] overflow-hidden group hover:border-[#8B9BFF]/60 transition-all shadow-xl flex flex-col"
              >
                <div className="aspect-video w-full bg-[#0B0D12] relative overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-mono text-[#F3F5FA]">
                    {asset.style}
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-[11px] text-[#A1A8B8] line-clamp-2 leading-relaxed">
                    {asset.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#292E3D]/60 text-xs">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      className="text-[10px] text-[#737C90] hover:text-[#F3F5FA] flex items-center gap-1"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleApplyToProject(asset.id, asset.url)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                        asset.applied
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#191D29] hover:bg-[#8B9BFF] hover:text-black text-[#F3F5FA] border border-[#292E3D]'
                      }`}
                    >
                      {asset.applied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Active in Hero</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Set in Hero</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
