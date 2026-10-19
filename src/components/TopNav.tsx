/**
 * TopNav Component
 * Top bar with editable site name, project switcher, device toggles, tab buttons, GitHub sync, Deploy, and Multilingual switcher.
 */

import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eye,
  FileCode,
  FolderGit2,
  FolderOpen,
  Globe,
  KeyRound,
  Laptop,
  Maximize2,
  Menu,
  Palette,
  Redo2,
  Rocket,
  Settings as SettingsIcon,
  Share2,
  Sliders,
  Smartphone,
  Sparkles,
  Tablet,
  Terminal,
  Undo2,
  Cpu,
  Zap,
} from 'lucide-react';
import { DeviceMode, LanguageCode, SiteDocument, WorkspaceTab } from '../types/site';
import { STARTER_TEMPLATES } from '../lib/templates';
import { translations } from '../lib/translations';

interface TopNavProps {
  appName: string;
  site: SiteDocument;
  onUpdateSiteName: (name: string) => void;
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  deviceMode: DeviceMode;
  onSelectDeviceMode: (mode: DeviceMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenGitHub: () => void;
  onOpenDeploy: () => void;
  onOpenSecrets: () => void;
  onOpenSettings: () => void;
  onSelectTemplate: (template: SiteDocument) => void;
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onExport: (format: 'zip' | 'html' | 'json') => void;
  onToggleMobileMenu?: () => void;
  onToggleMobileAi?: () => void;
  isMobileAiOpen?: boolean;
  isRunSettingsOpen?: boolean;
  onToggleRunSettings?: () => void;
  selectedModel?: string;
  hasValidApiKey?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  appName,
  site,
  onUpdateSiteName,
  activeTab,
  onSelectTab,
  deviceMode,
  onSelectDeviceMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenGitHub,
  onOpenDeploy,
  onOpenSecrets,
  onOpenSettings,
  onSelectTemplate,
  currentLang,
  onSelectLanguage,
  onExport,
  onToggleMobileMenu,
  onToggleMobileAi,
  isMobileAiOpen,
  isRunSettingsOpen,
  onToggleRunSettings,
  selectedModel = 'gemini-3.8-flash',
  hasValidApiKey = true,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(site.name);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const t = translations[currentLang] || translations.en;

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameValue.trim() && nameValue !== site.name) {
      onUpdateSiteName(nameValue.trim());
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="h-13 bg-[#0F1118] border-b border-[#292E3D] px-3 sm:px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Brand + Project Switcher + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 pr-2.5 sm:pr-3 border-r border-[#292E3D] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B9BFF] via-[#6366f1] to-violet-800 p-[1px] shadow-lg shadow-[#8B9BFF]/20 shrink-0">
            <div className="w-full h-full bg-[#0B0D12] rounded-[11px] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#8B9BFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-tight text-[#F3F5FA]">
              Site<span className="text-[#8B9BFF]">Hub</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#191D29] text-[#8B9BFF] border border-[#292E3D] font-mono">
              STUDIO
            </span>
          </div>
        </div>

        {/* Project Selector & Editable Title */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
              className="px-2 py-0.5 text-xs font-semibold bg-neutral-950 border border-indigo-500 rounded text-white focus:outline-none"
            />
          ) : (
            <button
              onClick={() => {
                setNameValue(site.name);
                setIsEditingName(true);
              }}
              title="Click to rename project"
              className="px-2 py-1 rounded text-xs font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <span>{site.name}</span>
              <span className="text-[10px] text-neutral-500 uppercase px-1.5 py-0.2 bg-neutral-800 rounded">
                v{site.version}
              </span>
            </button>
          )}

          {/* Template Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 text-xs flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {isTemplateMenuOpen && (
              <div className="absolute top-8 left-0 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 py-1">
                  Starter Templates
                </div>
                {STARTER_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      onSelectTemplate(tpl);
                      setIsTemplateMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-between"
                  >
                    <span className="font-medium">{tpl.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1 bg-neutral-950 rounded text-neutral-500">
                      {tpl.language}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Quick Workspace Switcher */}
      <div className="hidden lg:flex items-center gap-1 bg-[#131620] p-1 rounded-xl border border-[#292E3D]">
        <button
          onClick={() => onSelectTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-[#191D29] text-[#8B9BFF] font-semibold border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B9BFF]" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => onSelectTab('build')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'build'
              ? 'bg-[#191D29] text-[#8B9BFF] font-semibold border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Build</span>
        </button>

        <button
          onClick={() => onSelectTab('code')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'code'
              ? 'bg-[#191D29] text-[#8B9BFF] font-semibold border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Code</span>
        </button>

        <button
          onClick={() => onSelectTab('stream')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'stream'
              ? 'bg-[#191D29] text-[#8B9BFF] font-semibold border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stream</span>
        </button>

        <button
          onClick={() => onSelectTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'projects'
              ? 'bg-[#191D29] text-[#8B9BFF] font-semibold border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Projects</span>
        </button>
      </div>

      {/* Right: Device Modes, History, GitHub, Deploy & Settings */}
      <div className="flex items-center gap-2">
        {/* Device Viewport Toggle (Only in Visual Canvas mode) */}
        {activeTab === 'build' && (
          <div className="hidden sm:flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => onSelectDeviceMode('desktop')}
              title={t.devices.desktop}
              className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectDeviceMode('tablet')}
              title={t.devices.tablet}
              className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectDeviceMode('mobile')}
              title={t.devices.mobile}
              className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 border-r border-neutral-800 pr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title={t.actions.undo}
            className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title={t.actions.redo}
            className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="px-2 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1 border border-neutral-700/60"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase font-mono text-[11px]">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>
          {isLangMenuOpen && (
            <div className="absolute top-8 right-0 w-36 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
              <button
                onClick={() => {
                  onSelectLanguage('en');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'en' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>English</span>
                {currentLang === 'en' && <Check className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  onSelectLanguage('hi');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'hi' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {currentLang === 'hi' && <Check className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  onSelectLanguage('pa');
                  setIsLangMenuOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'pa' ? 'bg-indigo-600/30 text-indigo-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>ਪੰਜਾਬੀ (Punjabi)</span>
                {currentLang === 'pa' && <Check className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>

        {/* GitHub Sync Button */}
        <button
          onClick={onOpenGitHub}
          className="hidden lg:flex px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium items-center gap-1.5 border border-neutral-700/60 shadow-sm transition-all"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-neutral-300" />
          <span className="hidden xl:inline">{t.actions.saveToGitHub}</span>
        </button>

        {/* Export Dropdown */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 border border-neutral-700/60"
            title="Export bundle"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {isExportMenuOpen && (
            <div className="absolute top-8 right-0 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
              <button
                onClick={() => {
                  onExport('zip');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.actions.exportZip}</span>
              </button>
              <button
                onClick={() => {
                  onExport('html');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.actions.exportHtml}</span>
              </button>
              <button
                onClick={() => {
                  onExport('json');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.actions.exportJson}</span>
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          title={t.actions.share}
          className="hidden sm:flex p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs items-center gap-1 border border-neutral-700/60"
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>

        {/* AI Provider Status Button */}
        <button
          onClick={onOpenSecrets}
          title={hasValidApiKey ? `Active Provider: ${selectedModel}` : 'Configure AI Provider'}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
            hasValidApiKey
              ? 'bg-[#131620] border-[#292E3D] text-[#8B9BFF] hover:border-[#8B9BFF]/50'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${hasValidApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          <span className="truncate max-w-[110px]">{selectedModel}</span>
        </button>

        {/* Deploy & Publish Button */}
        <button
          onClick={onOpenDeploy}
          className="px-3 py-1.5 rounded-lg bg-[#8B9BFF] hover:bg-[#A5B4FC] text-black text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{t.actions.deploy}</span>
        </button>

        {/* Run Settings Toggle Button */}
        {onToggleRunSettings && (
          <button
            onClick={onToggleRunSettings}
            title={isRunSettingsOpen ? 'Collapse Run Settings' : 'Expand Run Settings'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isRunSettingsOpen
                ? 'bg-[#191D29] border-[#8B9BFF] text-[#8B9BFF]'
                : 'bg-[#131620] border-[#292E3D] text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#191D29]'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        {/* Settings Gear Button */}
        <button
          onClick={onOpenSettings}
          title="Studio Settings"
          className="hidden sm:flex p-1.5 rounded-lg text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#191D29] transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* Mobile Menu Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#191D29] transition-colors"
            title="Open Studio Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
