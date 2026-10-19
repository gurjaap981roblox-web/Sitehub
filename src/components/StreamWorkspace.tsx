/**
 * StreamWorkspace Component
 * Real-time progressive token streaming workspace with live throughput metrics,
 * chunk buffer, pause/stop controls, and project application.
 */

import React, { useRef, useState } from 'react';
import {
  Activity,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Zap,
} from 'lucide-react';
import { RunSettings } from '../types/site';

interface StreamWorkspaceProps {
  runSettings: RunSettings;
  onApplyToProject?: (codeOrText: string) => void;
}

export const StreamWorkspace: React.FC<StreamWorkspaceProps> = ({
  runSettings,
  onApplyToProject,
}) => {
  const [streamPrompt, setStreamPrompt] = useState(
    'Synthesize a full-stack TypeScript architecture for a real-time collaborative workspace with WebSocket state synchronization.'
  );
  const [streamOutput, setStreamOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokensReceived, setTokensReceived] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<any>(null);

  const startStream = async () => {
    if (!streamPrompt.trim() || isStreaming) return;
    setIsStreaming(true);
    setStreamOutput('');
    setTokensReceived(0);
    setElapsedSeconds(0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - startTime) / 100) / 10);
    }, 100);

    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: streamPrompt,
          model: runSettings.model,
          systemInstruction: runSettings.systemInstructions,
          temperature: runSettings.temperature,
          maxOutputTokens: runSettings.maxOutputTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed: HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const rawData = trimmed.slice(6);
            if (rawData === '[DONE]') break;
            try {
              const parsed = JSON.parse(rawData);
              if (parsed.chunk) {
                setStreamOutput(prev => prev + parsed.chunk);
                setTokensReceived(prev => prev + 1);
              }
            } catch {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setStreamOutput(prev => prev + `\n\n[Stream Error]: ${err.message}`);
      }
    } finally {
      setIsStreaming(false);
      clearInterval(timerRef.current);
    }
  };

  const stopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    clearInterval(timerRef.current);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(streamOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tokensPerSec =
    elapsedSeconds > 0 ? (tokensReceived / elapsedSeconds).toFixed(1) : '0.0';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden select-none">
      {/* Stream Workspace Header */}
      <div className="h-12 px-6 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#0F1118]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <Zap className="w-4 h-4 text-[#8B9BFF]" />
          <span className="font-bold text-[#F3F5FA]">Real-Time Token Streamer</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[#A1A8B8] font-mono text-[11px]">{runSettings.model}</span>
        </div>

        {/* Live Stream Telemetry Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#A1A8B8]">
          <div className="flex items-center gap-1.5">
            <Activity className={`w-3.5 h-3.5 ${isStreaming ? 'text-emerald-400 animate-pulse' : 'text-[#737C90]'}`} />
            <span>{tokensPerSec} tok/s</span>
          </div>
          <div>
            <span className="text-[#737C90]">Received: </span>
            <span className="text-[#F3F5FA] font-bold">{tokensReceived}</span>
          </div>
          <div>
            <span className="text-[#737C90]">Time: </span>
            <span className="text-[#F3F5FA]">{elapsedSeconds.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5 max-w-4xl mx-auto w-full">
        {/* Stream Prompt Input Card */}
        <div className="p-4 rounded-2xl bg-[#131620] border border-[#292E3D] space-y-3 shadow-xl">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA] flex items-center justify-between">
            <span>Streaming Prompt Specification</span>
            <span className="font-mono text-[#8B9BFF] text-[10px] lowercase font-normal">
              SSE progressive generation
            </span>
          </label>
          <textarea
            rows={2}
            value={streamPrompt}
            onChange={e => setStreamPrompt(e.target.value)}
            disabled={isStreaming}
            className="w-full bg-[#0B0D12] border border-[#292E3D] rounded-xl p-3 text-xs text-[#F3F5FA] placeholder-[#737C90] resize-none focus:outline-none focus:border-[#8B9BFF]"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#737C90]">
              Tokens stream into the client progressively as the model generates them.
            </span>
            <div className="flex items-center gap-2">
              {isStreaming ? (
                <button
                  onClick={stopStream}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Stream</span>
                </button>
              ) : (
                <button
                  onClick={startStream}
                  className="px-4 py-1.5 rounded-lg bg-[#8B9BFF] hover:bg-[#A5B4FC] text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#8B9BFF]/20"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Stream Response</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Streaming Terminal / Output Buffer */}
        <div className="rounded-2xl bg-[#0F1118] border border-[#292E3D] shadow-2xl overflow-hidden flex flex-col min-h-[380px]">
          <div className="h-10 px-4 bg-[#131620] border-b border-[#292E3D] flex items-center justify-between text-xs text-[#A1A8B8]">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span>LIVE TOKEN BUFFER</span>
            </div>
            {streamOutput && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-[#A1A8B8] hover:text-[#F3F5FA] px-2 py-0.5 rounded hover:bg-[#191D29]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Buffer</span>
                    </>
                  )}
                </button>
                {onApplyToProject && (
                  <button
                    onClick={() => onApplyToProject(streamOutput)}
                    className="flex items-center gap-1 text-[11px] text-[#8B9BFF] hover:underline px-2 py-0.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Apply to Site</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-[#F3F5FA] leading-relaxed whitespace-pre-wrap selection:bg-[#8B9BFF] selection:text-black">
            {streamOutput ? (
              <>
                {streamOutput}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-[#8B9BFF] ml-1 animate-pulse align-middle" />
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#737C90] py-16 space-y-2">
                <Zap className="w-8 h-8 text-[#292E3D]" />
                <p>Click "Stream Response" above to initiate real-time token streaming.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
