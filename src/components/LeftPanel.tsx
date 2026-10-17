/**
 * LeftPanel Component
 * AI Prompt Box, Smart Router Model Picker, Generation Timeline, Suggested Prompts, and System Instructions.
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Flame,
  Globe,
  Loader2,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { LanguageCode, SiteDocument } from '../types/site';
import { GenerationStep } from '../services/aiRouter';
import { translations } from '../lib/translations';

interface LeftPanelProps {
  site: SiteDocument;
  onUpdateSite: (newSite: SiteDocument) => void;
  isGenerating: boolean;
  activeSteps: GenerationStep[];
  currentLang: LanguageCode;
  onRunPrompt: (prompt: string, model: string) => Promise<void>;
  loopWarning: string | null;
  onClearLoopWarning: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  site,
  onUpdateSite,
  isGenerating,
  activeSteps,
  currentLang,
  onRunPrompt,
  loopWarning,
  onClearLoopWarning,
}) => {
  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [showSystemInstructions, setShowSystemInstructions] = useState(false);
  const [systemInstructionsText, setSystemInstructionsText] = useState(
    site.systemInstructions || 'Create modern, clean, production-grade web interfaces with high contrast and smooth micro-interactions.'
  );

  const t = translations[currentLang] || translations.en;

  const quickPrompts = [
    { label: '🔥 Add Table Booking Form', prompt: 'Add an interactive table reservation section with date picker, time slots, and guest counter' },
    { label: '💳 Add 3-Tier Pricing Table', prompt: 'Add a 3-tier pricing matrix with monthly plans and feature checklist' },
    { label: '🛍️ Add Candle Store & Cart', prompt: 'Add an artisan e-commerce product catalog with shopping cart' },
    { label: '🌙 Make Hero Darker', prompt: 'Make the hero section darker with deep carbon background and gold accents' },
    { label: '🇮🇳 Translate to Hindi', prompt: 'Translate the entire site copy into Hindi (हिन्दी) with Devanagari typography' },
    { label: '🌾 Translate to Punjabi', prompt: 'Translate the entire site copy into Punjabi (ਪੰਜਾਬੀ) with Gurmukhi typography' },
    { label: '❓ Add FAQ Accordion', prompt: 'Add an expandable FAQ section with 3 customer questions and answers' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;
    onRunPrompt(promptText.trim(), selectedModel);
    setPromptText('');
  };

  const handleSaveSystemInstructions = () => {
    onUpdateSite({
      ...site,
      systemInstructions: systemInstructionsText,
    });
    setShowSystemInstructions(false);
  };

  return (
    <aside className="w-80 md:w-96 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between shrink-0 h-full overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            AI Architect & Builder
          </h2>
        </div>

        {/* Model Picker */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            disabled={isGenerating}
            className="text-xs bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-neutral-300 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="auto">⚡ Auto (Smart Router)</option>
            <option value="deepseek">DeepSeek V4.1 Flash (Coding Fast)</option>
            <option value="glm">GLM 5.1 (Stronger Coding)</option>
            <option value="nemotron">Nemotron 3 Ultra (Planner)</option>
            <option value="general">Kira General Strong</option>
            <option value="mock">Built-in Mock AI (Free / Offline)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Prompt Box + Suggestions + Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loop Protection Banner */}
        {loopWarning && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2 text-amber-300">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Loop Protection Active</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">{loopWarning}</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedModel('glm');
                  onClearLoopWarning();
                }}
                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded font-semibold text-[10px]"
              >
                Switch to GLM 5.1
              </button>
              <button
                onClick={onClearLoopWarning}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              disabled={isGenerating}
              placeholder={t.promptPanel.placeholder}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none shadow-inner"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSystemInstructions(!showSystemInstructions)}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Project Rules</span>
              {showSystemInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              type="submit"
              disabled={isGenerating || !promptText.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t.promptPanel.buildButton}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Collapsible System Instructions Editor */}
        {showSystemInstructions && (
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
            <div className="font-semibold text-neutral-300">Project System Instructions</div>
            <p className="text-[11px] text-neutral-500">
              Injected into every AI call for this project (tone, aesthetic guidelines, typography, industry specifics).
            </p>
            <textarea
              rows={3}
              value={systemInstructionsText}
              onChange={e => setSystemInstructionsText(e.target.value)}
              className="w-full p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSaveSystemInstructions}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-semibold"
            >
              Save Instructions
            </button>
          </div>
        )}

        {/* Live Generation Progress Steps */}
        {isGenerating && activeSteps.length > 0 && (
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-indigo-500/40 space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                Active Build Pipeline
              </span>
              <span className="font-mono text-[10px] text-neutral-400">Streaming</span>
            </div>
            <div className="space-y-2">
              {activeSteps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {s.status === 'in_progress' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-medium text-neutral-200">{s.step}</div>
                    {s.details && <div className="text-[11px] text-neutral-400">{s.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Starters / Suggested Prompts */}
        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Actions</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                disabled={isGenerating}
                onClick={() => onRunPrompt(item.prompt, selectedModel)}
                className="w-full text-left p-2 rounded-lg bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800/80 text-xs text-neutral-300 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300">Run</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info Footprint */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Dual-Engine Ready</span>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">Personal Unlimited</span>
      </div>
    </aside>
  );
};
