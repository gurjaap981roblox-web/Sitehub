/**
 * SideNav Component
 * Compact developer sidebar navigation inspired by Google AI Studio.
 * Houses primary modes: Chat, Stream, Generate Media, Build, Code, History, Projects, Secrets, Settings.
 */

import React from 'react';
import {
  Clock,
  Code2,
  FolderGit2,
  HelpCircle,
  ImagePlus,
  KeyRound,
  Layout,
  MessageSquareCode,
  Palette,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { WorkspaceTab } from '../types/site';

interface SideNavProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const primaryNavItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquareCode },
    { id: 'stream', label: 'Stream', icon: Zap },
    { id: 'media', label: 'Generate Media', icon: ImagePlus },
    { id: 'build', label: 'Build', icon: Layout, badge: 'AI Studio' },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
  ];

  const secondaryNavItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'secrets', label: 'API Keys & Secrets', icon: KeyRound },
    { id: 'settings', label: 'Studio Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <nav
        className={`w-16 shrink-0 bg-[#0F1118] border-r border-[#292E3D] flex flex-col items-center py-3 select-none z-40 transition-transform duration-200 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 flex translate-x-0 w-56 shadow-2xl items-start px-3'
            : 'hidden md:flex'
        }`}
      >
        {/* Brand Geometric Monogram on Mobile Drawer */}
        {isMobileOpen && (
          <div className="w-full pb-4 mb-2 border-b border-[#292E3D] flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B9BFF] to-[#6366f1] p-[1px]">
                <div className="w-full h-full bg-[#0B0D12] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B9BFF]" />
                </div>
              </div>
              <span className="font-extrabold text-sm text-[#F3F5FA]">SiteHub</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="text-xs text-[#737C90] hover:text-[#F3F5FA] p-1"
            >
              Close
            </button>
          </div>
        )}

        {/* Primary Workspace Nav Buttons */}
        <div className={`w-full flex flex-col gap-1.5 ${isMobileOpen ? 'items-stretch' : 'items-center'}`}>
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={item.label}
                className={`relative group flex items-center transition-all ${
                  isMobileOpen
                    ? `w-full px-3 py-2 rounded-xl text-xs gap-3 ${
                        isActive
                          ? 'bg-[#191D29] text-[#F3F5FA] font-semibold border border-[#292E3D]'
                          : 'text-[#A1A8B8] hover:bg-[#131620] hover:text-[#F3F5FA]'
                      }`
                    : `w-11 h-11 justify-center rounded-xl ${
                        isActive
                          ? 'bg-[#191D29] text-[#8B9BFF] shadow-sm border border-[#292E3D]'
                          : 'text-[#737C90] hover:bg-[#131620] hover:text-[#F3F5FA]'
                      }`
                }`}
              >
                {/* Active Indicator Bar on Desktop */}
                {!isMobileOpen && isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-[#8B9BFF] rounded-r-full -translate-x-2.5" />
                )}

                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#8B9BFF]' : ''}`} />

                {/* Mobile Text Label */}
                {isMobileOpen && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Desktop Floating Tooltip */}
                {!isMobileOpen && (
                  <div className="absolute left-14 hidden group-hover:flex items-center px-2.5 py-1 bg-[#191D29] border border-[#292E3D] text-[#F3F5FA] text-[11px] font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1 w-full my-2 border-b border-[#292E3D]/50" />

        {/* Bottom Secondary Nav */}
        <div className={`w-full flex flex-col gap-1.5 ${isMobileOpen ? 'items-stretch' : 'items-center'}`}>
          {secondaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                title={item.label}
                className={`relative group flex items-center transition-all ${
                  isMobileOpen
                    ? `w-full px-3 py-2 rounded-xl text-xs gap-3 ${
                        isActive
                          ? 'bg-[#191D29] text-[#F3F5FA] font-semibold border border-[#292E3D]'
                          : 'text-[#A1A8B8] hover:bg-[#131620] hover:text-[#F3F5FA]'
                      }`
                    : `w-11 h-11 justify-center rounded-xl ${
                        isActive
                          ? 'bg-[#191D29] text-[#8B9BFF] shadow-sm border border-[#292E3D]'
                          : 'text-[#737C90] hover:bg-[#131620] hover:text-[#F3F5FA]'
                      }`
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8B9BFF]' : ''}`} />
                {isMobileOpen && <span className="truncate">{item.label}</span>}
                {!isMobileOpen && (
                  <div className="absolute left-14 hidden group-hover:flex items-center px-2.5 py-1 bg-[#191D29] border border-[#292E3D] text-[#F3F5FA] text-[11px] font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
