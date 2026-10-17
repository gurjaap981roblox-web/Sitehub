/**
 * GitHubModal Component
 * Google AI Studio-style GitHub integration: Automated repo creation, commit history, and push synchronization.
 */

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { GitHubConnection, SiteDocument } from '../types/site';
import { GitHubService } from '../services/githubService';

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
  const [commitMessage, setCommitMessage] = useState(`feat: sync ${site.name} changes via ${appName}`);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim() || isSyncing) return;

    setIsSyncing(true);
    setSyncSuccess(false);

    await new Promise(r => setTimeout(r, 600));
    const updated = await GitHubService.commitAndSync(site, commitMessage.trim(), appName);
    onUpdateConnection(updated);

    setIsSyncing(false);
    setSyncSuccess(true);
    setCommitMessage(`update: refined sections in ${site.name}`);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-xs">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-neutral-200" />
            <h3 className="font-bold text-base text-white">GitHub Project Repository</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Repository Overview Card */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-bold text-white text-sm font-mono">
                {conn.username || 'developer-studio'}/{conn.repoName || site.slug}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
              <GitBranch className="w-3 h-3 text-indigo-400" />
              <span>{conn.branch}</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400">
            Connected repository automatically synchronizes with full Git history, GitHub Actions CI/CD workflows, and production builds.
          </p>

          <a
            href={conn.repoUrl || `https://github.com/developer-studio/${site.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <span>Open in GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Commit & Push Form */}
        <form onSubmit={handlePush} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Commit Message
            </label>
            <input
              type="text"
              value={commitMessage}
              onChange={e => setCommitMessage(e.target.value)}
              placeholder="e.g. feat: add table booking section"
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pushing Commit to GitHub...</span>
              </>
            ) : (
              <>
                <GitCommit className="w-3.5 h-3.5" />
                <span>Push Commit to Remote Branch</span>
              </>
            )}
          </button>
        </form>

        {syncSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Commit synchronized successfully with remote repository.</span>
          </div>
        )}

        {/* Recent Commits Log */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Commit History ({conn.commits?.length || 0})
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1.5 font-mono">
            {conn.commits?.map(commit => (
              <div
                key={commit.sha}
                className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-indigo-400 font-bold">
                    {commit.sha.slice(0, 7)}
                  </span>
                  <span className="text-neutral-200 truncate">{commit.message}</span>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0">
                  {new Date(commit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
