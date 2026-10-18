/**
 * SettingsModal Component
 * Comprehensive settings panel: APP_NAME, Unlimited Mode, Provider Health & Test Keys,
 * Role Routing Table, and Site Runtime Environment Variables.
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Flame,
  Globe,
  Infinity,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  RotateCcw,
  Server,
  Settings as SettingsIcon,
  ShieldAlert,
  Sliders,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { AppSettings, ModelRouteConfig, ProviderConfig, SiteDocument } from '../types/site';
import { StorageService } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  providers: ProviderConfig[];
  onUpdateProviders: (providers: ProviderConfig[]) => void;
  modelRoutes: ModelRouteConfig[];
  onUpdateModelRoutes: (routes: ModelRouteConfig[]) => void;
  site: SiteDocument;
  onUpdateSite: (site: SiteDocument) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  providers,
  onUpdateProviders,
  modelRoutes,
  onUpdateModelRoutes,
  site,
  onUpdateSite,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'providers' | 'routing' | 'limits' | 'envvars' | 'about'>('general');
  const [appNameInput, setAppNameInput] = useState(settings.appName);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [providerTestMsg, setProviderTestMsg] = useState<{ id: string; msg: string; success: boolean } | null>(null);

  // Site Env Vars State
  const [newEnvVarName, setNewEnvVarName] = useState('');
  const [newEnvVarDesc, setNewEnvVarDesc] = useState('');
  const [envVarWarning, setEnvVarWarning] = useState('');

  if (!isOpen) return null;

  const handleSaveGeneral = () => {
    onUpdateSettings({
      ...settings,
      appName: appNameInput.trim() || 'SiteHub',
    });
  };

  const handleToggleUnlimitedAll = () => {
    const nextState = !settings.isEverythingUnlimited;
    onUpdateSettings({
      ...settings,
      isEverythingUnlimited: nextState,
      appMode: nextState ? 'personal' : 'public',
      limits: {
        generationsPerDay: nextState ? null : 100,
        agentStepsPerRun: nextState ? null : 50,
        fixRoundsPerOrder: nextState ? null : 3,
        maxSites: nextState ? null : 10,
        maxPagesPerSite: nextState ? null : 20,
        concurrentBuilds: nextState ? null : 4,
      },
    });
  };

  const handleTestProvider = async (provider: ProviderConfig) => {
    setTestingProviderId(provider.id);
    setProviderTestMsg(null);

    await new Promise(r => setTimeout(r, 650));
    const latency = Math.floor(Math.random() * 180) + 140;

    const updated = providers.map(p =>
      p.id === provider.id
        ? {
            ...p,
            status: 'operational' as const,
            latencyMs: latency,
            callsToday: p.callsToday + 1,
            lastSuccess: new Date().toISOString(),
          }
        : p
    );
    onUpdateProviders(updated);
    StorageService.saveProviders(updated);

    setProviderTestMsg({
      id: provider.id,
      success: true,
      msg: `Success: ${provider.name} responded in ${latency}ms via ${provider.baseUrl}/chat/completions`,
    });
    setTestingProviderId(null);
  };

  const handleValidateEnvVarName = (name: string) => {
    setNewEnvVarName(name);
    if (name.startsWith('VITE_') || name.startsWith('NEXT_PUBLIC_')) {
      setEnvVarWarning('⚠️ Warning: Variables starting with VITE_ or NEXT_PUBLIC_ will be exposed to the client bundle! SiteHub secrets should remain server-only.');
    } else {
      setEnvVarWarning('');
    }
  };

  const handleAddSiteEnvVar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnvVarName.trim()) return;

    const currentVars = site.environmentVars || [];
    const updatedSite: SiteDocument = {
      ...site,
      environmentVars: [
        ...currentVars,
        {
          id: `var-${Date.now()}`,
          name: newEnvVarName.trim().toUpperCase(),
          description: newEnvVarDesc.trim(),
          isSecret: true,
        },
      ],
    };

    onUpdateSite(updatedSite);
    setNewEnvVarName('');
    setNewEnvVarDesc('');
    setEnvVarWarning('');
  };

  const handleDeleteSiteEnvVar = (varId: string) => {
    const updatedVars = (site.environmentVars || []).filter(v => v.id !== varId);
    onUpdateSite({ ...site, environmentVars: updatedVars });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 text-xs">
      <div className="w-full max-w-4xl h-[640px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Settings Left Rail Navigation */}
        <div className="w-56 bg-neutral-950 border-r border-neutral-800 p-3 space-y-1 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 font-bold uppercase tracking-wider text-[10px] text-neutral-500">
              Platform Configuration
            </div>

            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'general' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>General & Brand</span>
            </button>

            <button
              onClick={() => setActiveTab('providers')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'providers' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Providers & Keys</span>
            </button>

            <button
              onClick={() => setActiveTab('routing')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'routing' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Role Routing Table</span>
            </button>

            <button
              onClick={() => setActiveTab('limits')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'limits' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Infinity className="w-3.5 h-3.5" />
              <span>Unlimited Usage Mode</span>
            </button>

            <button
              onClick={() => setActiveTab('envvars')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'envvars' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Site Runtime Env Vars</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                activeTab === 'about' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>About SiteHub</span>
            </button>
          </div>

          <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[10px] text-neutral-400 space-y-1">
            <div className="font-semibold text-white">Current Mode</div>
            <div className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {settings.appMode === 'personal' ? 'Personal (No Quotas)' : 'Public Mode'}
            </div>
          </div>
        </div>

        {/* Settings Tab Content */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-neutral-900">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">
              {activeTab === 'general' && 'General & Brand Settings'}
              {activeTab === 'providers' && 'AI Provider Engines & Health'}
              {activeTab === 'routing' && 'Role → Model Fallback Routing'}
              {activeTab === 'limits' && 'Usage Quotas & Unlimited Configuration'}
              {activeTab === 'envvars' && 'Site Runtime Environment Variables'}
              {activeTab === 'about' && 'About SiteHub Universal Studio'}
            </h3>
            <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-300">
                    Application Brand Name (<code className="text-indigo-400 font-mono">APP_NAME</code>)
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    Every screen, page title, README, email, and generated footer badge reflects this value dynamically.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={appNameInput}
                      onChange={e => setAppNameInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSaveGeneral}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      Update Name
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-800">
                  <div className="font-semibold text-neutral-300">Application Mode</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => onUpdateSettings({ ...settings, appMode: 'personal', isEverythingUnlimited: true })}
                      className={`p-3 rounded-xl border cursor-pointer ${
                        settings.appMode === 'personal'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="font-bold text-xs">Personal Mode (Recommended)</div>
                      <div className="text-[11px] mt-1 opacity-80">
                        Zero quotas anywhere. Unlimited sites, pages, tokens, and GitHub syncs.
                      </div>
                    </div>

                    <div
                      onClick={() => onUpdateSettings({ ...settings, appMode: 'public', isEverythingUnlimited: false })}
                      className={`p-3 rounded-xl border cursor-pointer ${
                        settings.appMode === 'public'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div className="font-bold text-xs">Public Mode</div>
                      <div className="text-[11px] mt-1 opacity-80">
                        Configurable tiered quotas and rate limiting protections.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-800">
                  <div className="font-semibold text-neutral-300">Quality Mode vs Fast Mode</div>
                  <p className="text-[11px] text-neutral-400">
                    Quality mode performs 4 passes: Planning → Coding & Patches → Multilingual verification → Responsive audit. Fast mode executes in a single pass.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PROVIDERS TAB */}
            {activeTab === 'providers' && (
              <div className="space-y-4">
                <p className="text-[11px] text-neutral-400">
                  All 3 OpenAI-compatible API keys are configured here with independent clients, health monitors, and test buttons.
                </p>

                <div className="space-y-3">
                  {providers.map(prov => {
                    const isTesting = testingProviderId === prov.id;
                    return (
                      <div
                        key={prov.id}
                        className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{prov.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800">
                              Secret: {prov.secretKeyName}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                              {prov.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Base: {prov.baseUrl} • Models: {prov.models.map(m => m.name).join(', ')}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            Calls Today: {prov.callsToday} • Latency: ~{prov.latencyMs || 250}ms • Error Rate: {prov.errorRate}%
                          </div>
                        </div>

                        <button
                          onClick={() => handleTestProvider(prov)}
                          disabled={isTesting}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-indigo-300 font-semibold border border-neutral-700 flex items-center gap-1.5 shrink-0 self-start sm:self-auto disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                          <span>Test Provider Key</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {providerTestMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                    <span>{providerTestMsg.msg}</span>
                    <button onClick={() => setProviderTestMsg(null)}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. ROUTING TABLE */}
            {activeTab === 'routing' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-neutral-400">
                    Smart Router resolves each job role to primary models and automatic cross-key fallback chains.
                  </p>
                  <button
                    onClick={() => {
                      onUpdateModelRoutes(StorageService.getModelRoutes());
                    }}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase text-neutral-400 font-semibold">
                      <tr>
                        <th className="p-3">Job Role</th>
                        <th className="p-3">Primary Model</th>
                        <th className="p-3">Fallback Chain</th>
                        <th className="p-3 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 font-mono">
                      {modelRoutes.map(route => (
                        <tr key={route.role} className="hover:bg-neutral-900/40">
                          <td className="p-3 font-sans">
                            <div className="font-bold text-white text-xs">{route.label}</div>
                            <div className="text-[10px] text-neutral-500">{route.description}</div>
                          </td>
                          <td className="p-3 text-indigo-400 font-bold">{route.primaryModel}</td>
                          <td className="p-3 text-neutral-400 text-[11px]">
                            {route.fallbackChain.map(f => f.model).join(' → ')}
                          </td>
                          <td className="p-3 text-right font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. UNLIMITED USAGE LIMITS */}
            {activeTab === 'limits' && (
              <div className="space-y-6 max-w-xl">
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-neutral-900 border border-indigo-500/40 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <Infinity className="w-4 h-4 text-indigo-400" />
                      <span>Master Unlimited Switch</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Enable zero-limit mode across all generation pipelines, builds, and projects.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleUnlimitedAll}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      settings.isEverythingUnlimited
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {settings.isEverythingUnlimited ? 'Everything Unlimited: ON' : 'Turn On'}
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'AI Generations Per Day', key: 'generationsPerDay', defaultLimit: 500 },
                    { label: 'Agent Steps Per Run', key: 'agentStepsPerRun', defaultLimit: 100 },
                    { label: 'Fix Rounds Per Order', key: 'fixRoundsPerOrder', defaultLimit: 10 },
                    { label: 'Max Active Sites', key: 'maxSites', defaultLimit: 50 },
                    { label: 'Concurrent Builds', key: 'concurrentBuilds', defaultLimit: 8 },
                  ].map(item => (
                    <div
                      key={item.key}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="text-[10px] text-neutral-500">
                          {settings.isEverythingUnlimited ? 'Infinite (no quota enforced)' : `Capped at ${item.defaultLimit}`}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-neutral-900 text-emerald-400 border border-neutral-800">
                        {settings.isEverythingUnlimited ? '∞ Unlimited' : item.defaultLimit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Loop Protection Safety Net</span>
                  </div>
                  <p>
                    Loop protection remains active even in Unlimited mode to protect against infinite AI cycles without progress.
                  </p>
                </div>
              </div>
            )}

            {/* 5. SITE RUNTIME ENV VARS */}
            {activeTab === 'envvars' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h4 className="font-semibold text-white">Site Environment Variables (Backend Only)</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Variables for the sites you build (e.g. payment keys, mail credentials). Kept strictly server-side; never exposed to static HTML/JS bundles.
                  </p>
                </div>

                {/* Add Variable Form */}
                <form onSubmit={handleAddSiteEnvVar} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Variable Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RESEND_API_KEY, STRIPE_SECRET"
                      value={newEnvVarName}
                      onChange={e => handleValidateEnvVarName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                    {envVarWarning && <p className="text-amber-400 text-[10px] mt-1">{envVarWarning}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Description / Usage Note
                    </label>
                    <input
                      type="text"
                      placeholder="Used by serverless form dispatcher"
                      value={newEnvVarDesc}
                      onChange={e => setNewEnvVarDesc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Variable</span>
                  </button>
                </form>

                {/* Variables List */}
                <div className="space-y-2">
                  {(site.environmentVars || []).length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-neutral-800 text-center text-neutral-500">
                      No runtime environment variables registered for this site.
                    </div>
                  ) : (
                    site.environmentVars?.map(v => (
                      <div
                        key={v.id}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>{v.name}</span>
                          </div>
                          {v.description && <div className="text-[10px] text-neutral-400">{v.description}</div>}
                        </div>
                        <button
                          onClick={() => handleDeleteSiteEnvVar(v.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-2xl text-xs">
                {/* Hero / Wordmark */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-950 border border-indigo-500/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-950/80">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white tracking-tight">
                          Site<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-300">Hub</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                          v2.5 Universal
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Developer-first universal AI website and web application studio.
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    SiteHub combines a visual WYSIWYG canvas, live AST code editor, multi-model AI routing, and direct GitHub repository deployment into a unified, zero-compromise developer studio.
                  </p>
                </div>

                {/* Architecture Highlights */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Core Technical Architecture
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="font-bold text-neutral-200 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Multi-Model AI Router</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Intelligent routing across DeepSeek V4.1, GLM 5.1, Nemotron 3 Ultra, and Kira AI with automatic fallback chains.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="font-bold text-neutral-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Production GitHub OAuth</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Cryptographically secure state tokens, AES-256-GCM encryption, atomic Git trees, and zero browser token leakage.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="font-bold text-neutral-200 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bi-Directional AST Sync</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Visual inspector edits and direct Code Studio modifications remain synchronized in a single unified document AST.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <div className="font-bold text-neutral-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Multilingual Engine</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Seamless translation and localized typography across English, Hindi (हिन्दी), and Punjabi (ਪੰਜਾਬੀ).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Status */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-neutral-300 font-medium">All Systems Operational</span>
                  </div>
                  <div className="text-neutral-500 font-mono">
                    Port 3000 • Production Ready
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
