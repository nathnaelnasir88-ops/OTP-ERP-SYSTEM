import { EraSystemId, EraSystemDefinition, BrandThemeConfig } from '../types';

export const ERA_SYSTEMS: Record<EraSystemId, EraSystemDefinition> = {
  'cognify-bento': {
    id: 'cognify-bento',
    name: 'Cognify Soft Bento',
    eraName: '2026 Soft Bento Era',
    tagline: 'Curved Bento Cards, Soft Pills & Vibrant Apple-Like Accents',
    description:
      'The modern flagship aesthetic: 28px rounded soft bento cards, tactile pill navigation, subtle shadows, and crisp green, blue, and pink dot accents.',
    primaryColor: '#1d1d1f',
    accentColor: '#1ec94c',
    accentSecondary: '#1d7dfa',
    accentTertiary: '#f73b9b',
    appBackground: '#e4e7ec',
    shellBackground: '#f5f6f8',
    cardBackground: '#ffffff',
    textColor: '#1d1d1f',
    mutedTextColor: '#86868b',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 'rounded',
    borderRadiusValue: '28px',
    shadowStyle: 'soft-bento',
    fontStyle: 'modern-sans',
    iconEmoji: '✨'
  },
  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neo-Ops',
    eraName: '2049 Sci-Fi HUD Era',
    tagline: 'Obsidian Carbon, Neon Matrix Glow & Telemetry HUD',
    description:
      'Futuristic operations center: deep carbon backdrops, glowing electric cyan and matrix green indicators, holographic status pills, and tactical monospace figures.',
    primaryColor: '#00e5ff',
    accentColor: '#00ff66',
    accentSecondary: '#f72585',
    accentTertiary: '#7209b7',
    appBackground: '#060709',
    shellBackground: '#0b0e14',
    cardBackground: '#111622',
    textColor: '#e2e8f0',
    mutedTextColor: '#64748b',
    borderColor: 'rgba(0, 229, 255, 0.22)',
    borderRadius: 'subtle',
    borderRadiusValue: '8px',
    shadowStyle: 'neon-glow',
    fontStyle: 'tactical-mono',
    iconEmoji: '⚡'
  },
  'classic-90s-erp': {
    id: 'classic-90s-erp',
    name: 'Classic 90s Enterprise',
    eraName: '1995 Mainframe & SAP Era',
    tagline: 'Beveled 3D Panels, Navy Title Bars & High-Density Tables',
    description:
      'Nostalgic enterprise workstation: classic Windows 95 / SAP gray, 3D beveled borders, solid navy blue title bars, monospace figures, and zero-radius efficiency.',
    primaryColor: '#000080',
    accentColor: '#008080',
    accentSecondary: '#800000',
    accentTertiary: '#2e7d32',
    appBackground: '#3a6ea5',
    shellBackground: '#d4d0c8',
    cardBackground: '#ece9d8',
    textColor: '#000000',
    mutedTextColor: '#4b5563',
    borderColor: '#808080',
    borderRadius: 'sharp',
    borderRadiusValue: '0px',
    shadowStyle: 'beveled-3d',
    fontStyle: 'system-90s',
    iconEmoji: '💾'
  },
  'swiss-bauhaus': {
    id: 'swiss-bauhaus',
    name: 'Swiss Bauhaus Modernist',
    eraName: '1960s International Typographic Era',
    tagline: 'Stark Monochrome, Sharp Edges & Striking Vermilion Red',
    description:
      'Architectural purity: crisp black-and-white grids, sharp 2px geometric corners, high typographic contrast, solid 1.5px lines, and vermilion red focal points.',
    primaryColor: '#000000',
    accentColor: '#ff3300',
    accentSecondary: '#0022ee',
    accentTertiary: '#ffcc00',
    appBackground: '#e5e5e5',
    shellBackground: '#f2f2f2',
    cardBackground: '#ffffff',
    textColor: '#000000',
    mutedTextColor: '#555555',
    borderColor: '#000000',
    borderRadius: 'sharp',
    borderRadiusValue: '2px',
    shadowStyle: 'sharp-border',
    fontStyle: 'swiss-editorial',
    iconEmoji: '📐'
  },
  'neo-brutalist': {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Pop',
    eraName: '2020s Neo-Brutalist Pop Era',
    tagline: 'Thick Black Outlines, Hard Solid Shadows & Pop Colors',
    description:
      'Playful, bold, and high-energy: thick 2.5px solid black borders, hard drop-shadows (4px 4px 0px black), electric yellow headers, and sticker badges.',
    primaryColor: '#000000',
    accentColor: '#ffe600',
    accentSecondary: '#ff4d8d',
    accentTertiary: '#00e575',
    appBackground: '#fff066',
    shellBackground: '#fffbeb',
    cardBackground: '#ffffff',
    textColor: '#000000',
    mutedTextColor: '#333333',
    borderColor: '#000000',
    borderRadius: 'subtle',
    borderRadiusValue: '10px',
    shadowStyle: 'hard-brutalist',
    fontStyle: 'bold-brutalist',
    iconEmoji: '💥'
  },
  'executive-luxury': {
    id: 'executive-luxury',
    name: 'Executive Midnight Luxury',
    eraName: 'Modern Executive VIP Era',
    tagline: 'Deep Midnight Navy, Champagne Gold & Frosted Glass',
    description:
      'Opulent executive presence: deep midnight navy foundation, warm metallic champagne gold accents, frosted glass textures, and elevated high-status poise.',
    primaryColor: '#feb913',
    accentColor: '#eab308',
    accentSecondary: '#38bdf8',
    accentTertiary: '#a855f7',
    appBackground: '#020617',
    shellBackground: '#0b1120',
    cardBackground: '#111c33',
    textColor: '#f8fafc',
    mutedTextColor: '#94a3b8',
    borderColor: 'rgba(254, 185, 19, 0.28)',
    borderRadius: 'modern',
    borderRadiusValue: '20px',
    shadowStyle: 'luxury-glass',
    fontStyle: 'executive-serif',
    iconEmoji: '👑'
  }
};

export const ERA_LIST: EraSystemDefinition[] = Object.values(ERA_SYSTEMS);

export function getEraDefinition(eraId: EraSystemId): EraSystemDefinition {
  return ERA_SYSTEMS[eraId] || ERA_SYSTEMS['cognify-bento'];
}

export function createThemeForEra(eraId: EraSystemId, baseTheme?: Partial<BrandThemeConfig>): BrandThemeConfig {
  const era = getEraDefinition(eraId);
  return {
    era: era.id,
    primaryColor: baseTheme?.primaryColor || era.primaryColor,
    accentColor: baseTheme?.accentColor || era.accentColor,
    accentSecondary: era.accentSecondary,
    accentTertiary: era.accentTertiary,
    sidebarTone: era.id === 'cyberpunk-neon' || era.id === 'executive-luxury' ? 'dark' : 'charcoal',
    logoStyle: baseTheme?.logoStyle || 'monogram',
    logoImageUrl: baseTheme?.logoImageUrl,
    companyName: baseTheme?.companyName || 'Open Technology PLC',
    companyShortName: baseTheme?.companyShortName || 'OTP',
    companyTagline: baseTheme?.companyTagline || 'Marketing & Digital Advertising Agency',
    density: baseTheme?.density || (era.id === 'classic-90s-erp' ? 'compact' : 'comfortable'),
    simplicityMode: baseTheme?.simplicityMode || 'balanced',
    borderRadius: era.borderRadius,
    hideDecorativeCards: baseTheme?.hideDecorativeCards || false,
    highContrastTables: era.id === 'classic-90s-erp' || era.id === 'swiss-bauhaus' || (baseTheme?.highContrastTables ?? false),
    enableTransitions: baseTheme?.enableTransitions ?? true
  };
}

export function applyEraToDocument(theme: BrandThemeConfig) {
  if (typeof document === 'undefined') return;

  const era = getEraDefinition(theme.era || 'cognify-bento');
  const root = document.documentElement;

  // Set top-level data attributes
  root.setAttribute('data-era', era.id);
  root.setAttribute('data-theme-density', theme.density || 'comfortable');
  root.setAttribute('data-theme-simplicity', theme.simplicityMode || 'balanced');
  root.setAttribute('data-theme-radius', theme.borderRadius || era.borderRadius);

  // Set CSS Variables for every area of the system
  root.style.setProperty('--erp-era-id', era.id);
  root.style.setProperty('--erp-app-bg', era.appBackground);
  root.style.setProperty('--erp-shell-bg', era.shellBackground);
  root.style.setProperty('--erp-card-bg', era.cardBackground);
  root.style.setProperty('--erp-text', era.textColor);
  root.style.setProperty('--erp-muted', era.mutedTextColor);
  root.style.setProperty('--erp-border', era.borderColor);
  root.style.setProperty('--erp-radius', era.borderRadiusValue);

  // Colors
  root.style.setProperty('--otp-primary', theme.primaryColor || era.primaryColor);
  root.style.setProperty('--otp-accent', theme.accentColor || era.accentColor);
  root.style.setProperty('--otp-accent-blue', theme.accentSecondary || era.accentSecondary);
  root.style.setProperty('--otp-accent-pink', theme.accentTertiary || era.accentTertiary);
  root.style.setProperty('--otp-accent-gold', '#feb913');

  // Body styles for full viewport coverage
  if (document.body) {
    document.body.style.backgroundColor = era.appBackground;
    document.body.style.color = era.textColor;
  }
}
