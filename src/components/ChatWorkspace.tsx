/**
 * ChatWorkspace Component
 * Conversational AI development workspace with syntax highlighting,
 * code extraction, token counters, starter prompt cards, and bottom composer.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FolderGit2,
  ImagePlus,
  Layers,
  Layout,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import { ChatMessage, RunSettings, SiteDocument } from '../types/site';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isGenerating: boolean;
  onStopGeneration?: () => void;
  onClearConversation: () => void;
  runSettings: RunSettings;
  onOpenBuildMode: (prompt?: string) => void;
  onOpenCodeMode: (codeSnippet?: string) => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  onStopGeneration,
  onClearConversation,
  runSettings,
  onOpenBuildMode,
  onOpenCodeMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const toSend = inputText.trim();
    setInputText('');
    onSendMessage(toSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const starterCards = [
    {
      icon: Layout,
      title: 'Build a Complete Website',
      description: 'Synthesize a luxury hospitality portal or SaaS platform with live interactive preview.',
      prompt: 'Build a luxury boutique hotel booking platform with suites, dates, amenities, and concierge booking.',
      mode: 'build',
    },
    {
      icon: Code2,
      title: 'Generate React Components',
      description: 'Generate high-performance accessible UI components with TypeScript and Tailwind CSS.',
      prompt: 'Write an accessible multi-step checkout form in React with input validation and summary card.',
      mode: 'chat',
    },
    {
      icon: Zap,
      title: 'Architect Full-Stack System',
      description: 'Design database schemas, secure Express routes, and authentication workflows.',
      prompt: 'Architect a full-stack REST API with cookie session authentication and GitHub OAuth.',
      mode: 'chat',
    },
    {
      icon: ImagePlus,
      title: 'Design Visual Assets',
      description: 'Plan photography and editorial hero banners for landing pages and showcases.',
      prompt: 'Generate prompt specifications and visual layout for an architectural studio portfolio.',
      mode: 'chat',
    },
  ];

  const estimatedTokens = Math.max(1, Math.floor(inputText.length * 1.3));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden relative select-none">
      {/* Top Conversation Header */}
      <div className="h-12 px-6 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#0F1118]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#F3F5FA]">AI Chat Studio</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[#A1A8B8] font-mono text-[11px]">{runSettings.model}</span>
          <span className="text-[#737C90]">·</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#191D29] text-[#8B9BFF]">
            {messages.length} {messages.length === 1 ? 'turn' : 'turns'}
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearConversation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#191D29] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Thread</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B9BFF] to-[#6366f1] p-[1px] shadow-2xl shadow-[#8B9BFF]/20">
                <div className="w-full h-full bg-[#0B0D12] rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#8B9BFF]" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F5FA] tracking-tight">
                Welcome to SiteHub Studio
              </h1>
              <p className="text-[#A1A8B8] text-sm max-w-xl mx-auto leading-relaxed">
                Explore ideas, generate code, and build your next project using real multi-model intelligence.
              </p>
            </div>

            {/* Starter Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {starterCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (card.mode === 'build') {
                        onOpenBuildMode(card.prompt);
                      } else {
                        setInputText(card.prompt);
                        textareaRef.current?.focus();
                      }
                    }}
                    className="text-left p-4 rounded-xl bg-[#131620] border border-[#292E3D] hover:border-[#8B9BFF]/60 hover:bg-[#191D29] transition-all group flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-[#191D29] border border-[#292E3D] flex items-center justify-center text-[#8B9BFF] group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h2 className="text-xs font-bold text-[#F3F5FA] group-hover:text-[#8B9BFF] transition-colors">
                        {card.title}
                      </h2>
                      <p className="text-[11px] text-[#A1A8B8] leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#292E3D]/60 flex items-center justify-between text-[10px] text-[#737C90] group-hover:text-[#F3F5FA]">
                      <span>{card.mode === 'build' ? 'Open in Build Mode' : 'Draft Prompt'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#8B9BFF]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#191D29] border border-[#292E3D] flex items-center justify-center text-[#8B9BFF] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-[#191D29] border border-[#292E3D] text-[#F3F5FA]'
                      : 'bg-[#131620] border border-[#292E3D] text-[#F3F5FA] shadow-xl'
                  }`}
                >
                  {/* Message Meta Info */}
                  <div className="flex items-center justify-between text-[10px] text-[#737C90] border-b border-[#292E3D]/50 pb-2">
                    <span className="font-semibold text-[#A1A8B8]">
                      {msg.role === 'user' ? 'You' : `SiteHub (${msg.modelUsed || runSettings.model})`}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      {msg.durationMs && <span>{msg.durationMs}ms</span>}
                      {msg.tokensOut && <span>· {msg.tokensOut} tok</span>}
                      <span>· {msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-wrap leading-relaxed text-[#F3F5FA]">
                    {msg.content}
                  </div>

                  {/* Parsed Code Blocks if any */}
                  {msg.codeBlocks && msg.codeBlocks.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {msg.codeBlocks.map((block, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl overflow-hidden border border-[#292E3D] bg-[#0B0D12]"
                        >
                          <div className="px-3 py-1.5 bg-[#191D29] border-b border-[#292E3D] flex items-center justify-between text-[10px] text-[#A1A8B8]">
                            <span className="font-mono text-[#8B9BFF] font-semibold">
                              {block.language || 'code'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopy(block.code, `code-${msg.id}-${idx}`)}
                                className="flex items-center gap-1 hover:text-[#F3F5FA]"
                              >
                                {copiedId === `code-${msg.id}-${idx}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => onOpenCodeMode(block.code)}
                                className="flex items-center gap-1 hover:text-[#F3F5FA]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Code Studio</span>
                              </button>
                            </div>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-[#F3F5FA] overflow-x-auto leading-relaxed">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#202536] border border-[#292E3D] flex items-center justify-center text-[#F3F5FA] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Active Generation Loading Indicator */}
            {isGenerating && (
              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#191D29] border border-[#292E3D] flex items-center justify-center text-[#8B9BFF] shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-[#131620] border border-[#292E3D] text-xs text-[#A1A8B8] flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#8B9BFF] animate-ping" />
                  <span>Generating response via {runSettings.model}...</span>
                  {onStopGeneration && (
                    <button
                      onClick={onStopGeneration}
                      className="ml-3 px-2 py-0.5 rounded bg-[#202536] hover:bg-[#292E3D] text-[10px] text-[#F3F5FA] flex items-center gap-1"
                    >
                      <Square className="w-2.5 h-2.5 text-rose-400 fill-current" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Fixed Prompt Composer */}
      <div className="p-4 border-t border-[#292E3D] bg-[#0F1118]/90 backdrop-blur-md shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
          <div className="relative rounded-2xl bg-[#131620] border border-[#292E3D] focus-within:border-[#8B9BFF] transition-all shadow-2xl p-2.5">
            <textarea
              ref={textareaRef}
              rows={3}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Ask anything, design a component, or prompt: 'Build a luxury hotel booking site'..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#F3F5FA] placeholder-[#737C90] resize-none focus:outline-none p-2 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1 border-t border-[#292E3D]/50 px-1 text-[11px] text-[#737C90]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#191D29] text-[#8B9BFF]">
                  {runSettings.model}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline font-mono text-[10px]">
                  ~{estimatedTokens} tokens
                </span>
                <span className="hidden md:inline text-[10px] text-[#737C90]">
                  (Shift+Enter for newline)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={onStopGeneration}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors font-medium flex items-center gap-1.5 text-xs"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-[#8B9BFF] hover:bg-[#A5B4FC] disabled:opacity-40 disabled:hover:bg-[#8B9BFF] text-black font-semibold transition-all flex items-center gap-1.5 text-xs shadow-md shadow-[#8B9BFF]/20"
                  >
                    <span>Run</span>
                    <Send className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
