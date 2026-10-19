/**
 * HistoryWorkspace Component
 * Displays real user prompt and generation history, usage records, token counts,
 * latency metrics, and 1-click restore/re-run actions.
 */

import React, { useState } from 'react';
import {
  Clock,
  Coins,
  Cpu,
  ExternalLink,
  Filter,
  History,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { StorageService } from '../lib/storage';
import { LogEvent, UsageRecord } from '../types/site';

interface HistoryWorkspaceProps {
  onReRunPrompt: (prompt: string, model: string) => void;
}

export const HistoryWorkspace: React.FC<HistoryWorkspaceProps> = ({
  onReRunPrompt,
}) => {
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>(() =>
    StorageService.getUsageRecords()
  );
  const [logs, setLogs] = useState<LogEvent[]>(() => StorageService.getLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'builder' | 'planner' | 'coder'>('all');

  const filteredRecords = usageRecords.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.role === activeFilter;
    const matchesSearch =
      !searchQuery ||
      (r.note && r.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalTokens = usageRecords.reduce((acc, r) => acc + (r.tokensIn || 0) + (r.tokensOut || 0), 0);
  const totalCost = usageRecords.reduce((acc, r) => acc + (r.costEstimated || 0), 0);

  const handleClearHistory = () => {
    localStorage.removeItem('sitehub_usage_history');
    setUsageRecords([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden select-none">
      {/* Header */}
      <div className="h-12 px-6 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#0F1118]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-[#8B9BFF]" />
          <span className="font-bold text-[#F3F5FA]">Prompt & Project History</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[#A1A8B8] font-mono text-[11px]">
            {usageRecords.length} recorded events
          </span>
        </div>

        {usageRecords.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#191D29] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Records</span>
          </button>
        )}
      </div>

      {/* Summary Metrics Bar */}
      <div className="px-6 py-3 border-b border-[#292E3D] bg-[#131620] flex items-center justify-between text-xs text-[#A1A8B8]">
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>
            <span className="text-[#737C90]">Total Tokens: </span>
            <span className="text-[#F3F5FA] font-bold">{totalTokens.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[#737C90]">Estimated Cost: </span>
            <span className="text-[#F3F5FA] font-bold">${totalCost.toFixed(5)}</span>
          </div>
          <div>
            <span className="text-[#737C90]">Executions: </span>
            <span className="text-[#F3F5FA] font-bold">{usageRecords.length}</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#0B0D12] p-1 rounded-lg border border-[#292E3D]">
          {(['all', 'builder', 'planner', 'coder'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-[#191D29] text-[#8B9BFF] font-semibold'
                  : 'text-[#737C90] hover:text-[#F3F5FA]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-4 max-w-4xl mx-auto w-full">
        {filteredRecords.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-[#737C90] space-y-2">
            <History className="w-8 h-8 text-[#292E3D]" />
            <p className="text-xs">No generation requests match your filter.</p>
            <p className="text-[11px] text-[#737C90]">
              Run a prompt in Build or Chat to record real token analytics.
            </p>
          </div>
        ) : (
          filteredRecords.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#131620] border border-[#292E3D] hover:border-[#8B9BFF]/60 transition-all space-y-2.5 shadow-lg group"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#191D29] text-[#8B9BFF]">
                    {item.role}
                  </span>
                  <span className="font-semibold text-[#F3F5FA] font-mono text-[11px]">
                    {item.model}
                  </span>
                  <span className="text-[10px] text-[#737C90]">via {item.provider}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[10px] text-[#737C90]">
                  <span>{item.durationMs}ms</span>
                  <span>·</span>
                  <span>{((item.tokensIn || 0) + (item.tokensOut || 0)).toLocaleString()} tok</span>
                  <span>·</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-[#A1A8B8] leading-relaxed">
                {item.note || 'Generation execution'}
              </p>

              <div className="pt-2 border-t border-[#292E3D]/50 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-emerald-400 font-medium">
                  Status: {item.status}
                </span>

                <button
                  onClick={() => {
                    const promptExtract = item.note?.replace(/^Prompt: "([^"]+)".*$/, '$1') || '';
                    onReRunPrompt(promptExtract, item.model);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#8B9BFF] hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Re-run Prompt</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
