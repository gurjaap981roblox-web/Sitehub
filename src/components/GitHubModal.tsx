/**
 * GitHubModal Component
 * Production-ready GitHub integration: Real OAuth connection, repository creation,
 * and atomic Git commit synchronization with real SHA links.
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Globe,
  Info,
  Loader2,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { GitHubConnection, SiteDocument } from '../types/site';
import { GitHubService, GitHubStatusResponse } from '../services/githubService';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteDocument;
  conn: GitHubConnection;
  onUpdateConnection: (conn: GitHubConnection) => void;
  appName?: string;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  site,
  conn,
  onUpdateConnection,
  appName = 'SiteHub',
}) => {
  // Connection & OAuth Status
  const [status, setStatus] = useState<GitHubStatusResponse>({
    isConnected: false,
    isConfigured: false,
    callbackUrl: '',
    username: null,
    avatarUrl: null,
  });
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Repository Management
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoMode, setRepoMode] = useState<'create' | 'existing'>('create');
  const [newRepoName, setNewRepoName] = useState(site.slug || 'my-sitehub-website');
  const [isPrivateRepo, setIsPrivateRepo] = useState(true);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [createRepoError, setCreateRepoError] = useState<string | null>(null);

  // Commit & Sync State
  const [selectedRepoOwner, setSelectedRepoOwner] = useState<string>('');
  const [selectedRepoName, setSelectedRepoName] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState(`feat: sync ${site.name} via ${appName}`);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<{ sha: string; url: string; count: number } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncHistory, setSyncHistory] = useState<any[]>([]);

  const [copiedCallback, setCopiedCallback] = useState(false);

  // Load Status on Open
  const refreshStatus = async () => {
    setIsLoadingStatus(true);
    setAuthError(null);
    try {
      const res = await GitHubService.checkStatus();
      setStatus(res);

      if (res.isConnected && res.username) {
        setSelectedRepoOwner(res.username);
        setSelectedRepoName(conn.repoName || site.slug);
        loadUserRepos();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to check GitHub status');
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const loadUserRepos = async () => {
    setIsLoadingRepos(true);
    try {
      const repos = await GitHubService.listRepositories();
      setUserRepos(repos);
      if (repos.length > 0 && !selectedRepoName) {
        const found = repos.find(r => r.name.toLowerCase() === site.slug.toLowerCase());
        if (found) {
          setSelectedRepoName(found.name);
          setSelectedRepoOwner(found.owner);
        }
      }
    } catch {
      // Ignored if user has no repos yet
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const loadSyncHistory = async (fullName: string) => {
    if (!fullName) return;
    const history = await GitHubService.getSyncHistory(fullName);
    setSyncHistory(history);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedRepoOwner && selectedRepoName) {
      loadSyncHistory(`${selectedRepoOwner}/${selectedRepoName}`);
    }
  }, [selectedRepoOwner, selectedRepoName]);

  // Listen for OAuth Success postMessage from the popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SITEHUB_GITHUB_OAUTH_SUCCESS') {
        const username = event.data.username;
        const avatarUrl = event.data.avatarUrl;
        setIsConnecting(false);
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          username,
          avatarUrl,
        }));
        setSelectedRepoOwner(username);
        onUpdateConnection({
          ...conn,
          isConnected: true,
          username,
          avatarUrl,
        });
        loadUserRepos();
      } else if (event.data?.type === 'SITEHUB_GITHUB_OAUTH_ERROR') {
        setIsConnecting(false);
        setAuthError(event.data.error || 'GitHub authorization failed.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [conn, onUpdateConnection]);

  // Start Real OAuth Authorization
  const handleConnect = async () => {
    setAuthError(null);
    setIsConnecting(true);

    try {
      const { url } = await GitHubService.getAuthUrl();

      // Open official GitHub authorize URL in a popup
      const authWindow = window.open(
        url,
        'sitehub_github_oauth',
        'width=650,height=750,left=150,top=100'
      );

      if (!authWindow) {
        // If popup was blocked, fallback to direct redirect
        window.location.href = url;
      }
    } catch (err: any) {
      setIsConnecting(false);
      setAuthError(err.message || 'Failed to start GitHub authorization flow.');
    }
  };

  // Disconnect Account
  const handleDisconnect = async () => {
    if (!window.confirm('Disconnect your GitHub account from SiteHub?')) return;
    try {
      await GitHubService.disconnect();
      setStatus(prev => ({ ...prev, isConnected: false, username: null, avatarUrl: null }));
      onUpdateConnection({ ...conn, isConnected: false, username: undefined });
      setUserRepos([]);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  // Create Repository
  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;

    setIsCreatingRepo(true);
    setCreateRepoError(null);

    try {
      const repo = await GitHubService.createRepository(
        newRepoName.trim(),
        isPrivateRepo,
        `Generated by ${appName} — ${site.title}`,
        site.id
      );

      setSelectedRepoOwner(repo.owner);
      setSelectedRepoName(repo.name);
      setRepoMode('existing');
      loadUserRepos();

      onUpdateConnection({
        ...conn,
        repoName: repo.name,
        repoUrl: repo.htmlUrl,
        branch: repo.defaultBranch || 'main',
      });
    } catch (err: any) {
      setCreateRepoError(err.message || 'Failed to create GitHub repository.');
    } finally {
      setIsCreatingRepo(false);
    }
  };

  // Commit and Push
  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepoOwner || !selectedRepoName || isSyncing) return;

    setIsSyncing(true);
    setSyncSuccess(null);
    setSyncError(null);

    try {
      const result = await GitHubService.syncFiles(
        site,
        selectedRepoOwner,
        selectedRepoName,
        commitMessage.trim() || `chore: update website via ${appName}`,
        conn.branch || 'main',
        appName
      );

      setSyncSuccess({
        sha: result.commitSha,
        url: result.commitUrl,
        count: result.filesCount,
      });

      // Update sync history
      loadSyncHistory(`${selectedRepoOwner}/${selectedRepoName}`);

      onUpdateConnection({
        ...conn,
        repoName: selectedRepoName,
        repoUrl: `https://github.com/${selectedRepoOwner}/${selectedRepoName}`,
        lastSyncedAt: new Date().toISOString(),
        commits: [
          {
            sha: result.commitSha,
            message: commitMessage,
            timestamp: result.timestamp,
            author: status.username || 'You',
          },
          ...(conn.commits || []),
        ],
      });
    } catch (err: any) {
      setSyncError(err.message || 'Failed to synchronize files with GitHub.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyCallback = () => {
    if (status.callbackUrl) {
      navigator.clipboard.writeText(status.callbackUrl);
      setCopiedCallback(true);
      setTimeout(() => setCopiedCallback(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-xs">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm text-white">GitHub Project Synchronization</h3>
              <p className="text-[11px] text-neutral-400">
                Create real repositories, push commits, and automate CI/CD deployments.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Error Banner */}
          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">{authError}</div>
              <button onClick={() => setAuthError(null)} className="text-red-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STATE 1: NOT CONNECTED */}
          {!status.isConnected ? (
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-white">
                <FolderGit2 className="w-6 h-6 text-neutral-200" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-white">Connect Your GitHub Account</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Authorizes SiteHub to create repositories and commit code directly to your GitHub profile.
                </p>
              </div>

              {/* Notice if GITHUB_CLIENT_ID is missing on server */}
              {!status.isConfigured && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left text-xs space-y-2 text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Configuration Required in Render Dashboard</span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    Set <code>GITHUB_CLIENT_ID</code> and <code>GITHUB_CLIENT_SECRET</code> in your Render environment variables.
                  </p>
                  {status.callbackUrl && (
                    <div className="pt-1">
                      <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                        Required Authorization Callback URL:
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-1.5 bg-neutral-950 rounded border border-neutral-800 text-[11px] text-neutral-200 font-mono select-all truncate">
                          {status.callbackUrl}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyCallback}
                          className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedCallback ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCallback ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-lg transition-all disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Connecting with GitHub...</span>
                  </>
                ) : (
                  <>
                    <FolderGit2 className="w-4 h-4 text-neutral-950" />
                    <span>Connect with GitHub</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* STATE 2: CONNECTED */
            <div className="space-y-5">
              {/* Connected User Identity Card */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status.avatarUrl ? (
                    <img
                      src={status.avatarUrl}
                      alt={status.username || 'User'}
                      className="w-10 h-10 rounded-full border border-neutral-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                      {status.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{status.username}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        ● Verified Connected
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">Official GitHub REST API</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 border border-neutral-800 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Repository Selector / Creator Tabs */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRepoMode('create')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        repoMode === 'create'
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      + Create New Repository
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepoMode('existing')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        repoMode === 'existing'
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Select Existing ({userRepos.length})
                    </button>
                  </div>
                </div>

                {/* TAB A: Create New Repository */}
                {repoMode === 'create' ? (
                  <form onSubmit={handleCreateRepo} className="space-y-3">
                    {createRepoError && (
                      <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-xs">
                        {createRepoError}
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Repository Name
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-mono">{status.username} /</span>
                        <input
                          type="text"
                          value={newRepoName}
                          onChange={e => setNewRepoName(e.target.value)}
                          placeholder="e.g. restaurant-website"
                          required
                          className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                        <input
                          type="checkbox"
                          checked={isPrivateRepo}
                          onChange={e => setIsPrivateRepo(e.target.checked)}
                          className="rounded border-neutral-700 text-indigo-600 focus:ring-0"
                        />
                        <div className="flex items-center gap-1.5">
                          {isPrivateRepo ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{isPrivateRepo ? 'Private Repository' : 'Public Repository'}</span>
                        </div>
                      </label>

                      <button
                        type="submit"
                        disabled={isCreatingRepo || !newRepoName.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isCreatingRepo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>Create on GitHub</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* TAB B: Select Existing Repository */
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Target Repository
                      </label>
                      <select
                        value={selectedRepoName}
                        onChange={e => {
                          setSelectedRepoName(e.target.value);
                          const found = userRepos.find(r => r.name === e.target.value);
                          if (found) setSelectedRepoOwner(found.owner);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Choose Repository --</option>
                        {userRepos.map(repo => (
                          <option key={repo.id} value={repo.name}>
                            {repo.fullName} {repo.isPrivate ? '(Private)' : '(Public)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Commit & Real Git Push Form */}
              {selectedRepoName && (
                <form onSubmit={handlePush} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                      <GitCommit className="w-4 h-4 text-emerald-400" />
                      <span>Commit Generated Files to {selectedRepoOwner}/{selectedRepoName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">Branch: {conn.branch || 'main'}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Commit Message
                    </label>
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={e => setCommitMessage(e.target.value)}
                      placeholder="e.g. feat: add reservation booking and update styling"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all active:scale-[0.99]"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Creating Tree & Pushing Commit to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Push Real Git Commit</span>
                      </>
                    )}
                  </button>

                  {/* Sync Success Message with Clickable Commit Link */}
                  {syncSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Commit Pushed Successfully ({syncSuccess.count} files)</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                        <span>SHA: {syncSuccess.sha.slice(0, 7)}</span>
                        <a
                          href={syncSuccess.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-semibold"
                        >
                          <span>View Commit on GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {syncError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs">
                      {syncError}
                    </div>
                  )}
                </form>
              )}

              {/* Real Sync Commit History */}
              {syncHistory.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Recent Verified Commits
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 font-mono">
                    {syncHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <a
                            href={item.commitUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-1.5 py-0.5 rounded bg-neutral-900 text-indigo-400 hover:text-indigo-300 font-bold underline"
                          >
                            {item.commitSha.slice(0, 7)}
                          </a>
                          <span className="text-neutral-200 truncate">{item.commitMessage}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
