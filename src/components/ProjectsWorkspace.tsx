/**
 * ProjectsWorkspace Component
 * Manages active projects, starter templates, creation flows, exports, and switching.
 */

import React, { useState } from 'react';
import {
  Archive,
  ArrowRight,
  Copy,
  Download,
  FolderGit2,
  FolderOpen,
  Layout,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../lib/templates';
import { SiteDocument } from '../types/site';

interface ProjectsWorkspaceProps {
  currentSite: SiteDocument;
  allSites: SiteDocument[];
  onSelectSite: (site: SiteDocument) => void;
  onCreateNewProject: () => void;
  onDeleteSite: (id: string) => void;
  onExport: (format: 'zip' | 'html' | 'json') => void;
  onOpenBuildMode: () => void;
}

export const ProjectsWorkspace: React.FC<ProjectsWorkspaceProps> = ({
  currentSite,
  allSites,
  onSelectSite,
  onCreateNewProject,
  onDeleteSite,
  onExport,
  onOpenBuildMode,
}) => {
  const [activeTab, setActiveTab] = useState<'my_projects' | 'templates'>('my_projects');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 px-6 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#0F1118]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <FolderGit2 className="w-4 h-4 text-[#8B9BFF]" />
          <span className="font-bold text-[#F3F5FA]">Project Manager</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[#A1A8B8] font-mono text-[11px]">
            {allSites.length} saved projects
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onExport('zip')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#191D29] hover:bg-[#202536] text-[#F3F5FA] border border-[#292E3D] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>
          <button
            onClick={onCreateNewProject}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#8B9BFF] hover:bg-[#A5B4FC] text-black font-semibold transition-all shadow-md shadow-[#8B9BFF]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-6 py-2.5 border-b border-[#292E3D] bg-[#131620] flex items-center gap-2">
        <button
          onClick={() => setActiveTab('my_projects')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'my_projects'
              ? 'bg-[#191D29] text-[#8B9BFF] border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          My Projects ({allSites.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'templates'
              ? 'bg-[#191D29] text-[#8B9BFF] border border-[#292E3D]'
              : 'text-[#737C90] hover:text-[#F3F5FA]'
          }`}
        >
          Starter Architecture Templates ({STARTER_TEMPLATES.length})
        </button>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {activeTab === 'my_projects' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allSites.map(site => {
              const isCurrent = site.id === currentSite.id;
              const sectionsCount = site.pages?.[0]?.sections?.length || 0;

              return (
                <div
                  key={site.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                    isCurrent
                      ? 'bg-[#191D29] border-[#8B9BFF] shadow-[#8B9BFF]/10'
                      : 'bg-[#131620] border-[#292E3D] hover:border-[#8B9BFF]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#0B0D12] text-[#8B9BFF]">
                        {site.category || 'website'}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          ACTIVE STUDIO
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#F3F5FA] tracking-tight truncate">
                      {site.name}
                    </h3>

                    <p className="text-[11px] text-[#A1A8B8] line-clamp-2 leading-relaxed">
                      {site.description || site.title}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#292E3D]/60 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#737C90]">
                      <span>{sectionsCount} sections</span>
                      <span>·</span>
                      <span>v{site.version}</span>
                      <span>·</span>
                      <span className="uppercase">{site.language}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onSelectSite(site);
                          onOpenBuildMode();
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          isCurrent
                            ? 'bg-[#8B9BFF] text-black hover:bg-[#A5B4FC]'
                            : 'bg-[#0B0D12] text-[#F3F5FA] hover:bg-[#202536] border border-[#292E3D]'
                        }`}
                      >
                        <Layout className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'Open Studio' : 'Switch & Open'}</span>
                      </button>

                      {allSites.length > 1 && !isCurrent && (
                        <button
                          onClick={() => onDeleteSite(site.id)}
                          title="Delete project"
                          className="p-2 rounded-lg bg-[#0B0D12] hover:bg-rose-500/20 text-[#737C90] hover:text-rose-400 border border-[#292E3D] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {STARTER_TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                className="rounded-2xl p-5 bg-[#131620] border border-[#292E3D] hover:border-[#8B9BFF]/60 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#0B0D12] text-[#8B9BFF]">
                      Template
                    </span>
                    <span className="text-[10px] font-mono text-[#737C90] uppercase">
                      {tpl.language}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F3F5FA]">{tpl.name}</h3>

                  <p className="text-[11px] text-[#A1A8B8] leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectSite(tpl);
                    onOpenBuildMode();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#8B9BFF] hover:bg-[#A5B4FC] text-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8B9BFF]/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use This Architecture</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
