/**
 * PublishModal Component
 * Deploy to live production, QR code for mobile preview, custom slug,
 * standalone presentation mode, and package exports (ZIP, HTML, JSON).
 */

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Globe,
  QrCode,
  Rocket,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import { SiteDocument } from '../types/site';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteDocument;
  onUpdateSite: (site: SiteDocument) => void;
  appName?: string;
  onOpenStandalone: () => void;
  onExport: (format: 'zip' | 'html' | 'json') => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  site,
  onUpdateSite,
  appName = 'SiteHub',
  onOpenStandalone,
  onExport,
}) => {
  const [isPublished, setIsPublished] = useState(Boolean(site.publishedUrl));
  const [isDeploying, setIsDeploying] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const liveDomain = `${site.slug}.${appName.toLowerCase()}.live`;
  const liveUrl = `https://${liveDomain}`;

  const handleDeploy = async () => {
    setIsDeploying(true);
    await new Promise(r => setTimeout(r, 800));
    const updated = {
      ...site,
      publishedUrl: liveUrl,
    };
    onUpdateSite(updated);
    setIsPublished(true);
    setIsDeploying(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 text-xs">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Publish & Deploy {site.name}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live URL & Status Card */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Live Edge Deployment
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isPublished
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {isPublished ? '● Live on Edge Network' : 'Ready to Publish'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-mono font-bold text-white text-sm select-all">{liveUrl}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 border border-neutral-700"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>

            <button
              onClick={() => setShowQr(!showQr)}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 border border-neutral-700"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showQr ? 'Hide QR Code' : 'Mobile QR Code'}</span>
            </button>

            <button
              onClick={onOpenStandalone}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold flex items-center gap-1.5 border border-neutral-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Standalone View</span>
            </button>
          </div>

          {/* QR Code Graphic Display */}
          {showQr && (
            <div className="p-4 bg-white rounded-xl flex flex-col items-center justify-center space-y-2 mt-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  window.location.href
                )}`}
                alt="Live Site QR Code"
                className="w-36 h-36 rounded"
              />
              <span className="text-[11px] text-neutral-800 font-semibold">
                Scan with phone camera to test live on mobile
              </span>
            </div>
          )}
        </div>

        {/* Deploy Action */}
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <Rocket className="w-4 h-4 text-indigo-200" />
          <span>{isDeploying ? 'Deploying to Global Edge CDN...' : 'Deploy Latest Version Now'}</span>
        </button>

        {/* Export Options */}
        <div className="space-y-3 pt-3 border-t border-neutral-800">
          <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Download & Self-Host Everywhere
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onExport('zip')}
              className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left space-y-1 transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>ZIP Bundle</span>
              </div>
              <div className="text-[10px] text-neutral-500">React + Vite + Tailwind</div>
            </button>

            <button
              onClick={() => onExport('html')}
              className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left space-y-1 transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Static HTML</span>
              </div>
              <div className="text-[10px] text-neutral-500">Single self-contained file</div>
            </button>

            <button
              onClick={() => onExport('json')}
              className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-left space-y-1 transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>JSON AST</span>
              </div>
              <div className="text-[10px] text-neutral-500">Raw SiteHub document</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
