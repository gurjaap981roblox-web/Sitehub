/**
 * VisualCanvas Component
 * Responsive canvas supporting desktop, tablet, and mobile viewports, section inspector,
 * add section drawer, and zoom controls.
 */

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Layers,
  Maximize,
  Minimize2,
  Plus,
  Sliders,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { DeviceMode, LanguageCode, SectionDocument, SectionType, SiteDocument } from '../types/site';
import { LiveSiteRenderer } from './LiveSiteRenderer';
import { translations } from '../lib/translations';

interface VisualCanvasProps {
  site: SiteDocument;
  onUpdateSite: (site: SiteDocument) => void;
  deviceMode: DeviceMode;
  appName?: string;
  currentLang: LanguageCode;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
  site,
  onUpdateSite,
  deviceMode,
  appName = 'SiteHub',
  currentLang,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    site.pages[0]?.sections[1]?.id || site.pages[0]?.sections[0]?.id
  );
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const t = translations[currentLang] || translations.en;
  const activePage = site.pages[0];
  const selectedSection = activePage?.sections.find(s => s.id === selectedSectionId);

  // Section Reordering
  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!activePage) return;
    const index = activePage.sections.findIndex(s => s.id === sectionId);
    if (index < 0) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activePage.sections.length) return;

    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const sections = cloned.pages[0].sections;
    const [moved] = sections.splice(index, 1);
    sections.splice(targetIndex, 0, moved);

    cloned.version += 1;
    onUpdateSite(cloned);
  };

  // Delete Section
  const handleDeleteSection = (sectionId: string) => {
    if (!activePage) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    cloned.pages[0].sections = cloned.pages[0].sections.filter(s => s.id !== sectionId);
    cloned.version += 1;
    onUpdateSite(cloned);
    setSelectedSectionId(cloned.pages[0].sections[0]?.id);
  };

  // Toggle Section Visibility
  const handleToggleVisibility = (sectionId: string) => {
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const target = cloned.pages[0].sections.find(s => s.id === sectionId);
    if (target) {
      target.isHidden = !target.isHidden;
      onUpdateSite(cloned);
    }
  };

  // Update Section Props
  const handleUpdateSectionTitle = (newTitle: string) => {
    if (!selectedSectionId) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const target = cloned.pages[0].sections.find(s => s.id === selectedSectionId);
    if (target) {
      target.title = newTitle;
      onUpdateSite(cloned);
    }
  };

  const handleUpdateSectionSubtitle = (newSubtitle: string) => {
    if (!selectedSectionId) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const target = cloned.pages[0].sections.find(s => s.id === selectedSectionId);
    if (target) {
      target.subtitle = newSubtitle;
      onUpdateSite(cloned);
    }
  };

  // Add Section Generator
  const handleAddSection = (type: SectionType) => {
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const newId = `sec-${type}-${Date.now()}`;
    let newSection: SectionDocument = {
      id: newId,
      type,
      title: `New ${type.toUpperCase()} Section`,
      props: {},
    };

    if (type === 'hero') {
      newSection.title = 'Transform Your Digital Presence';
      newSection.subtitle = 'Designed with craft and precision.';
      newSection.props = { primaryCta: 'Get Started', secondaryCta: 'Learn More' };
    } else if (type === 'features') {
      newSection.title = 'Core Capabilities';
      newSection.props = {
        items: [
          { title: 'Blazing Performance', description: 'Engineered for sub-100ms load times.' },
          { title: 'Global Edge Delivery', description: 'Zero-latency replication worldwide.' },
        ],
      };
    } else if (type === 'pricing') {
      newSection.title = 'Simple Pricing Plans';
      newSection.props = {
        plans: [
          { name: 'Starter', price: '$19', period: '/mo', features: ['Core Features', 'Community Support'] },
          { name: 'Pro', price: '$49', period: '/mo', isPopular: true, features: ['Unlimited Sites', 'Priority Support'] },
        ],
      };
    } else if (type === 'booking') {
      newSection.title = 'Online Reservations';
      newSection.subtitle = 'Book in seconds with immediate confirmation.';
      newSection.props = { submitText: 'Confirm Booking' };
    } else if (type === 'store') {
      newSection.title = 'Featured Products';
      newSection.props = {
        products: [
          { id: `p-${Date.now()}-1`, name: 'Artisan Vessel', price: 29, image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=600&q=80' },
        ],
      };
    } else if (type === 'faq') {
      newSection.title = 'Frequently Asked Questions';
      newSection.props = {
        items: [{ question: 'What is included?', answer: 'Everything needed to launch right away.' }],
      };
    } else if (type === 'contact') {
      newSection.title = 'Get in Touch';
      newSection.props = { submitLabel: 'Send Inquiry' };
    }

    cloned.pages[0].sections.splice(Math.max(1, cloned.pages[0].sections.length - 1), 0, newSection);
    cloned.version += 1;
    onUpdateSite(cloned);
    setSelectedSectionId(newId);
    setIsAddSectionOpen(false);
  };

  // Device width mapping
  const deviceWidth =
    deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%';

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
      {/* Top Canvas Bar */}
      <div className="h-10 bg-neutral-900/90 border-b border-neutral-800 px-4 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{activePage?.title || 'Home'}</span>
            <span className="text-[10px] text-neutral-500">/{activePage?.slug}</span>
          </div>

          <button
            onClick={() => setIsAddSectionOpen(true)}
            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center gap-1 border border-neutral-700/60"
          >
            <Plus className="w-3 h-3 text-indigo-400" />
            <span>{t.actions.addSection}</span>
          </button>
        </div>

        {/* Zoom & Inspector Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-neutral-400">
            <button
              onClick={() => setZoomScale(s => Math.max(0.5, s - 0.1))}
              className="hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono text-[10px] w-8 text-center">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(s => Math.min(1.5, s + 0.1))}
              className="hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button onClick={() => setZoomScale(1)} className="hover:text-white text-[10px] pl-1 font-mono">
              100%
            </button>
          </div>

          <button
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={`p-1 rounded text-xs flex items-center gap-1 ${
              isInspectorOpen ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Section Inspector"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Inspector</span>
          </button>
        </div>
      </div>

      {/* Main Canvas + Inspector Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Scrollable Container */}
        <div className="flex-1 overflow-auto p-4 flex justify-center bg-neutral-950/70 relative">
          <div
            style={{
              width: deviceWidth,
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className={`min-h-full rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 bg-neutral-900 transition-all ${
              deviceMode !== 'desktop' ? 'my-4 ring-8 ring-neutral-900/90 shadow-neutral-950/80' : ''
            }`}
          >
            <LiveSiteRenderer
              site={site}
              selectedSectionId={selectedSectionId}
              onSelectSection={id => {
                setSelectedSectionId(id);
                setIsInspectorOpen(true);
              }}
              appName={appName}
              isPreview={true}
            />
          </div>
        </div>

        {/* Section Inspector Sidebar */}
        {isInspectorOpen && selectedSection && (
          <div className="w-72 bg-neutral-900 border-l border-neutral-800 flex flex-col justify-between shrink-0 h-full overflow-y-auto text-xs animate-in slide-in-from-right duration-200">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-1.5 font-bold text-neutral-200 uppercase tracking-wider text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{selectedSection.type} Inspector</span>
                </div>
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={selectedSection.title || ''}
                  onChange={e => handleUpdateSectionTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Subtitle Input */}
              {selectedSection.subtitle !== undefined && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Subtitle / Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={selectedSection.subtitle || ''}
                    onChange={e => handleUpdateSectionSubtitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                  />
                </div>
              )}

              {/* Reordering Controls */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Position & Visibility
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMoveSection(selectedSection.id, 'up')}
                    className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 flex items-center justify-center gap-1"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span>Move Up</span>
                  </button>
                  <button
                    onClick={() => handleMoveSection(selectedSection.id, 'down')}
                    className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 flex items-center justify-center gap-1"
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span>Move Down</span>
                  </button>
                </div>

                <button
                  onClick={() => handleToggleVisibility(selectedSection.id)}
                  className="w-full p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 flex items-center justify-center gap-1.5"
                >
                  {selectedSection.isHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Unhide Section</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Hide from Preview</span>
                    </>
                  )}
                </button>
              </div>

              {/* JSON Props Raw Inspect */}
              <div className="space-y-1 pt-2 border-t border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Props Schema
                </div>
                <pre className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-[10px] font-mono text-neutral-400 overflow-x-auto max-h-36">
                  {JSON.stringify(selectedSection.props, null, 2)}
                </pre>
              </div>
            </div>

            {/* Delete Section Action */}
            <div className="p-4 border-t border-neutral-800">
              <button
                onClick={() => handleDeleteSection(selectedSection.id)}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Section</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal / Drawer */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-base text-white">Add Pre-built Section Component</h3>
              <button
                onClick={() => setIsAddSectionOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { type: 'hero', name: 'Hero Banner', desc: 'Headline, CTA, metrics' },
                { type: 'features', name: 'Feature Cards', desc: 'Benefits with icons' },
                { type: 'menu', name: 'Restaurant Menu', desc: 'Categories, prices, badges' },
                { type: 'booking', name: 'Table Booking', desc: 'Interactive reservation form' },
                { type: 'store', name: 'Artisan Store', desc: 'Product cards & cart' },
                { type: 'pricing', name: 'Pricing Plans', desc: '3-tier pricing matrix' },
                { type: 'showcase', name: 'Gallery / Showcase', desc: 'Visual portfolio grid' },
                { type: 'testimonials', name: 'Testimonials', desc: 'Reviews with star ratings' },
                { type: 'faq', name: 'FAQ Accordion', desc: 'Collapsible Q&A' },
                { type: 'contact', name: 'Contact Form', desc: 'Inquiry & message box' },
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => handleAddSection(item.type as SectionType)}
                  className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 rounded-xl text-left space-y-1 transition-all group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-indigo-400">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
