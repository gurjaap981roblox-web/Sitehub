/**
 * CodeStudio Component
 * Full-featured code editor with project file tree, syntax view, live editing,
 * AST two-way sync, and "Ask AI to edit / fix code".
 */

import React, { useEffect, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  FileCode,
  Folder,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { SiteDocument } from '../types/site';
import { GitHubService } from '../services/githubService';

interface CodeStudioProps {
  site: SiteDocument;
  onUpdateSite: (site: SiteDocument) => void;
  appName?: string;
  onAskAiToFixCode: (prompt: string) => void;
}

export const CodeStudio: React.FC<CodeStudioProps> = ({
  site,
  onUpdateSite,
  appName = 'SiteHub',
  onAskAiToFixCode,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('site.json');
  const [filesMap, setFilesMap] = useState<Record<string, string>>({});
  const [activeCode, setActiveCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Initialize and regenerate files map on site change
  useEffect(() => {
    const generated = GitHubService.generateFilesMap(site, appName);
    // Add App.tsx mock preview code
    generated['src/App.tsx'] = `import React from 'react';
import { LiveSiteRenderer } from './components/LiveSiteRenderer';
import siteAst from './site.json';

export default function App() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <LiveSiteRenderer site={siteAst} isPreview={false} />
    </main>
  );
}`;
    generated['src/styles.css'] = `@import "tailwindcss";

:root {
  --primary-color: ${site.theme.primaryColor};
  --accent-color: ${site.theme.accentColor};
  --bg-color: ${site.theme.backgroundColor};
  --text-color: ${site.theme.textColor};
}`;

    setFilesMap(generated);
    setActiveCode(generated[selectedFile] || generated['site.json']);
    setHasUnsavedChanges(false);
    setParseError(null);
  }, [site, appName]);

  const handleSelectFile = (fileName: string) => {
    setSelectedFile(fileName);
    setActiveCode(filesMap[fileName] || '');
    setHasUnsavedChanges(false);
    setParseError(null);
  };

  const handleCodeChange = (newCode: string) => {
    setActiveCode(newCode);
    setHasUnsavedChanges(true);
    setParseError(null);
  };

  const handleApplyChanges = () => {
    if (selectedFile === 'site.json') {
      try {
        const parsed = JSON.parse(activeCode) as SiteDocument;
        parsed.version += 1;
        parsed.updatedAt = new Date().toISOString();
        onUpdateSite(parsed);
        setHasUnsavedChanges(false);
        setParseError(null);
      } catch (err: any) {
        setParseError(`JSON Syntax Error: ${err.message}`);
      }
    } else {
      // Update local file memory
      setFilesMap(prev => ({ ...prev, [selectedFile]: activeCode }));
      setHasUnsavedChanges(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fileList = Object.keys(filesMap);

  return (
    <div className="flex-1 flex bg-neutral-950 overflow-hidden text-xs">
      {/* File Tree Explorer */}
      <div className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
        <div className="p-3 border-b border-neutral-800 font-bold uppercase tracking-wider text-[11px] text-neutral-400 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-indigo-400" />
          <span>Project Explorer</span>
        </div>
        <div className="p-2 space-y-0.5 overflow-y-auto flex-1">
          {fileList.map(fileName => {
            const isSelected = selectedFile === fileName;
            return (
              <button
                key={fileName}
                onClick={() => handleSelectFile(fileName)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-2 transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{fileName}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-neutral-800 text-[10px] text-neutral-500">
          Two-way sync: edits to <code className="text-indigo-400">site.json</code> immediately update the visual canvas.
        </div>
      </div>

      {/* Editor & Actions Pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Top Bar */}
        <div className="h-10 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-300 font-medium">{selectedFile}</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved edits" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() =>
                onAskAiToFixCode(`In ${selectedFile}, add dark glassmorphism effects and improve mobile responsiveness.`)
              }
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 flex items-center gap-1.5 font-medium border border-neutral-700/60"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Ask AI to Edit</span>
            </button>

            <button
              onClick={handleApplyChanges}
              disabled={!hasUnsavedChanges}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <Save className="w-3 h-3" />
              <span>Apply to Canvas</span>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {parseError && (
          <div className="p-2.5 bg-red-500/10 border-b border-red-500/30 text-red-400 font-mono text-[11px] flex items-center justify-between px-4">
            <span>{parseError}</span>
            <button
              onClick={() =>
                onAskAiToFixCode(`Fix this JSON syntax error in site.json: ${parseError}`)
              }
              className="underline hover:text-red-300"
            >
              Send to AI to Fix
            </button>
          </div>
        )}

        {/* Code View Area */}
        <div className="flex-1 overflow-auto bg-neutral-950 p-4 font-mono">
          <textarea
            value={activeCode}
            onChange={e => handleCodeChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-transparent text-neutral-200 font-mono text-xs focus:outline-none resize-none leading-relaxed selection:bg-indigo-600 selection:text-white"
          />
        </div>
      </div>
    </div>
  );
};
