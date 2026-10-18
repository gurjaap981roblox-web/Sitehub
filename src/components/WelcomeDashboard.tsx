/**
 * SiteHub Welcome Dashboard & Project Creation Screen
 * Modeled after modern AI developer studios.
 * Headline: "Your next website starts with an idea."
 * Subheading: "Describe what you want. SiteHub turns your idea into a website you can preview, edit, and publish."
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Globe,
  Hotel,
  Layers,
  Layout,
  Newspaper,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { SiteDocument } from '../types/site';

interface WelcomeDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProject: (prompt: string, selectedModel: string) => void;
  recentProjects: SiteDocument[];
  onOpenProject: (site: SiteDocument) => void;
  onDeleteProject?: (siteId: string) => void;
  isGenerating?: boolean;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  isOpen,
  onClose,
  onStartProject,
  recentProjects,
  onOpenProject,
  onDeleteProject,
  isGenerating = false,
}) => {
  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');

  if (!isOpen) return null;

  const promptSuggestions = [
    {
      icon: Hotel,
      title: 'Luxury Hotel Booking',
      category: 'Hospitality',
      prompt: 'Build a luxury hotel booking platform with search, availability, room details and reservations.',
    },
    {
      icon: Zap,
      title: 'SaaS CRM & Pipeline',
      category: 'B2B Software',
      prompt: 'Build a SaaS CRM with contacts, sales pipelines, teams, permissions and analytics.',
    },
    {
      icon: ShoppingBag,
      title: 'Artisan Boutique Store',
      category: 'E-Commerce',
      prompt: 'Build an online store with inventory, shopping cart, checkout and order management.',
    },
    {
      icon: BookOpen,
      title: 'Online Learning LMS',
      category: 'Education',
      prompt: 'Build an online learning platform with courses, lessons, quizzes and student progress.',
    },
    {
      icon: Newspaper,
      title: 'Multilingual News Magazine',
      category: 'Media & Editorial',
      prompt: 'Build a multilingual news platform with categories, search, article pages and an editorial dashboard.',
    },
    {
      icon: Building2,
      title: 'Architectural Portfolio',
      category: 'Agency & Creative',
      prompt: 'Build a minimalist architectural studio portfolio with curated project gallery, spatial layouts, and client inquiry desk.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;
    onStartProject(promptText.trim(), selectedModel);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 select-none animate-in fade-in duration-200">
      {/* Top Bar with Logo & Close */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-neutral-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 p-[1px] shadow-lg shadow-indigo-950/50">
            <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Site<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">Hub</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI ENGINE READY
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Describe it. Build it. Launch it.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Return to Studio Workspace"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your next website starts with an idea.
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Describe what you want. SiteHub turns your idea into a website you can preview, edit, and publish.
          </p>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Build a luxury hotel booking website with search, availability, room details and reservations..."
              className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-white placeholder-neutral-500 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors resize-none shadow-inner leading-relaxed"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1.5 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Model Engine:
              </span>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={isGenerating}
                className="text-xs bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="auto">⚡ Auto (Gemini 3.8 Flash / Smart Router)</option>
                <option value="gemini">Google Gemini 3.8 Flash (High Speed & Code)</option>
                <option value="nemotron">Nemotron 3 Ultra (Architecture & Planner)</option>
                <option value="deepseek">DeepSeek V4.1 Flash (Coding Fast)</option>
                <option value="glm">GLM 5.1 (Stronger Coding)</option>
                <option value="mock">Built-in Universal Synthesizer (Offline / Free)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !promptText.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isGenerating ? 'Synthesizing Project...' : 'Build Website'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Prompt Suggestions & Templates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Popular Project Blueprints
            </span>
            <span className="text-[11px] text-neutral-500">Click any card to populate prompt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {promptSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(item.prompt)}
                  className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-indigo-500/50 hover:bg-neutral-900 transition-all text-left flex flex-col justify-between group space-y-3"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800/80">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Projects List */}
        {recentProjects.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Recent Projects ({recentProjects.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentProjects.map(p => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div
                    onClick={() => onOpenProject(p)}
                    className="flex-1 cursor-pointer space-y-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-200 group-hover:text-indigo-300 truncate transition-colors">
                        {p.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">v{p.version}</span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {p.description || `${p.pages?.length || 1} pages • ${p.category || 'website'}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProject(p)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all"
                    >
                      Open
                    </button>
                    {onDeleteProject && recentProjects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
