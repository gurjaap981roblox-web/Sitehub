/**
 * SiteHub — Production-Grade AI Website Maker Platform
 * Unified Studio: Visual Canvas, Code Studio, Console, Secrets Manager, and GitHub Sync.
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderGit2,
  KeyRound,
  Laptop,
  Maximize2,
  Menu,
  Palette,
  RefreshCw,
  Rocket,
  Settings as SettingsIcon,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import {
  AppSettings,
  DeviceMode,
  GitHubConnection,
  LanguageCode,
  ChatMessage,
  LogEvent,
  ModelRouteConfig,
  ProviderConfig,
  RunSettings,
  SecretItem,
  SiteDocument,
  UsageRecord,
  WorkspaceTab,
} from './types/site';
import { StorageService } from './lib/storage';
import { STARTER_TEMPLATES } from './lib/templates';
import { translations } from './lib/translations';
import { AiRouterService, GenerationStep } from './services/aiRouter';
import { GitHubService } from './services/githubService';
import JSZip from 'jszip';

import { TopNav } from './components/TopNav';
import { SideNav } from './components/SideNav';
import { LeftPanel } from './components/LeftPanel';
import { VisualCanvas } from './components/VisualCanvas';
import { CodeStudio } from './components/CodeStudio';
import { ConsolePanel } from './components/ConsolePanel';
import { SecretsManager } from './components/SecretsManager';
import { SettingsModal } from './components/SettingsModal';
import { GitHubModal } from './components/GitHubModal';
import { PublishModal } from './components/PublishModal';
import { AssetsManager } from './components/AssetsManager';
import { LiveSiteRenderer } from './components/LiveSiteRenderer';
import { RunSettingsPanel, DEFAULT_RUN_SETTINGS } from './components/RunSettingsPanel';
import { ChatWorkspace } from './components/ChatWorkspace';
import { StreamWorkspace } from './components/StreamWorkspace';
import { MediaWorkspace } from './components/MediaWorkspace';
import { HistoryWorkspace } from './components/HistoryWorkspace';
import { ProjectsWorkspace } from './components/ProjectsWorkspace';

export default function App() {
  // Global Settings & App Name
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getAppSettings());
  const [appName, setAppName] = useState<string>(settings.appName || 'SiteHub');
  const [currentLang, setCurrentLang] = useState<LanguageCode>(settings.defaultLanguage || 'en');

  // Active Site Document & History Stack
  const [sites, setSites] = useState<SiteDocument[]>(() => StorageService.getSites());
  const [activeSite, setActiveSite] = useState<SiteDocument>(() => {
    const activeId = StorageService.getActiveSiteId();
    const found = sites.find(s => s.id === activeId);
    return found || sites[0] || STARTER_TEMPLATES[0];
  });
  const [undoStack, setUndoStack] = useState<SiteDocument[]>([]);
  const [redoStack, setRedoStack] = useState<SiteDocument[]>([]);

  // Workspace Navigation & Device Mode
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('build');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSteps, setActiveSteps] = useState<GenerationStep[]>([]);
  const [loopWarning, setLoopWarning] = useState<string | null>(null);

  // Modals & Drawers
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStandaloneOpen, setIsStandaloneOpen] = useState(false);
  const [isMobileAiOpen, setIsMobileAiOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Providers, Secrets, Routes, Logs, GitHub
  const [providers, setProviders] = useState<ProviderConfig[]>(() => StorageService.getProviders());
  const [secrets, setSecrets] = useState<SecretItem[]>(() => StorageService.getSecrets());
  const [modelRoutes, setModelRoutes] = useState<ModelRouteConfig[]>(() => StorageService.getModelRoutes());
  const [logs, setLogs] = useState<LogEvent[]>(() => StorageService.getLogs());
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>(() => StorageService.getUsageRecords());
  const [githubConnection, setGithubConnection] = useState<GitHubConnection>(() =>
    StorageService.getGitHubConnection()
  );

  // Run Settings (Contextual AI Studio Panel)
  const [runSettings, setRunSettings] = useState<RunSettings>(DEFAULT_RUN_SETTINGS);
  const [isRunSettingsOpen, setIsRunSettingsOpen] = useState(true);

  // Chat Workspace Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keep appName in sync with settings & verify GitHub status on mount
  useEffect(() => {
    setAppName(settings.appName || 'SiteHub');
    document.title = `${activeSite.name} — ${settings.appName || 'SiteHub'}`;

    // Verify real GitHub connection status with backend
    GitHubService.checkStatus().then(res => {
      if (res.isConnected && res.username) {
        setGithubConnection(prev => ({
          ...prev,
          isConnected: true,
          username: res.username || undefined,
          avatarUrl: res.avatarUrl || undefined,
        }));
      }
    });

    // Check if returned from redirect flow
    if (window.location.search.includes('github_connected=1')) {
      showToast('GitHub account connected successfully!');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [settings, activeSite]);

  // Update Site with Undo History
  const handleUpdateSite = (newSite: SiteDocument, addToUndo: boolean = true) => {
    if (addToUndo) {
      setUndoStack(prev => [...prev.slice(-25), activeSite]);
      setRedoStack([]);
    }
    setActiveSite(newSite);
    StorageService.saveSite(newSite);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setRedoStack(prev => [activeSite, ...prev]);
    setActiveSite(previous);
    StorageService.saveSite(previous);
    showToast('Reverted to previous step');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack(prev => prev.slice(1));
    setUndoStack(prev => [...prev, activeSite]);
    setActiveSite(next);
    StorageService.saveSite(next);
    showToast('Redid change');
  };

  // Execute AI Prompt Order
  const handleRunPrompt = async (prompt: string, selectedModel: string) => {
    setIsGenerating(true);
    setActiveSteps([]);
    setLoopWarning(null);

    try {
      const result = await AiRouterService.buildOrUpdateSite(
        prompt,
        activeSite,
        selectedModel,
        step => {
          setActiveSteps(prev => {
            const index = prev.findIndex(s => s.step === step.step);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = step;
              return updated;
            }
            return [...prev, step];
          });
        }
      );

      handleUpdateSite(result.updatedSite);
      setLogs(StorageService.getLogs());
      setUsageRecords(StorageService.getUsageRecords());
      showToast(`AI synthesized ${result.patches.length} updates using ${result.modelUsed}`);
    } catch (err: any) {
      if (err.message?.includes('LOOP_DETECTED')) {
        setLoopWarning(
          'Repetitive instruction loop detected. Pausing AI generation to protect quality. You can switch models or dismiss to continue.'
        );
      } else {
        StorageService.addLog({
          level: 'error',
          source: 'AI',
          message: `Generation error: ${err.message}`,
        });
        setLogs(StorageService.getLogs());
        showToast(`AI error: ${err.message}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Conversational Chat Dispatch
  const handleSendChatMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setIsGenerating(true);

    try {
      const clientKeys: Record<string, string> = {};
      secrets.forEach(s => {
        if (s.rawValue) clientKeys[s.name] = s.rawValue;
      });

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          model: runSettings.model,
          systemInstruction: runSettings.systemInstructions,
          temperature: runSettings.temperature,
          maxOutputTokens: runSettings.maxOutputTokens,
          topP: runSettings.topP,
          topK: runSettings.topK,
          thinkingLevel: runSettings.thinkingLevel,
          tools: runSettings.tools,
          clientKeys,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to receive model response');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || runSettings.model,
        tokensIn: data.tokensIn,
        tokensOut: data.tokensOut,
        durationMs: data.durationMs,
        codeBlocks: data.codeBlocks,
      };

      setChatMessages(prev => [...prev, assistantMsg]);

      // Record Usage
      StorageService.recordUsage({
        id: `usg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        role: 'code-writer',
        provider: data.providerUsed || runSettings.provider,
        model: data.modelUsed || runSettings.model,
        tokensIn: data.tokensIn || Math.floor(content.length * 1.3),
        tokensOut: data.tokensOut || Math.floor(data.text.length / 3.8),
        costEstimated: (data.tokensIn || 100) * 0.0000005 + (data.tokensOut || 200) * 0.0000015,
        durationMs: data.durationMs || 350,
        status: 'success',
        note: `Chat: "${content.slice(0, 45)}..."`,
      });
      setUsageRecords(StorageService.getUsageRecords());
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: `Error communicating with ${runSettings.model}: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setChatMessages(prev => [...prev, errorMsg]);
      showToast(`Chat error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update Hero Image from Media Studio
  const handleUpdateHeroImage = (imageUrl: string) => {
    const updated = JSON.parse(JSON.stringify(activeSite));
    if (updated.pages?.[0]?.sections) {
      const heroSec = updated.pages[0].sections.find((s: any) => s.type === 'hero');
      if (heroSec) {
        if (!heroSec.props) heroSec.props = {};
        heroSec.props.heroImage = imageUrl;
        handleUpdateSite(updated);
        showToast('Updated project hero image');
      }
    }
  };

  // Project Management Actions
  const handleCreateNewProject = () => {
    setActiveTab('build');
    showToast('Describe what you want to build in the AI assistant prompt');
  };

  const handleDeleteSite = (id: string) => {
    if (sites.length <= 1) return;
    StorageService.deleteSite(id);
    const remaining = StorageService.getSites();
    setSites(remaining);
    if (activeSite.id === id) {
      setActiveSite(remaining[0]);
    }
    showToast('Project deleted');
  };

  // Export Bundle Handlers
  const handleExport = (format: 'zip' | 'html' | 'json') => {
    const files = GitHubService.generateFilesMap(activeSite, appName);

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(activeSite, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSite.slug}.ast.json`;
      a.click();
      showToast('Exported site AST JSON document');
    } else if (format === 'html') {
      const htmlContent = `<!doctype html>
<html lang="${activeSite.language}">
<head>
  <meta charset="UTF-8">
  <title>${activeSite.title}</title>
  <meta name="description" content="${activeSite.description}">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-neutral-100">
  <div id="root">
    <!-- Static snapshot for ${activeSite.name} generated by ${appName} -->
    <header class="p-6 border-b border-neutral-800 text-center font-bold text-xl">${activeSite.name}</header>
    <main class="max-w-4xl mx-auto p-8 space-y-4">
      <h1 class="text-4xl font-extrabold">${activeSite.title}</h1>
      <p class="text-neutral-300">${activeSite.description}</p>
    </main>
  </div>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeSite.slug}.html`;
      a.click();
      showToast('Exported standalone HTML file');
    } else if (format === 'zip') {
      const zip = new JSZip();
      Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content);
      });
      zip.generateAsync({ type: 'blob' }).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeSite.slug}-source.zip`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported complete project ZIP archive');
      }).catch(err => {
        showToast(`Export ZIP failed: ${err.message}`);
      });
    }
  };

  // Standalone Fullscreen Preview View
  if (isStandaloneOpen) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 relative">
        {/* Floating Back to Studio Bar */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs">
          <button
            onClick={() => setIsStandaloneOpen(false)}
            className="flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {appName} Studio</span>
          </button>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Live Presentation Mode</span>
        </div>

        <LiveSiteRenderer site={activeSite} isPreview={false} appName={appName} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0D12] text-[#F3F5FA] overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <TopNav
        appName={appName}
        site={activeSite}
        onUpdateSiteName={name => handleUpdateSite({ ...activeSite, name })}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        deviceMode={deviceMode}
        onSelectDeviceMode={setDeviceMode}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenGitHub={() => setIsGitHubOpen(true)}
        onOpenDeploy={() => setIsDeployOpen(true)}
        onOpenSecrets={() => setActiveTab('secrets')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSelectTemplate={template => {
          handleUpdateSite(template);
          showToast(`Loaded ${template.name} template`);
        }}
        currentLang={currentLang}
        onSelectLanguage={lang => {
          setCurrentLang(lang);
          setSettings(s => {
            const next = { ...s, defaultLanguage: lang };
            StorageService.setAppSettings(next);
            return next;
          });
        }}
        onExport={handleExport}
        isRunSettingsOpen={isRunSettingsOpen}
        onToggleRunSettings={() => setIsRunSettingsOpen(!isRunSettingsOpen)}
        selectedModel={runSettings.model}
        hasValidApiKey={true}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Studio 3-Panel Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left SideNav */}
        <SideNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Central Workspace Area */}
        <div className="flex-1 flex overflow-hidden bg-[#0B0D12]">
          {/* Build Mode Sub-Panels (AI Assistant + Canvas) */}
          {activeTab === 'build' && (
            <>
              <LeftPanel
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                isGenerating={isGenerating}
                activeSteps={activeSteps}
                currentLang={currentLang}
                onRunPrompt={handleRunPrompt}
                loopWarning={loopWarning}
                onClearLoopWarning={() => setLoopWarning(null)}
              />
              <VisualCanvas
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                deviceMode={deviceMode}
                appName={appName}
                currentLang={currentLang}
              />
            </>
          )}

          {/* Code Mode Sub-Panels (AI Assistant + Code Studio) */}
          {activeTab === 'code' && (
            <>
              <LeftPanel
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                isGenerating={isGenerating}
                activeSteps={activeSteps}
                currentLang={currentLang}
                onRunPrompt={handleRunPrompt}
                loopWarning={loopWarning}
                onClearLoopWarning={() => setLoopWarning(null)}
              />
              <CodeStudio
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                appName={appName}
                onAskAiToFixCode={prompt => handleRunPrompt(prompt, runSettings.model)}
              />
            </>
          )}

          {/* Chat Workspace */}
          {activeTab === 'chat' && (
            <ChatWorkspace
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isGenerating={isGenerating}
              onStopGeneration={() => setIsGenerating(false)}
              onClearConversation={() => setChatMessages([])}
              runSettings={runSettings}
              onOpenBuildMode={prompt => {
                if (prompt) handleRunPrompt(prompt, runSettings.model);
                setActiveTab('build');
              }}
              onOpenCodeMode={() => setActiveTab('code')}
            />
          )}

          {/* Stream Workspace */}
          {activeTab === 'stream' && (
            <StreamWorkspace
              runSettings={runSettings}
              onApplyToProject={() => setActiveTab('build')}
            />
          )}

          {/* Media Workspace */}
          {activeTab === 'media' && (
            <MediaWorkspace
              currentSite={activeSite}
              onUpdateHeroImage={handleUpdateHeroImage}
            />
          )}

          {/* History Workspace */}
          {activeTab === 'history' && (
            <HistoryWorkspace
              onReRunPrompt={(prompt, model) => {
                handleRunPrompt(prompt, model);
                setActiveTab('build');
              }}
            />
          )}

          {/* Projects Workspace */}
          {activeTab === 'projects' && (
            <ProjectsWorkspace
              currentSite={activeSite}
              allSites={sites}
              onSelectSite={handleUpdateSite}
              onCreateNewProject={handleCreateNewProject}
              onDeleteSite={handleDeleteSite}
              onExport={handleExport}
              onOpenBuildMode={() => setActiveTab('build')}
            />
          )}

          {/* Secrets Manager Workspace */}
          {activeTab === 'secrets' && (
            <SecretsManager
              secrets={secrets}
              onUpdateSecrets={setSecrets}
              appName={appName}
            />
          )}

          {/* Settings Workspace */}
          {activeTab === 'settings' && (
            <div className="flex-1 p-6 overflow-y-auto bg-[#0B0D12]">
              <SettingsModal
                isOpen={true}
                onClose={() => setActiveTab('build')}
                settings={settings}
                onUpdateSettings={setSettings}
                providers={providers}
                onUpdateProviders={setProviders}
                modelRoutes={modelRoutes}
                onUpdateModelRoutes={setModelRoutes}
                site={activeSite}
                onUpdateSite={handleUpdateSite}
              />
            </div>
          )}
        </div>

        {/* Right Run Settings Panel */}
        <RunSettingsPanel
          settings={runSettings}
          onChangeSettings={setRunSettings}
          isOpen={isRunSettingsOpen}
          onToggleOpen={() => setIsRunSettingsOpen(!isRunSettingsOpen)}
          estimatedPromptTokens={Math.floor(activeSite.name.length * 1.5) + 300}
        />
      </div>

      {/* Settings Modal (when opened from top gear button) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={s => {
          setSettings(s);
          StorageService.setAppSettings(s);
        }}
        providers={providers}
        onUpdateProviders={setProviders}
        modelRoutes={modelRoutes}
        onUpdateModelRoutes={setModelRoutes}
        site={activeSite}
        onUpdateSite={handleUpdateSite}
      />

      {/* GitHub Modal */}
      <GitHubModal
        isOpen={isGitHubOpen}
        onClose={() => setIsGitHubOpen(false)}
        site={activeSite}
        conn={githubConnection}
        onUpdateConnection={setGithubConnection}
        appName={appName}
      />

      {/* Publish & Deploy Modal */}
      <PublishModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        site={activeSite}
        onUpdateSite={handleUpdateSite}
        appName={appName}
        onOpenStandalone={() => {
          setIsDeployOpen(false);
          setIsStandaloneOpen(true);
        }}
        onExport={handleExport}
      />

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#191D29] border border-[#292E3D] text-[#F3F5FA] text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
