/**
 * Interactive Live Site Renderer
 * Renders the site AST into responsive, beautifully styled HTML5 & React components.
 * Supports interactive menus, table booking, shopping cart, forms, and multilingual fonts.
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bed,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { SectionDocument, SiteDocument } from '../types/site';
import { StorageService } from '../lib/storage';

interface LiveSiteRendererProps {
  site: SiteDocument;
  selectedSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  appName?: string;
  isPreview?: boolean;
}

export const LiveSiteRenderer: React.FC<LiveSiteRendererProps> = ({
  site,
  selectedSectionId,
  onSelectSection,
  appName = 'SiteHub',
  isPreview = true,
}) => {
  const activePage = site.pages[0];
  const theme = site.theme;

  // Store & Cart State
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Booking State
  const [bookingDate, setBookingDate] = useState('2026-10-25');
  const [bookingTime, setBookingTime] = useState('19:30');
  const [bookingGuests, setBookingGuests] = useState('2');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Contact Form State
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Active Menu Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // In-preview feedback toast (replaces window.alert for iframe safety)
  const [interactiveToast, setInteractiveToast] = useState<string | null>(null);
  const triggerFeedback = (msg: string) => {
    setInteractiveToast(msg);
    setTimeout(() => setInteractiveToast(null), 3200);
  };

  // Handle Add to Cart
  const handleAddToCart = (item: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    StorageService.addOrder({
      items: cart.map(c => ({ id: c.id, title: c.name, price: c.price, quantity: c.quantity })),
      total: cartTotal,
      customerName: 'Test Customer',
      email: 'customer@example.com',
      address: '100 Studio Way, Suite 4B',
    });
    setOrderConfirmed(true);
    setTimeout(() => {
      setCart([]);
      setOrderConfirmed(false);
      setIsCartOpen(false);
    }, 2800);
  };

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail) return;

    StorageService.addBooking({
      customerName: bookingName,
      email: bookingEmail,
      phone: '+1 (555) 019-2834',
      date: bookingDate,
      time: bookingTime,
      guests: parseInt(bookingGuests, 10),
      specialRequests: 'Window booth if available',
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingName('');
      setBookingEmail('');
    }, 4000);
  };

  // Handle Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    StorageService.addSubmission({
      formType: 'contact',
      data: {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      },
    });

    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  if (!activePage || activePage.sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
        <Sparkles className="w-12 h-12 mb-4 text-indigo-400 animate-pulse" />
        <h3 className="text-xl font-semibold text-neutral-200">Blank Canvas</h3>
        <p className="max-w-md mt-2 text-sm">
          Type an instruction into the prompt panel on the left to synthesize sections, layout, copy, and theme tokens.
        </p>
      </div>
    );
  }

  // Determine font class based on site language
  const langClass = site.language === 'hi' ? 'lang-hi' : site.language === 'pa' ? 'lang-pa' : '';

  return (
    <div
      className={`min-h-full transition-colors duration-200 ${langClass}`}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: site.language === 'hi' ? 'var(--font-devanagari)' : site.language === 'pa' ? 'var(--font-gurmukhi)' : 'var(--font-sans)',
      }}
    >
      {/* Sections List */}
      {activePage.sections
        .filter(s => !s.isHidden)
        .map(section => {
          const isSelected = isPreview && selectedSectionId === section.id;
          return (
            <div
              key={section.id}
              onClick={() => isPreview && onSelectSection && onSelectSection(section.id)}
              className={`relative transition-all ${
                isPreview ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500/50 hover:ring-offset-2 hover:ring-offset-neutral-900' : ''
              } ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-neutral-900' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-4 z-30 px-2 py-0.5 text-xs font-semibold tracking-wider text-white uppercase bg-indigo-600 rounded-md shadow-md">
                  {section.type} Section
                </div>
              )}
              {renderSectionContent(
                section,
                theme,
                site,
                cart.length,
                () => setIsCartOpen(true),
                handleAddToCart,
                selectedCategory,
                setSelectedCategory,
                bookingDate,
                setBookingDate,
                bookingTime,
                setBookingTime,
                bookingGuests,
                setBookingGuests,
                bookingName,
                setBookingName,
                bookingEmail,
                setBookingEmail,
                bookingSuccess,
                handleBookingSubmit,
                contactName,
                setContactName,
                contactEmail,
                setContactEmail,
                contactMessage,
                setContactMessage,
                contactSuccess,
                handleContactSubmit,
                openFaqIndex,
                setOpenFaqIndex,
                isMobileNavOpen,
                setIsMobileNavOpen,
                triggerFeedback
              )}
            </div>
          );
        })}

      {/* Slide-over Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 overflow-y-auto bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold">Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-neutral-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/50"
                    >
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <div className="text-xs text-neutral-400">${item.price} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono px-2 py-0.5 bg-neutral-900 rounded">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold text-sm text-indigo-300">
                          ${item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => setCart(c => c.filter(x => x.id !== item.id))}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Subtotal</span>
                  <span className="text-emerald-400">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="text-xs text-neutral-400 bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                  ⚡ <strong>Honest Test Mode</strong>: No real charge will occur. The simulated order is recorded in your local SiteHub ledger.
                </div>
                {orderConfirmed ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-center font-semibold text-sm flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Order Placed! Logged in SiteHub Orders
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="w-full py-3 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition-transform active:scale-[0.98]"
                  >
                    Simulate Test Checkout (${cartTotal.toFixed(2)})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* In-Preview Interactive Toast Feedback */}
      {interactiveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-neutral-900 border border-emerald-500/50 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{interactiveToast}</span>
        </div>
      )}

      {/* Powered by SiteHub Badge */}
      <footer className="py-6 border-t border-neutral-800/60 text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
        <span>Powered by</span>
        <span className="font-semibold text-neutral-400">{appName}</span>
        <span>• Production AI Website Platform</span>
      </footer>
    </div>
  );
};

// Section Content Dispatcher
function renderSectionContent(
  section: SectionDocument,
  theme: any,
  site: SiteDocument,
  cartCount: number,
  onOpenCart: () => void,
  onAddToCart: (item: any) => void,
  selectedCategory: string,
  setSelectedCategory: (c: string) => void,
  bookingDate: string,
  setBookingDate: (d: string) => void,
  bookingTime: string,
  setBookingTime: (t: string) => void,
  bookingGuests: string,
  setBookingGuests: (g: string) => void,
  bookingName: string,
  setBookingName: (n: string) => void,
  bookingEmail: string,
  setBookingEmail: (e: string) => void,
  bookingSuccess: boolean,
  handleBookingSubmit: (e: React.FormEvent) => void,
  contactName: string,
  setContactName: (n: string) => void,
  contactEmail: string,
  setContactEmail: (e: string) => void,
  contactMessage: string,
  setContactMessage: (m: string) => void,
  contactSuccess: boolean,
  handleContactSubmit: (e: React.FormEvent) => void,
  openFaqIndex: number | null,
  setOpenFaqIndex: (i: number | null) => void,
  isMobileNavOpen: boolean,
  setIsMobileNavOpen: (o: boolean) => void,
  triggerFeedback?: (msg: string) => void
) {
  const props = section.props || {};

  switch (section.type) {
    case 'navbar':
      return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/80 border-b border-neutral-800/80 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="#hero" className="font-extrabold text-xl tracking-tight flex items-center gap-2">
              <span style={{ color: theme.primaryColor }}>●</span>
              <span>{props.brandName || site.name}</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
              {props.links?.map((link: any, i: number) => (
                <a key={i} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {cartCount > 0 && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold bg-indigo-600 rounded-full text-white">
                    {cartCount}
                  </span>
                </button>
              )}
              {props.ctaText && (
                <a
                  href={props.ctaHref || '#'}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all"
                >
                  {props.ctaText}
                </a>
              )}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-white"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          {isMobileNavOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-2 border-t border-neutral-800 mt-3">
              {props.links?.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </header>
      );

    case 'hero':
      return (
        <section
          id="hero"
          className="relative min-h-[580px] flex items-center justify-center px-6 py-20 text-center overflow-hidden"
          style={{
            backgroundImage: props.bgImage
              ? `linear-gradient(to bottom, rgba(10, 10, 12, 0.75), rgba(10, 10, 12, 0.95)), url(${props.bgImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            {props.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{props.badge}</span>
              </div>
            )}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed">
                {section.subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {props.primaryCta && (
                <a
                  href={props.primaryCtaHref || '#'}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-95 transition-transform active:scale-95"
                >
                  {props.primaryCta}
                </a>
              )}
              {props.secondaryCta && (
                <a
                  href={props.secondaryCtaHref || '#'}
                  className="px-6 py-3 rounded-xl font-semibold bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors"
                >
                  {props.secondaryCta}
                </a>
              )}
            </div>

            {props.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto border-t border-neutral-800/60">
                {props.metrics.map((m: any, i: number) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">{m.value}</div>
                    <div className="text-xs sm:text-sm text-neutral-400 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case 'features':
      return (
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400 text-sm sm:text-base">{section.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {props.items?.map((item: any, i: number) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4 hover:translate-y-[-2px]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case 'menu':
      const categories = props.categories || ['All'];
      const items = props.items || [];
      const filtered = selectedCategory === 'All' ? items : items.filter((it: any) => it.category === selectedCategory);

      return (
        <section id="menu" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === 'All' ? 'bg-white text-neutral-950 shadow-md' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              All Items
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat ? 'bg-white text-neutral-950 shadow-md' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((item: any, i: number) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{item.title}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
                <div className="text-right space-y-2">
                  <span className="text-xl font-bold font-mono" style={{ color: theme.accentColor }}>
                    {item.price}
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        onAddToCart({
                          id: `menu-${i}`,
                          name: item.title,
                          price: parseFloat(item.price.replace(/[^0-9.]/g, '')) || 18,
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'booking':
      return (
        <section id="booking" className="py-20 px-6 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">{section.title}</h2>
              {section.subtitle && <p className="text-neutral-400 text-sm sm:text-base">{section.subtitle}</p>}
            </div>

            {bookingSuccess ? (
              <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <Check className="w-12 h-12 mx-auto text-emerald-400" />
                <h3 className="text-xl font-bold text-emerald-300">Reservation Confirmed!</h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                  We reserved a table for {bookingGuests} guests on {bookingDate} at {bookingTime}. A confirmation SMS was recorded in your SiteHub console.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      <Calendar className="w-4 h-4 inline mr-1 text-indigo-400" /> Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      <Clock className="w-4 h-4 inline mr-1 text-indigo-400" /> Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={e => setBookingTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="17:30">5:30 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:30">7:30 PM (Prime)</option>
                      <option value="20:30">8:30 PM (Prime)</option>
                      <option value="21:30">9:30 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      <Users className="w-4 h-4 inline mr-1 text-indigo-400" /> Guests
                    </label>
                    <select
                      value={bookingGuests}
                      onChange={e => setBookingGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="6">6 Persons</option>
                      <option value="8">8+ Party</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaspreet Kaur"
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. jaspreet@example.com"
                      value={bookingEmail}
                      onChange={e => setBookingEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-full py-4 text-white font-bold rounded-xl shadow-xl hover:opacity-95 transition-transform active:scale-[0.99] text-base"
                >
                  {props.submitText || 'Confirm Table Reservation'}
                </button>
              </form>
            )}
          </div>
        </section>
      );

    case 'store':
      const products = props.products || [];
      return (
        <section id="store" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod: any) => (
              <div
                key={prod.id}
                className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all hover:translate-y-[-4px]"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-950">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-neutral-800">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-neutral-400 font-medium mb-1">{prod.category}</div>
                    <h3 className="font-bold text-base text-white">{prod.name}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold font-mono text-emerald-400">${prod.price}</span>
                    <button
                      onClick={() => onAddToCart(prod)}
                      style={{ backgroundColor: theme.primaryColor }}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-md hover:opacity-90 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'showcase':
      return (
        <section id="showcase" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {props.items?.map((item: any, i: number) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-neutral-800"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'pricing':
      const plans = props.plans || [];
      return (
        <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan: any, i: number) => (
              <div
                key={i}
                className={`p-8 rounded-3xl bg-neutral-900 border flex flex-col justify-between transition-all ${
                  plan.isPopular ? 'border-indigo-500 shadow-2xl relative scale-105 z-10' : 'border-neutral-800'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-neutral-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    {plan.features?.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  style={{ backgroundColor: plan.isPopular ? theme.primaryColor : undefined }}
                  className={`w-full mt-8 py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.isPopular
                      ? 'text-white shadow-lg hover:opacity-90'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section id="testimonials" className="py-20 px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {props.items?.map((item: any, i: number) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 relative"
              >
                <div className="flex text-amber-400 gap-1">
                  {[...Array(item.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-300 italic text-base leading-relaxed">"{item.quote}"</p>
                <div>
                  <div className="font-bold text-white">{item.author}</div>
                  <div className="text-xs text-neutral-400">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'faq':
      return (
        <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
          </div>
          <div className="space-y-4">
            {props.items?.map((item: any, i: number) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left font-semibold text-white flex items-center justify-between gap-4"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );

    case 'contact':
      return (
        <section id="contact" className="py-20 px-6 max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">{section.title}</h2>
              {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
            </div>

            {contactSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-emerald-300">Message Received!</h4>
                <p className="text-xs text-neutral-300">
                  Thank you, {contactName}. We have saved your message to the submissions database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    required
                    className="px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    required
                    className="px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Your message or inquiry..."
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {props.submitLabel || 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>
      );

    case 'footer':
      return (
        <footer className="py-12 px-6 border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="font-bold text-white text-base">{props.brandName || site.name}</div>
              <p className="text-xs text-neutral-500">{props.tagline}</p>
            </div>
            <div className="text-xs text-neutral-500">{props.copyright || `© 2026 ${site.name}. All rights reserved.`}</div>
          </div>
        </footer>
      );

    case 'dashboardMetrics':
      return (
        <section id="metrics" className="py-16 px-6 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
              {section.subtitle && <p className="text-sm text-neutral-400 mt-1">{section.subtitle}</p>}
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs">
              {['7D', '30D', '90D', 'YTD'].map((t, idx) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${idx === 1 ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Monthly Recurring Revenue', value: '$142,580', change: '+18.4%', isPositive: true },
              { label: 'Active Enterprise Seats', value: '3,840', change: '+12.1%', isPositive: true },
              { label: 'Net Revenue Retention', value: '134.2%', change: '+4.8%', isPositive: true },
              { label: 'Customer Churn Rate', value: '0.62%', change: '-0.18%', isPositive: true },
            ].map((kpi, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs text-neutral-400 font-medium">{kpi.label}</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{kpi.value}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{kpi.change} vs last period</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="font-bold text-base text-white">Recent Workflows & Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-800 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="pb-3">Account</th>
                    <th className="pb-3">Tier Plan</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">State</th>
                    <th className="pb-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 font-mono">
                  {[
                    { account: 'Acme Cloud Corp', tier: 'Enterprise Scale', value: '$12,400/yr', state: 'Active' },
                    { account: 'Starlight Media', tier: 'Pro Growth', value: '$2,800/yr', state: 'Active' },
                    { account: 'Apex Genomics', tier: 'Custom Cluster', value: '$48,000/yr', state: 'Provisioning' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/40">
                      <td className="py-3 font-sans font-semibold text-white">{row.account}</td>
                      <td className="py-3 text-neutral-300 font-sans">{row.tier}</td>
                      <td className="py-3 text-emerald-400 font-bold">{row.value}</td>
                      <td className="py-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {row.state}
                        </span>
                      </td>
                      <td className="py-3 text-right text-neutral-500">Just now</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );

    case 'crmPipeline':
      return (
        <section id="pipeline" className="py-16 px-6 max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400 text-sm">{section.subtitle}</p>}
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                stage: '1. Inbound Leads',
                total: '$84,000',
                deals: [
                  { name: 'Vanguard Logistics', amount: '$42,000', owner: 'Sarah L.', priority: 'High' },
                  { name: 'Nexus Data Labs', amount: '$42,000', owner: 'David K.', priority: 'Medium' },
                ],
              },
              {
                stage: '2. Qualified Discovery',
                total: '$160,000',
                deals: [
                  { name: 'Meridian Capital', amount: '$95,000', owner: 'Sarah L.', priority: 'High' },
                  { name: 'Helios Robotics', amount: '$65,000', owner: 'Alex M.', priority: 'Medium' },
                ],
              },
              {
                stage: '3. Proposal Review',
                total: '$240,000',
                deals: [
                  { name: 'Atlas Global Retail', amount: '$180,000', owner: 'David K.', priority: 'Urgent' },
                  { name: 'Quantica Bio', amount: '$60,000', owner: 'Alex M.', priority: 'High' },
                ],
              },
              {
                stage: '4. Signed & Closed',
                total: '$310,000',
                deals: [
                  { name: 'Zenith Health AI', amount: '$210,000', owner: 'Sarah L.', priority: 'Won' },
                  { name: 'Prism Creative', amount: '$100,000', owner: 'David K.', priority: 'Won' },
                ],
              },
            ].map((col, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-bold text-xs text-white">{col.stage}</span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">{col.total}</span>
                </div>
                <div className="space-y-2.5">
                  {col.deals.map((deal, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-1.5 hover:border-indigo-500/50 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{deal.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          {deal.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Lead: {deal.owner}</span>
                        <span className="text-amber-400 text-[10px] font-semibold">{deal.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'hotelBooking':
      return (
        <section id="hotel-booking" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400 text-sm sm:text-base">{section.subtitle}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ocean Sanctuary Penthouse',
                price: '$1,450',
                beds: '2 King Suites • 2.5 Baths',
                sqft: '2,800 sq ft',
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                badge: 'Signature Suite',
              },
              {
                title: 'Private Garden Pool Villa',
                price: '$980',
                beds: '1 King Suite • Heated Plunge Pool',
                sqft: '1,650 sq ft',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                badge: 'Exclusive',
              },
              {
                title: 'Azure Terrace Suite',
                price: '$620',
                beds: '1 King Bed • Sunset Balcony',
                sqft: '950 sq ft',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
              },
            ].map((suite, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all hover:translate-y-[-4px] shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                  <img
                    src={suite.image}
                    alt={suite.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {suite.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-neutral-950/80 backdrop-blur-md text-amber-400 border border-neutral-800">
                      {suite.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{suite.title}</h3>
                    <p className="text-xs text-neutral-400 font-medium">{suite.beds} • {suite.sqft}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                    <div>
                      <span className="text-2xl font-bold font-mono text-white">{suite.price}</span>
                      <span className="text-xs text-neutral-500"> / night</span>
                    </div>
                    <button
                      onClick={() => triggerFeedback?.(`Reservation initiated for: ${suite.title}`)}
                      style={{ backgroundColor: theme.primaryColor }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow hover:opacity-90 transition-opacity"
                    >
                      Reserve Suite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'courseLessons':
      return (
        <section id="lessons" className="py-16 px-6 max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400 text-sm">{section.subtitle}</p>}
          </div>

          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Course Progress: 4 of 6 Modules Completed</span>
              <span className="font-mono text-emerald-400 font-bold">67% Finished</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-neutral-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-2/3 transition-all" />
            </div>

            <div className="space-y-2.5 pt-4">
              {[
                { title: '01. Distributed Storage Foundations & Raft Consensus', duration: '45 mins', status: 'Completed' },
                { title: '02. Designing Multi-Region Active-Active Sharding', duration: '60 mins', status: 'Completed' },
                { title: '03. Zero-Downtime Schema Migrations at Scale', duration: '50 mins', status: 'Current Lesson' },
                { title: '04. End-to-End Production Verification Exam', duration: '30 mins', status: 'Locked' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className={`w-5 h-5 ${m.status === 'Completed' ? 'text-emerald-400' : m.status === 'Current Lesson' ? 'text-indigo-400 animate-pulse' : 'text-neutral-600'}`} />
                    <div>
                      <div className="font-bold text-white text-sm">{m.title}</div>
                      <span className="text-xs text-neutral-500 font-mono">{m.duration}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : m.status === 'Current Lesson'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-neutral-900 text-neutral-500'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'propertyListings':
      return (
        <section id="properties" className="py-20 px-6 max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'The Belvedere Glass Pavilion',
                price: '$4,850,000',
                location: 'Pacific Palisades, CA',
                specs: '4 Beds • 5 Baths • 5,400 sq ft',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Penthouse at Summit Spire',
                price: '$6,200,000',
                location: 'Tribeca, New York',
                specs: '3 Beds • 4 Baths • 3,800 sq ft',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
              },
              {
                title: 'Villa Tranquila Oceanfront',
                price: '$3,400,000',
                location: 'Miami Beach, FL',
                specs: '5 Beds • 6 Baths • 6,200 sq ft',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
              },
            ].map((prop, idx) => (
              <div key={idx} className="rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="aspect-[16/10] bg-neutral-950 overflow-hidden">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 space-y-3">
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">{prop.price}</div>
                  <h3 className="font-bold text-lg text-white">{prop.title}</h3>
                  <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{prop.location} • {prop.specs}</span>
                  </div>
                  <button
                    onClick={() => triggerFeedback?.(`Tour scheduled for ${prop.title}`)}
                    className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
                  >
                    Schedule In-Person Showing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'jobBoard':
      return (
        <section id="jobs" className="py-20 px-6 max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="space-y-3">
            {[
              { role: 'Staff Distributed Systems Architect', comp: '$260k – $320k', team: 'Core Infrastructure', tags: ['Remote', 'Rust / Go', 'Equity'] },
              { role: 'Lead AI Product Designer', comp: '$180k – $220k', team: 'Design Systems', tags: ['Remote / NYC', 'Figma', 'Prototyping'] },
              { role: 'Senior Security Operations Lead', comp: '$210k – $250k', team: 'InfoSec & Compliance', tags: ['Remote', 'Zero Trust', 'SOC2'] },
            ].map((job, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-white">{job.role}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-neutral-400">{job.team}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400 font-bold">{job.comp}</span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {job.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-neutral-400 border border-neutral-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => triggerFeedback?.(`Application submitted for: ${job.role}`)}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow hover:opacity-90 self-start sm:self-auto"
                >
                  Apply Role
                </button>
              </div>
            ))}
          </div>
        </section>
      );

    case 'newsFeed':
      return (
        <section id="news" className="py-20 px-6 max-w-7xl mx-auto space-y-8">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300 font-medium">
            <span className="font-bold px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] uppercase">Breaking</span>
            <span>Global consortium agrees on decentralized AI safety & verifiable model governance framework.</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'The Quantum Advantage: Next-Gen Compute Shards', time: '5 min read', category: 'Technology', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
              { title: 'Central Bank Digital Currencies Enter Cross-Border Trial', time: '7 min read', category: 'Global Economics', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80' },
              { title: 'Clean Fusion Breakthrough: Q-Total Exceeds 1.8 Factor', time: '4 min read', category: 'Energy Science', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80' },
            ].map((article, idx) => (
              <div key={idx} className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between">
                <div className="aspect-video bg-neutral-950 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-red-400">{article.category} • {article.time}</div>
                  <h3 className="font-bold text-base text-white hover:text-indigo-400 cursor-pointer">{article.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'docViewer':
      return (
        <section id="docs" className="py-20 px-6 max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">POST</span>
                <span className="text-neutral-200">/api/v1/projects/synthesize</span>
              </div>
              <span className="text-neutral-500 text-[11px]">Requires Bearer Token</span>
            </div>
            <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-300 overflow-x-auto text-[11px]">
{`curl -X POST https://api.sitehub.live/v1/projects \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Build luxury hotel booking website",
    "theme": "dark_minimal",
    "deployTarget": "edge"
  }'`}
            </pre>
          </div>
        </section>
      );

    case 'donationCampaign':
      return (
        <section id="donate" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">{section.title}</h2>
            {section.subtitle && <p className="text-neutral-400">{section.subtitle}</p>}
          </div>

          <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-extrabold text-emerald-400 font-mono">$342,850</span>
                <span className="text-sm text-neutral-400"> raised of $500,000 goal</span>
              </div>
              <span className="font-mono font-bold text-white text-lg">68.5%</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-neutral-950 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[68.5%]" />
            </div>

            <div className="pt-2 space-y-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Select Contribution Amount</span>
              <div className="grid grid-cols-4 gap-3">
                {['$25', '$50', '$100', '$250'].map((amt, idx) => (
                  <button
                    key={amt}
                    onClick={() => triggerFeedback?.(`Simulated pledge of ${amt} received! Thank you!`)}
                    className={`py-3 rounded-xl font-bold text-sm border transition-colors ${idx === 2 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-neutral-950 text-neutral-200 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
