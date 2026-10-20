/**
 * ComponentLibraryDrawer Component
 * AI Studio styled drawer for browsing, dragging, and dropping pre-generated AI components
 * directly into the site hierarchy and visual canvas.
 */

import React, { useState } from 'react';
import {
  Boxes,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  GripVertical,
  Grid,
  HelpCircle,
  Layers,
  Layout,
  Mail,
  Plus,
  Quote,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react';
import { SectionDocument, SiteDocument } from '../types/site';
import {
  COMPONENT_CATEGORIES,
  COMPONENT_TEMPLATES,
  ComponentTemplate,
} from '../lib/componentLibrary';

interface ComponentLibraryDrawerProps {
  site: SiteDocument;
  activePageId: string;
  onUpdateSite: (site: SiteDocument) => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectSection?: (sectionId: string) => void;
  selectedSectionId?: string;
  onDragStartComponent?: (template: ComponentTemplate) => void;
  onDragEndComponent?: () => void;
}

export const ComponentLibraryDrawer: React.FC<ComponentLibraryDrawerProps> = ({
  site,
  activePageId,
  onUpdateSite,
  isOpen,
  onClose,
  onSelectSection,
  selectedSectionId,
  onDragStartComponent,
  onDragEndComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'outline'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedTemplateId, setDraggedTemplateId] = useState<string | null>(null);
  const [dragOverOutlineIndex, setDragOverOutlineIndex] = useState<number | null>(null);

  const activePage =
    site.pages.find(p => p.id === activePageId || p.slug === activePageId) || site.pages[0];

  // Filter templates
  const filteredTemplates = COMPONENT_TEMPLATES.filter(tpl => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Insert component directly at index or end of page
  const handleInsertComponent = (template: ComponentTemplate, targetIndex?: number) => {
    if (!activePage) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const page = cloned.pages.find(p => p.id === activePage.id) || cloned.pages[0];
    const newSection = template.createSection();

    if (typeof targetIndex === 'number' && targetIndex >= 0) {
      page.sections.splice(targetIndex, 0, newSection);
    } else {
      // Insert right before footer if footer exists, else append
      const footerIndex = page.sections.findIndex(s => s.type === 'footer');
      if (footerIndex >= 0) {
        page.sections.splice(footerIndex, 0, newSection);
      } else {
        page.sections.push(newSection);
      }
    }

    cloned.version += 1;
    cloned.updatedAt = new Date().toISOString();
    onUpdateSite(cloned);
    if (onSelectSection) onSelectSection(newSection.id);
  };

  // Reorder sections in outline
  const handleReorderSection = (fromIndex: number, toIndex: number) => {
    if (!activePage || fromIndex === toIndex) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const page = cloned.pages.find(p => p.id === activePage.id) || cloned.pages[0];
    const [moved] = page.sections.splice(fromIndex, 1);
    page.sections.splice(toIndex, 0, moved);
    cloned.version += 1;
    onUpdateSite(cloned);
  };

  // Delete section from outline
  const handleDeleteSection = (sectionId: string) => {
    if (!activePage) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const page = cloned.pages.find(p => p.id === activePage.id) || cloned.pages[0];
    page.sections = page.sections.filter(s => s.id !== sectionId);
    cloned.version += 1;
    onUpdateSite(cloned);
  };

  // Toggle visibility
  const handleToggleVisibility = (sectionId: string) => {
    if (!activePage) return;
    const cloned = JSON.parse(JSON.stringify(site)) as SiteDocument;
    const page = cloned.pages.find(p => p.id === activePage.id) || cloned.pages[0];
    const sec = page.sections.find(s => s.id === sectionId);
    if (sec) {
      sec.isHidden = !sec.isHidden;
      cloned.version += 1;
      onUpdateSite(cloned);
    }
  };

  // Render Category Icon Helper
  const renderTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'Star':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4 text-sky-400" />;
      case 'Layout':
        return <Layout className="w-4 h-4 text-indigo-400" />;
      case 'Grid':
        return <Grid className="w-4 h-4 text-purple-400" />;
      case 'Mail':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-teal-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      default:
        return <Boxes className="w-4 h-4 text-indigo-400" />;
    }
  };

  // Render Mini Visual Wireframe Preview
  const renderMiniWireframe = (category: string) => {
    switch (category) {
      case 'pricing':
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1 flex items-center justify-between gap-1">
            <div className="flex-1 h-full bg-neutral-900 rounded flex flex-col justify-center items-center px-1">
              <div className="w-4 h-1 bg-neutral-700 rounded-full mb-0.5"></div>
              <div className="w-3 h-1.5 bg-neutral-600 rounded-sm"></div>
            </div>
            <div className="flex-1 h-full bg-indigo-950/40 border border-indigo-500/40 rounded flex flex-col justify-center items-center px-1">
              <div className="w-5 h-1 bg-indigo-400 rounded-full mb-0.5"></div>
              <div className="w-4 h-1.5 bg-indigo-500 rounded-sm"></div>
            </div>
            <div className="flex-1 h-full bg-neutral-900 rounded flex flex-col justify-center items-center px-1">
              <div className="w-4 h-1 bg-neutral-700 rounded-full mb-0.5"></div>
              <div className="w-3 h-1.5 bg-neutral-600 rounded-sm"></div>
            </div>
          </div>
        );
      case 'social-proof':
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1.5 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="w-full h-1.5 bg-neutral-700 rounded-full"></div>
              <div className="w-2/3 h-1 bg-neutral-800 rounded-full"></div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between px-1 py-0.5 bg-neutral-900 rounded text-[8px] text-neutral-400">
              <span className="w-16 h-1 bg-neutral-700 rounded-full"></span>
              <span className="text-neutral-500 font-mono">+</span>
            </div>
            <div className="flex items-center justify-between px-1 py-0.5 bg-neutral-900 rounded text-[8px] text-neutral-400">
              <span className="w-12 h-1 bg-neutral-700 rounded-full"></span>
              <span className="text-neutral-500 font-mono">+</span>
            </div>
          </div>
        );
      case 'hero':
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1.5 flex flex-col items-center justify-center space-y-1 text-center">
            <div className="w-20 h-1.5 bg-indigo-400/80 rounded-full"></div>
            <div className="w-28 h-1 bg-neutral-700 rounded-full"></div>
            <div className="w-10 h-2 bg-indigo-600 rounded text-[7px] text-white"></div>
          </div>
        );
      case 'features':
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1 flex items-center gap-1">
            <div className="flex-1 h-full bg-neutral-900 rounded flex flex-col justify-center items-center p-1">
              <div className="w-2.5 h-2.5 rounded bg-purple-500/30 mb-0.5"></div>
              <div className="w-4 h-1 bg-neutral-700 rounded-full"></div>
            </div>
            <div className="flex-1 h-full bg-neutral-900 rounded flex flex-col justify-center items-center p-1">
              <div className="w-2.5 h-2.5 rounded bg-purple-500/30 mb-0.5"></div>
              <div className="w-4 h-1 bg-neutral-700 rounded-full"></div>
            </div>
            <div className="flex-1 h-full bg-neutral-900 rounded flex flex-col justify-center items-center p-1">
              <div className="w-2.5 h-2.5 rounded bg-purple-500/30 mb-0.5"></div>
              <div className="w-4 h-1 bg-neutral-700 rounded-full"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-10 w-full bg-neutral-950/80 rounded border border-neutral-800/80 p-1.5 flex items-center justify-center">
            <div className="w-full h-2 bg-neutral-800 rounded"></div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className="w-80 lg:w-88 bg-[#0F1118] border-r border-[#292E3D] flex flex-col shrink-0 h-full overflow-hidden text-xs z-30 transition-all duration-200 select-none shadow-2xl"
      aria-label="Component Library Drawer"
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#292E3D] bg-[#131620] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Boxes className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-bold text-xs text-[#F3F5FA] tracking-wide">
              Component Library
            </h2>
            <p className="text-[10px] text-[#A1A8B8]">
              Pre-built AI building blocks
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#737C90] hover:text-[#F3F5FA] hover:bg-[#202536] transition-colors"
          title="Close Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Mode Tabs: AI Components vs Site Structure */}
      <div className="p-2 border-b border-[#292E3D] bg-[#0F1118]">
        <div className="grid grid-cols-2 p-0.5 rounded-lg bg-[#0B0D12] border border-[#292E3D]">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-1.5 px-2 rounded-md font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'library'
                ? 'bg-[#191D29] text-[#F3F5FA] shadow-sm border border-[#292E3D]'
                : 'text-[#A1A8B8] hover:text-[#F3F5FA]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI Components</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-neutral-800 text-neutral-400 font-mono">
              {COMPONENT_TEMPLATES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outline')}
            className={`py-1.5 px-2 rounded-md font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'outline'
                ? 'bg-[#191D29] text-[#F3F5FA] shadow-sm border border-[#292E3D]'
                : 'text-[#A1A8B8] hover:text-[#F3F5FA]'
            }`}
          >
            <Layers className="w-3 h-3 text-indigo-400" />
            <span>Site Structure</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-neutral-800 text-neutral-400 font-mono">
              {activePage?.sections.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI COMPONENTS LIBRARY */}
      {activeTab === 'library' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-2.5 border-b border-[#292E3D] bg-[#0F1118]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#737C90]" />
              <input
                type="text"
                placeholder="Search components (pricing, FAQ, hero...)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B0D12] border border-[#292E3D] text-[#F3F5FA] placeholder-[#737C90] text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[#737C90] hover:text-[#F3F5FA]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
              {COMPONENT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-[#191D29] text-[#A1A8B8] hover:text-[#F3F5FA] hover:bg-[#202536]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Guidance Banner */}
          <div className="px-3 py-1.5 bg-indigo-950/20 border-b border-indigo-900/30 flex items-center justify-between text-[10px] text-indigo-300">
            <span className="flex items-center gap-1">
              <GripVertical className="w-3 h-3 text-indigo-400" />
              <span>Drag card into canvas or click + to add</span>
            </span>
            <span className="text-[9px] text-indigo-400 font-mono">
              {filteredTemplates.length} ready
            </span>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {filteredTemplates.length === 0 ? (
              <div className="py-12 text-center text-[#737C90] space-y-2">
                <Boxes className="w-8 h-8 mx-auto stroke-[1.5] text-[#292E3D]" />
                <p className="text-xs">No components match "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredTemplates.map(template => (
                <div
                  key={template.id}
                  draggable={true}
                  onDragStart={e => {
                    setDraggedTemplateId(template.id);
                    e.dataTransfer.setData(
                      'application/sitehub-component',
                      JSON.stringify({
                        componentId: template.id,
                        sectionType: template.sectionType,
                      })
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                    if (onDragStartComponent) onDragStartComponent(template);
                  }}
                  onDragEnd={() => {
                    setDraggedTemplateId(null);
                    if (onDragEndComponent) onDragEndComponent();
                  }}
                  className={`group rounded-xl border bg-[#131620] p-3 transition-all cursor-grab active:cursor-grabbing hover:bg-[#191D29] hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/20 ${
                    draggedTemplateId === template.id
                      ? 'opacity-40 border-dashed border-indigo-500'
                      : 'border-[#292E3D]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#0B0D12] border border-[#292E3D] group-hover:border-indigo-500/30">
                        {renderTemplateIcon(template.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-xs text-[#F3F5FA] group-hover:text-indigo-300 transition-colors">
                            {template.name}
                          </h3>
                          {template.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {template.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#A1A8B8]">
                          {template.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#737C90] group-hover:text-indigo-400">
                      <GripVertical className="w-3.5 h-3.5 cursor-grab" />
                    </div>
                  </div>

                  {/* Wireframe Preview Box */}
                  <div className="my-2">
                    {renderMiniWireframe(template.category)}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#A1A8B8] leading-relaxed line-clamp-2 mb-2.5">
                    {template.description}
                  </p>

                  {/* Card Actions Footer */}
                  <div className="pt-2 border-t border-[#292E3D] flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#737C90] truncate max-w-[150px]">
                      {template.previewSnippet}
                    </span>

                    <button
                      onClick={() => handleInsertComponent(template)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                      title="Insert into page"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SITE STRUCTURE / SECTION OUTLINE WITH DRAG REORDERING */}
      {activeTab === 'outline' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2.5 border-b border-[#292E3D] bg-[#0F1118] flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-[#F3F5FA]">
                {activePage?.title || 'Page'} Sections
              </span>
              <p className="text-[10px] text-[#A1A8B8]">
                Drag to reorder or drop new components into slots
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191D29] text-indigo-400 border border-[#292E3D]">
              {activePage?.sections.length || 0} nodes
            </span>
          </div>

          <div
            className="flex-1 overflow-y-auto p-2.5 space-y-1.5"
            onDragOver={e => e.preventDefault()}
          >
            {activePage?.sections.map((sec, index) => {
              const isSelected = selectedSectionId === sec.id;
              const isOver = dragOverOutlineIndex === index;

              return (
                <div key={sec.id} className="relative">
                  {/* Drop Indicator Bar between sections */}
                  {isOver && (
                    <div className="h-1 w-full bg-indigo-500 rounded-full my-1 animate-pulse shadow-sm shadow-indigo-500/50" />
                  )}

                  <div
                    draggable={true}
                    onDragStart={e => {
                      e.dataTransfer.setData(
                        'application/sitehub-reorder',
                        index.toString()
                      );
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={e => {
                      e.preventDefault();
                      setDragOverOutlineIndex(index);
                    }}
                    onDragLeave={() => {
                      setDragOverOutlineIndex(null);
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      setDragOverOutlineIndex(null);

                      // Check if it's a reorder operation
                      const reorderData = e.dataTransfer.getData(
                        'application/sitehub-reorder'
                      );
                      if (reorderData) {
                        const fromIndex = parseInt(reorderData, 10);
                        if (!isNaN(fromIndex)) {
                          handleReorderSection(fromIndex, index);
                          return;
                        }
                      }

                      // Check if it's a component from the library
                      const compData = e.dataTransfer.getData(
                        'application/sitehub-component'
                      );
                      if (compData) {
                        try {
                          const parsed = JSON.parse(compData);
                          const tpl = COMPONENT_TEMPLATES.find(
                            t => t.id === parsed.componentId
                          );
                          if (tpl) {
                            handleInsertComponent(tpl, index);
                          }
                        } catch {
                          // Ignore parse error
                        }
                      }
                    }}
                    onClick={() => onSelectSection && onSelectSection(sec.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#191D29] border-indigo-500 shadow-sm'
                        : 'bg-[#131620] border-[#292E3D] hover:bg-[#191D29] hover:border-neutral-700'
                    } ${sec.isHidden ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 text-[#737C90] hover:text-indigo-400 cursor-grab shrink-0" />
                      <span className="font-mono text-[10px] text-[#737C90] w-4">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#F3F5FA] truncate">
                          {sec.title || `${sec.type.toUpperCase()}`}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-mono">
                          {sec.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleVisibility(sec.id);
                        }}
                        className="p-1 rounded text-[#737C90] hover:text-white"
                        title={sec.isHidden ? 'Unhide section' : 'Hide section'}
                      >
                        {sec.isHidden ? (
                          <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteSection(sec.id);
                        }}
                        className="p-1 rounded text-[#737C90] hover:text-red-400"
                        title="Delete section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Drop Zone in Outline */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragOverOutlineIndex(activePage?.sections.length || 0);
              }}
              onDragLeave={() => setDragOverOutlineIndex(null)}
              onDrop={e => {
                e.preventDefault();
                setDragOverOutlineIndex(null);
                const compData = e.dataTransfer.getData(
                  'application/sitehub-component'
                );
                if (compData) {
                  try {
                    const parsed = JSON.parse(compData);
                    const tpl = COMPONENT_TEMPLATES.find(
                      t => t.id === parsed.componentId
                    );
                    if (tpl) handleInsertComponent(tpl);
                  } catch {
                    // Ignore
                  }
                }
              }}
              className={`p-3 rounded-xl border border-dashed text-center transition-all ${
                dragOverOutlineIndex === (activePage?.sections.length || 0)
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300'
                  : 'border-[#292E3D] hover:border-neutral-700 text-[#737C90]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-400" />
              <span className="text-[10px]">
                Drop component here to append to bottom
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
