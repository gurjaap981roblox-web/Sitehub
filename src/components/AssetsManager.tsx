/**
 * AssetsManager Component
 * Media asset explorer: Curated photography, file uploads, and CDN links.
 */

import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Search,
  Upload,
} from 'lucide-react';

export const AssetsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const curatedAssets = [
    {
      id: 'img-1',
      title: 'Charcoal Heritage Dining',
      category: 'Culinary',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-2',
      title: 'Botanical Clay Pottery & Candle',
      category: 'Crafts',
      url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-3',
      title: 'Cinematic Royal Portrait',
      category: 'Photography',
      url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-4',
      title: 'Varanasi Ghats Morning Light',
      category: 'Travel & Art',
      url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-5',
      title: 'Minimalist Soy Candle Jar',
      category: 'Products',
      url: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'img-6',
      title: 'Modern Architecture Studio',
      category: 'Spaces',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const filtered = curatedAssets.filter(
    a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 p-6 overflow-y-auto text-xs">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Media & Asset Library</h2>
            </div>
            <p className="text-neutral-400 mt-1">
              Curated photography, responsive illustrations, and optimized web imagery ready for your sections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('File upload simulated. You can also paste any public image URL directly in section props.')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by title or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder-neutral-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Assets Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map(asset => (
            <div
              key={asset.id}
              className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-950">
                <img
                  src={asset.url}
                  alt={asset.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 backdrop-blur-md text-neutral-200 border border-white/10">
                  {asset.category}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between gap-2">
                <span className="font-semibold text-white truncate">{asset.title}</span>
                <button
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 text-[11px] shrink-0"
                >
                  {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
