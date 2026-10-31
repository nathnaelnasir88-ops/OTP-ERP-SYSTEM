import React, { useState } from 'react';
import {
  Palette,
  X,
  Sparkles,
  RotateCcw,
  Shield,
  Layers,
  Sliders,
  Check,
  Type,
  Maximize2,
  Image,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  LogoStyle,
  SidebarTone,
  LayoutDensity,
  BorderRadiusOption,
  SimplicityMode,
  BrandThemeConfig
} from '../../types';

export const BrandCustomizerModal: React.FC = () => {
  const { theme, updateTheme, resetTheme, isCustomizerOpen, setIsCustomizerOpen } = useERP();
  const [activeTab, setActiveTab] = useState<'colors' | 'logo' | 'simplicity'>('colors');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isCustomizerOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const colorPresets = [
    {
      name: 'OTP Agency Signature',
      primary: '#545454',
      accent: '#feb913',
      tone: 'charcoal' as SidebarTone,
      tag: 'Default Brand'
    },
    {
      name: 'Cyber Gold & Obsidian',
      primary: '#1c1c1e',
      accent: '#feb913',
      tone: 'dark' as SidebarTone,
      tag: 'High Contrast'
    },
    {
      name: 'Warm Slate & Amber',
      primary: '#44403c',
      accent: '#f59e0b',
      tone: 'accent-border' as SidebarTone,
      tag: 'Warm Studio'
    },
    {
      name: 'Executive Minimalist',
      primary: '#262626',
      accent: '#e4e4e7',
      tone: 'charcoal' as SidebarTone,
      tag: 'Monochrome'
    },
    {
      name: 'Modern Tech Teal',
      primary: '#1e293b',
      accent: '#14b8a6',
      tone: 'dark' as SidebarTone,
      tag: 'Digital'
    }
  ];

  const primarySwatches = ['#545454', '#3e3e3e', '#262626', '#18181b', '#0f172a', '#44403c'];
  const accentSwatches = ['#feb913', '#f59e0b', '#facc15', '#10b981', '#3b82f6', '#f43f5e'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Brand & UI Appearance Studio
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono"
                  style={{ backgroundColor: `${theme.accentColor}25`, color: '#7c5800' }}
                >
                  Full Control
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Customize colors, logo, typography, density, and interface simplicity in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200/80 bg-white flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('colors')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'colors'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors & Theme</span>
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'logo'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Logo & Agency Identity</span>
          </button>
          <button
            onClick={() => setActiveTab('simplicity')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'simplicity'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>UI Simplicity & Density</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Component Preview Strip */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> Live Interface Preview
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Primary: {theme.primaryColor} • Accent: {theme.accentColor}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-lg border border-slate-200/80 shadow-xs">
              {/* Preview Logo */}
              {theme.logoStyle === 'shield-emblem' ? (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: theme.primaryColor, border: `2px solid ${theme.accentColor}` }}
                >
                  <Shield className="w-4 h-4" style={{ color: theme.accentColor }} />
                </div>
              ) : theme.logoStyle === 'custom-image' && theme.logoImageUrl ? (
                <img
                  src={theme.logoImageUrl}
                  alt="Logo preview"
                  className="w-9 h-9 object-contain rounded-lg border bg-white p-0.5"
                  style={{ borderColor: theme.accentColor }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider shrink-0"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.accentColor,
                    border: `2px solid ${theme.accentColor}`
                  }}
                >
                  {theme.companyShortName}
                </div>
              )}

              {/* Title & Tagline */}
              <div className="min-w-0 pr-2">
                <div className="font-bold text-xs text-slate-900 truncate">{theme.companyName}</div>
                <div className="text-[10px] text-slate-500 truncate">{theme.companyTagline}</div>
              </div>

              {/* Active Tab Preview */}
              <div className="ml-auto flex items-center gap-2">
                <div
                  className="px-3 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                  style={{ backgroundColor: theme.accentColor, color: '#1a1a1a' }}
                >
                  <Sparkles className="w-3 h-3" />
                  Active Item
                </div>
                <div
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Primary CTA
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: COLORS & THEME */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* 1-Click Brand Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1-Click Color Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {colorPresets.map((preset) => {
                    const isSelected =
                      theme.primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
                      theme.accentColor.toLowerCase() === preset.accent.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateTheme({
                            primaryColor: preset.primary,
                            accentColor: preset.accent,
                            sidebarTone: preset.tone
                          });
                          showToast(`Applied preset: ${preset.name}`);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {preset.primary} • {preset.accent}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                {/* Primary Color (#545454) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Primary Brand Color (Charcoal)
                    </label>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">{theme.primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      placeholder="#545454"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 mr-1">Quick:</span>
                    {primarySwatches.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updateTheme({ primaryColor: hex })}
                        style={{ backgroundColor: hex }}
                        className={`w-5 h-5 rounded-md border border-slate-200 transition-transform hover:scale-110 ${
                          theme.primaryColor.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-blue-500' : ''
                        }`}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Accent Color (#feb913) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Accent Color (Golden Amber)
                    </label>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">{theme.accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={theme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      placeholder="#feb913"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 mr-1">Quick:</span>
                    {accentSwatches.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => updateTheme({ accentColor: hex })}
                        style={{ backgroundColor: hex }}
                        className={`w-5 h-5 rounded-md border border-slate-200 transition-transform hover:scale-110 ${
                          theme.accentColor.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-blue-500' : ''
                        }`}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Tone */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Sidebar Tone & Finish
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'charcoal' as SidebarTone, label: 'Charcoal #545454', desc: 'Agency Standard' },
                    { id: 'dark' as SidebarTone, label: 'Pure Obsidian', desc: 'Deep Slate' },
                    { id: 'accent-border' as SidebarTone, label: 'Gold Trimmed', desc: 'Amber Border' },
                    { id: 'light' as SidebarTone, label: 'Clean Light', desc: 'Minimal White' }
                  ].map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => updateTheme({ sidebarTone: tone.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        theme.sidebarTone === tone.id
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{tone.label}</div>
                      <div className="text-[10px] text-slate-500">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO & IDENTITY */}
          {activeTab === 'logo' && (
            <div className="space-y-5">
              {/* Logo Style Options */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Agency Logo Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'monogram' as LogoStyle, label: 'OTP Monogram', desc: 'Gold on Charcoal' },
                    { id: 'shield-emblem' as LogoStyle, label: 'Tech Shield', desc: 'Geometric Emblem' },
                    { id: 'custom-image' as LogoStyle, label: 'Custom Logo Image', desc: 'URL / SVG Asset' },
                    { id: 'minimal-text' as LogoStyle, label: 'Minimal Wordmark', desc: 'Clean Typography' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateTheme({ logoStyle: style.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        theme.logoStyle === style.id
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{style.label}</div>
                      <div className="text-[10px] text-slate-500">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL input if selected */}
              {theme.logoStyle === 'custom-image' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Logo Image URL (SVG, PNG, WebP)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={theme.logoImageUrl || ''}
                      onChange={(e) => updateTheme({ logoImageUrl: e.target.value })}
                      placeholder="https://example.com/logo.svg"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    />
                    <button
                      onClick={() =>
                        updateTheme({
                          logoImageUrl:
                            'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg'
                        })
                      }
                      className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
                    >
                      Use Sample
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Will display inside a rounded badge matching your accent border.
                  </p>
                </div>
              )}

              {/* Company Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Company Full Name
                  </label>
                  <input
                    type="text"
                    value={theme.companyName}
                    onChange={(e) => updateTheme({ companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-medium"
                    placeholder="Open Technology PLC"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Monogram / Short Code
                  </label>
                  <input
                    type="text"
                    value={theme.companyShortName}
                    onChange={(e) => updateTheme({ companyShortName: e.target.value.toUpperCase() })}
                    maxLength={5}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono uppercase font-bold"
                    placeholder="OTP"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Agency Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={theme.companyTagline}
                    onChange={(e) => updateTheme({ companyTagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                    placeholder="Marketing & Digital Advertising Agency"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIMPLICITY & DENSITY */}
          {activeTab === 'simplicity' && (
            <div className="space-y-6">
              {/* Layout Density */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Layout Density & Spacing
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'compact' as LayoutDensity, label: 'Compact', desc: 'Max data on screen' },
                    { id: 'comfortable' as LayoutDensity, label: 'Comfortable', desc: 'Balanced standard' },
                    { id: 'spacious' as LayoutDensity, label: 'Spacious', desc: 'Generous padding' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => updateTheme({ density: item.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        theme.density === item.id
                          ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Radius */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Interface Corner Radius
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'sharp' as BorderRadiusOption, label: 'Sharp (0px)' },
                    { id: 'subtle' as BorderRadiusOption, label: 'Subtle (6px)' },
                    { id: 'modern' as BorderRadiusOption, label: 'Modern (10px)' },
                    { id: 'rounded' as BorderRadiusOption, label: 'Soft (16px)' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => updateTheme({ borderRadius: r.id })}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        theme.borderRadius === r.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simplicity Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Simplicity & Focus Options
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Distraction-Free Mode</div>
                    <div className="text-[11px] text-slate-500">
                      Hide decorative sidebar tracker banner for a cleaner workspace
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.hideDecorativeCards}
                    onChange={(e) => updateTheme({ hideDecorativeCards: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">High Contrast Tables</div>
                    <div className="text-[11px] text-slate-500">
                      Render crisp bordered hairline dividers for maximal tabular scannability
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.highContrastTables}
                    onChange={(e) => updateTheme({ highContrastTables: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetTheme();
                showToast('Reset to OTP Signature (#545454 & #feb913)');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => {
                updateTheme({
                  primaryColor: '#545454',
                  accentColor: '#feb913',
                  sidebarTone: 'charcoal'
                });
                showToast('Applied OTP Signature Palette');
              }}
              className="px-3 py-2 text-xs font-bold rounded-xl border shadow-xs flex items-center gap-1.5 transition-all"
              style={{
                backgroundColor: '#feb913',
                color: '#1a1a1a',
                borderColor: '#e5a408'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply #545454 & #feb913</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {toastMessage && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {toastMessage}
              </span>
            )}
            <button
              onClick={() => setIsCustomizerOpen(false)}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
