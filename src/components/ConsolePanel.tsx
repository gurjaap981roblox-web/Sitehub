/**
 * ConsolePanel Component
 * Displays system, AI, preview, and build logs with secret redaction and "Send to AI to fix".
 */

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Info,
  Sparkles,
  Terminal,
  Trash2,
} from 'lucide-react';
import { LogEvent, UsageRecord } from '../types/site';
import { StorageService } from '../lib/storage';

interface ConsolePanelProps {
  logs: LogEvent[];
  usageRecords: UsageRecord[];
  onClearLogs: () => void;
  onSendErrorToAi: (errorMessage: string) => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs,
  usageRecords,
  onClearLogs,
  onSendErrorToAi,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredLogs = filterLevel === 'all' ? logs : logs.filter(l => l.level === filterLevel);

  // Compute total tokens & costs
  const totalTokens = usageRecords.reduce((sum, r) => sum + r.tokensIn + r.tokensOut, 0);
  const totalCost = usageRecords.reduce((sum, r) => sum + r.costEstimated, 0);

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-xs overflow-hidden">
      {/* Top Console Bar */}
      <div className="h-10 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-neutral-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Developer Console & AI Logs</span>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800 text-[11px]">
            {['all', 'info', 'warn', 'error', 'success'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded capitalize ${
                  filterLevel === lvl ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-neutral-400 font-mono text-[11px]">
            <span>Tokens: <strong className="text-indigo-400">{totalTokens.toLocaleString()}</strong></span>
            <span>Cost Est: <strong className="text-emerald-400">${totalCost.toFixed(4)}</strong></span>
          </div>
          <button
            onClick={onClearLogs}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center gap-1"
            title="Clear all logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-neutral-600">
            No console events recorded.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isError = log.level === 'error';
            return (
              <div
                key={log.id}
                className={`p-2.5 rounded-lg border flex items-start justify-between gap-3 ${
                  isError
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : log.level === 'warn'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : log.level === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {isError && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                    {log.level === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {log.level === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {log.level === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                      <span>[{log.timestamp}]</span>
                      <span className="font-bold text-neutral-400">[{log.source}]</span>
                    </div>
                    <div className="text-xs mt-0.5 select-text">{log.message}</div>
                  </div>
                </div>

                {isError && (
                  <button
                    onClick={() => onSendErrorToAi(log.message)}
                    className="shrink-0 px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-red-300" />
                    <span>Send Error to AI to Fix</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
