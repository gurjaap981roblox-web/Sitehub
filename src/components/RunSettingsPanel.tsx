/**
 * RunSettingsPanel Component
 * Contextual right-side settings panel inspired by professional AI developer studios.
 * Configures model selection, temperature, token limits, thinking level, tools, and system instructions.
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  HelpCircle,
  Info,
  RotateCcw,
  Sliders,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { RunSettings } from '../types/site';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'google' | 'nvidia' | 'kira' | 'openai';
  providerLabel: string;
  description: string;
  contextWindow: string;
  maxOutputTokens: number;
  modalities: string[];
  capabilities: string[];
  recommendedFor: string;
  latency: string;
  pricingFact: string;
  isDefault: boolean;
  supportsThinking: boolean;
  supportsTemperature: boolean;
}

export const SUPPORTED_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'google',
    providerLabel: 'Google Gemini',
    description: 'Ultra-fast multimodal model optimized for reasoning, agentic coding, and high-speed generation.',
    contextWindow: '1,048,576 tokens',
    maxOutputTokens: 8192,
    modalities: ['Text', 'Code', 'Images', 'Audio'],
    capabilities: ['Streaming', 'Thinking', 'Search Grounding', 'Structured JSON', 'Tool Calling'],
    recommendedFor: 'Default model for real-time chat, token streaming, and full website generation',
    latency: '~240ms TTFT',
    pricingFact: 'Google GenAI Standard Tier (verified 2026)',
    isDefault: true,
    supportsThinking: true,
    supportsTemperature: true,
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'google',
    providerLabel: 'Google Gemini',
    description: 'Flagship deep-reasoning foundation model built for multi-file AST architecture, security auditing, and complex engineering.',
    contextWindow: '2,097,152 tokens',
    maxOutputTokens: 16384,
    modalities: ['Text', 'Code', 'Images', 'Video'],
    capabilities: ['Streaming', 'Extended Thinking', 'Code Execution', 'AST Compilation'],
    recommendedFor: 'Complex enterprise architectures, deep refactoring, and logic debugging',
    latency: '~650ms TTFT',
    pricingFact: 'Google GenAI Paid Tier (verified 2026)',
    isDefault: false,
    supportsThinking: true,
    supportsTemperature: true,
  },
  {
    id: 'nvidia/nemotron-3-ultra',
    name: 'Nemotron 3 Ultra',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM',
    description: 'Enterprise open model with exceptional strict-instruction compliance and accessibility heuristics.',
    contextWindow: '131,072 tokens',
    maxOutputTokens: 4096,
    modalities: ['Text', 'Code'],
    capabilities: ['Streaming', 'Accessibility Auditing', 'Layout Planning'],
    recommendedFor: 'Layout review, WCAG compliance checking, and responsive breakpoint testing',
    latency: '~390ms TTFT',
    pricingFact: 'NVIDIA NIM Developer API (verified 2026)',
    isDefault: false,
    supportsThinking: false,
    supportsTemperature: true,
  },
  {
    id: 'deepseek-v4.1-flash',
    name: 'DeepSeek V4.1 Flash',
    provider: 'kira',
    providerLabel: 'KiraAI / DeepSeek',
    description: 'Specialized code generation engine tailored for TypeScript, Tailwind CSS, and React component trees.',
    contextWindow: '128,000 tokens',
    maxOutputTokens: 8192,
    modalities: ['Text', 'Code'],
    capabilities: ['Streaming', 'Code Generation', 'Fast Completion'],
    recommendedFor: 'Rapid frontend component writing, CSS styling, and snippet generation',
    latency: '~310ms TTFT',
    pricingFact: 'KiraAI Developer API (verified 2026)',
    isDefault: false,
    supportsThinking: false,
    supportsTemperature: true,
  },
];

export const DEFAULT_RUN_SETTINGS: RunSettings = {
  model: 'gemini-3.8-flash',
  provider: 'google',
  temperature: 0.7,
  maxOutputTokens: 4096,
  topP: 0.95,
  topK: 40,
  thinkingLevel: 'medium',
  tools: {
    webSearch: false,
    codeExecution: false,
    structuredOutput: true,
  },
  systemInstructions:
    'You are SiteHub Studio AI, a senior full-stack software engineer and UI architect. Write clean, production-grade code, clear structural explanations, and thoughtful aesthetic recommendations.',
};

interface RunSettingsPanelProps {
  settings: RunSettings;
  onChangeSettings: (settings: RunSettings) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  estimatedPromptTokens?: number;
}

export const RunSettingsPanel: React.FC<RunSettingsPanelProps> = ({
  settings,
  onChangeSettings,
  isOpen,
  onToggleOpen,
  estimatedPromptTokens = 0,
}) => {
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const currentModel =
    SUPPORTED_MODELS.find(m => m.id === settings.model) || SUPPORTED_MODELS[0];

  const handleModelChange = (modelId: string) => {
    const selected = SUPPORTED_MODELS.find(m => m.id === modelId) || SUPPORTED_MODELS[0];
    onChangeSettings({
      ...settings,
      model: selected.id,
      provider: selected.provider,
      maxOutputTokens: Math.min(settings.maxOutputTokens, selected.maxOutputTokens),
    });
  };

  const handleResetDefaults = () => {
    onChangeSettings(DEFAULT_RUN_SETTINGS);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        title="Open Run Settings"
        className="hidden md:flex flex-col items-center gap-1.5 py-3 px-1.5 bg-[#0F1118] border-l border-[#292E3D] hover:bg-[#191D29] text-[#A1A8B8] hover:text-[#F3F5FA] transition-colors select-none text-[11px] font-medium"
      >
        <Sliders className="w-4 h-4 text-[#8B9BFF]" />
        <span className="[writing-mode:vertical-rl] tracking-wider uppercase text-[10px] font-mono">
          Run Settings
        </span>
      </button>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-[#0F1118] border-l border-[#292E3D] flex flex-col h-full overflow-hidden select-none z-20">
      {/* Panel Header */}
      <div className="h-12 px-4 border-b border-[#292E3D] flex items-center justify-between shrink-0 bg-[#131620]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#8B9BFF]" />
          <h2 className="text-xs font-bold tracking-tight uppercase text-[#F3F5FA]">
            Run Settings
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetDefaults}
            title="Reset to defaults"
            className="p-1 rounded hover:bg-[#202536] text-[#737C90] hover:text-[#A1A8B8] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleOpen}
            title="Collapse settings"
            className="p-1 rounded hover:bg-[#202536] text-[#737C90] hover:text-[#A1A8B8] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-[#A1A8B8]">
        {/* Model Selector Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA]">
              Model
            </label>
            <button
              onClick={() => setShowModelInfo(!showModelInfo)}
              className="text-[10px] text-[#8B9BFF] hover:underline flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              <span>{showModelInfo ? 'Hide specs' : 'Specs'}</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={settings.model}
              onChange={e => handleModelChange(e.target.value)}
              className="w-full bg-[#131620] border border-[#292E3D] rounded-lg px-3 py-2 text-xs text-[#F3F5FA] font-medium appearance-none focus:outline-none focus:border-[#8B9BFF] transition-colors pr-8 cursor-pointer"
            >
              <optgroup label="Google Gemini">
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Fast & Agentic)</option>
                <option value="gemini-4-argon">Gemini 4 Argon (Deep Reasoning)</option>
              </optgroup>
              <optgroup label="NVIDIA NIM">
                <option value="nvidia/nemotron-3-ultra">Nemotron 3 Ultra (Audits & Spec)</option>
              </optgroup>
              <optgroup label="KiraAI Coding">
                <option value="deepseek-v4.1-flash">DeepSeek V4.1 Flash (Code Engine)</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737C90] absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Model Information Card */}
          {showModelInfo && (
            <div className="p-3 bg-[#131620] border border-[#292E3D] rounded-xl space-y-2 text-[11px] animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#292E3D]/60 pb-1.5">
                <span className="font-bold text-[#F3F5FA]">{currentModel.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#191D29] text-[#8B9BFF]">
                  {currentModel.providerLabel}
                </span>
              </div>
              <p className="text-[10px] text-[#A1A8B8] leading-relaxed">
                {currentModel.description}
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                <div>
                  <span className="text-[#737C90]">Context: </span>
                  <span className="text-[#F3F5FA]">{currentModel.contextWindow}</span>
                </div>
                <div>
                  <span className="text-[#737C90]">Max Out: </span>
                  <span className="text-[#F3F5FA]">{currentModel.maxOutputTokens.toLocaleString()} tok</span>
                </div>
                <div>
                  <span className="text-[#737C90]">Latency: </span>
                  <span className="text-[#F3F5FA]">{currentModel.latency}</span>
                </div>
                <div>
                  <span className="text-[#737C90]">Pricing: </span>
                  <span className="text-[#F3F5FA]">Verified Tier</span>
                </div>
              </div>
              <div className="text-[9px] text-[#737C90] pt-1 border-t border-[#292E3D]/60">
                {currentModel.pricingFact}
              </div>
            </div>
          )}
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA] flex items-center gap-1.5">
              <span>Temperature</span>
              <span className="font-normal font-mono text-[#737C90] lowercase text-[10px]">
                (creativity)
              </span>
            </label>
            <span className="font-mono text-xs font-semibold text-[#8B9BFF]">
              {settings.temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={settings.temperature}
            onChange={e =>
              onChangeSettings({ ...settings, temperature: parseFloat(e.target.value) })
            }
            className="w-full accent-[#8B9BFF] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#737C90]">
            <span>0.0 (Precise)</span>
            <span>1.0 (Balanced)</span>
            <span>2.0 (Creative)</span>
          </div>
        </div>

        {/* Token Limits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA]">
              Max Output Tokens
            </label>
            <span className="font-mono text-xs font-semibold text-[#8B9BFF]">
              {settings.maxOutputTokens}
            </span>
          </div>
          <input
            type="range"
            min={256}
            max={currentModel.maxOutputTokens}
            step={256}
            value={settings.maxOutputTokens}
            onChange={e =>
              onChangeSettings({
                ...settings,
                maxOutputTokens: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-[#8B9BFF] cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-[#737C90]">
            <span>Est. Prompt: ~{estimatedPromptTokens} tok</span>
            <span>Limit: {currentModel.maxOutputTokens}</span>
          </div>
        </div>

        {/* Thinking / Reasoning Mode (For supported Gemini models) */}
        {currentModel.supportsThinking && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA]">
              Reasoning & Thinking
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#131620] border border-[#292E3D] rounded-lg">
              {(['none', 'low', 'medium', 'high'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => onChangeSettings({ ...settings, thinkingLevel: level })}
                  className={`py-1 text-[10px] font-medium uppercase rounded transition-colors ${
                    settings.thinkingLevel === level
                      ? 'bg-[#8B9BFF] text-black font-bold'
                      : 'text-[#737C90] hover:text-[#F3F5FA]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tools Section */}
        <div className="border-t border-[#292E3D] pt-4 space-y-3">
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA]"
          >
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#8B9BFF]" />
              <span>Tools & Grounding</span>
            </div>
            {isToolsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#737C90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#737C90]" />
            )}
          </button>

          {isToolsOpen && (
            <div className="space-y-2.5 pt-1">
              <label className="flex items-center justify-between p-2 rounded-lg bg-[#131620] border border-[#292E3D] cursor-pointer hover:border-[#8B9BFF]/40 transition-colors">
                <div>
                  <div className="text-[11px] font-medium text-[#F3F5FA]">Structured JSON</div>
                  <div className="text-[9px] text-[#737C90]">Strict AST schema output</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.tools.structuredOutput}
                  onChange={e =>
                    onChangeSettings({
                      ...settings,
                      tools: { ...settings.tools, structuredOutput: e.target.checked },
                    })
                  }
                  className="accent-[#8B9BFF] cursor-pointer w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[#131620] border border-[#292E3D] cursor-pointer hover:border-[#8B9BFF]/40 transition-colors">
                <div>
                  <div className="text-[11px] font-medium text-[#F3F5FA]">Code Execution</div>
                  <div className="text-[9px] text-[#737C90]">Sandbox verification</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.tools.codeExecution}
                  onChange={e =>
                    onChangeSettings({
                      ...settings,
                      tools: { ...settings.tools, codeExecution: e.target.checked },
                    })
                  }
                  className="accent-[#8B9BFF] cursor-pointer w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-[#131620] border border-[#292E3D] cursor-pointer hover:border-[#8B9BFF]/40 transition-colors">
                <div>
                  <div className="text-[11px] font-medium text-[#F3F5FA]">Web Search</div>
                  <div className="text-[9px] text-[#737C90]">Google Search grounding</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.tools.webSearch}
                  onChange={e =>
                    onChangeSettings({
                      ...settings,
                      tools: { ...settings.tools, webSearch: e.target.checked },
                    })
                  }
                  className="accent-[#8B9BFF] cursor-pointer w-4 h-4"
                />
              </label>
            </div>
          )}
        </div>

        {/* System Instructions & Advanced */}
        <div className="border-t border-[#292E3D] pt-4 space-y-3">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#F3F5FA]"
          >
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8B9BFF]" />
              <span>System & Advanced</span>
            </div>
            {isAdvancedOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#737C90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#737C90]" />
            )}
          </button>

          {isAdvancedOpen && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-[#F3F5FA] block mb-1">
                  System Instructions
                </label>
                <textarea
                  rows={4}
                  value={settings.systemInstructions}
                  onChange={e =>
                    onChangeSettings({
                      ...settings,
                      systemInstructions: e.target.value,
                    })
                  }
                  placeholder="Define role, tone, architecture rules..."
                  className="w-full bg-[#131620] border border-[#292E3D] rounded-lg p-2.5 text-[11px] text-[#F3F5FA] placeholder-[#737C90] resize-y focus:outline-none focus:border-[#8B9BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#F3F5FA] block mb-1">
                    Top-P
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings.topP}
                    onChange={e =>
                      onChangeSettings({
                        ...settings,
                        topP: parseFloat(e.target.value) || 0.95,
                      })
                    }
                    className="w-full bg-[#131620] border border-[#292E3D] rounded-lg px-2 py-1.5 text-xs text-[#F3F5FA] font-mono focus:outline-none focus:border-[#8B9BFF]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#F3F5FA] block mb-1">
                    Top-K
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    step={1}
                    value={settings.topK}
                    onChange={e =>
                      onChangeSettings({
                        ...settings,
                        topK: parseInt(e.target.value, 10) || 40,
                      })
                    }
                    className="w-full bg-[#131620] border border-[#292E3D] rounded-lg px-2 py-1.5 text-xs text-[#F3F5FA] font-mono focus:outline-none focus:border-[#8B9BFF]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
