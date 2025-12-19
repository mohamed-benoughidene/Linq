export interface ThemePreset {
  id: string;
  name: string;
  type: 'modern' | 'retro' | 'minimal';
  colors: {
    background: string; // Page background
    text: string;       // Primary text
    card: string;       // Block background (if applicable)
    primary: string;    // Button/Accent color
    border: string;     // Border color (e.g., black or transparent)
  };
  styles: {
    fontFamily: string; // CSS font stack
    borderRadius: string; // e.g., '12px', '0px'
    borderWidth: string;  // e.g., '0px', '2px'
    shadow: string;       // CSS box-shadow string (e.g. '4px 4px 0px #000')
    backgroundType: 'solid' | 'gradient' | 'image';
    backgroundImage?: string;
    backgroundBlur?: number;
    fontPairing?: string;
    buttonStyle?: 'solid' | 'outline';
    blockBackgroundColor?: string;
    blockAlign?: 'left' | 'center' | 'right';
    blockTransparency?: number;
    blockTextColor?: string;
    blockButtonBg?: string;
    blockButtonText?: string;
    blockLabelColor?: string;
    blockBackgroundType?: 'solid' | 'gradient';
  };
}

export const THEMES: ThemePreset[] = [
  {
    id: 'clean',
    name: 'Clean',
    type: 'modern',
    colors: {
      background: '#ffffff',
      text: '#0f172a', // Slate-900
      card: '#ffffff',
      primary: '#000000',
      border: '#e2e8f0', // Slate-200
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px', // rounded-xl
      borderWidth: '1px',
      shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'left',
      blockTransparency: 0,
    },
  },
  {
    id: 'retro-pop',
    name: 'Retro Pop',
    type: 'retro',
    colors: {
      background: '#F8F9CC', // Light Greenish Cream
      text: '#000000',
      card: '#FFFFFF',
      primary: '#54BA4E', // Retro Green
      border: '#000000',
    },
    styles: {
      fontFamily: '"Space Mono", monospace',
      borderRadius: '0px',
      borderWidth: '3px',
      shadow: '6px 6px 0px 0px #000000',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'left',
      blockTransparency: 0,
      blockButtonText: '#000000',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    type: 'modern',
    colors: {
      background: '#F5F3FF', // Very light violet/lavender
      text: '#272D4D',       // Dark navy from SVG
      card: '#FFFFFF',
      primary: '#7966FA',    // Vibrant purple from SVG
      border: '#E4E0FE',     // Light purple border
    },
    styles: {
      fontFamily: 'Inter, sans-serif',
      borderRadius: '16px',  // Softer curves
      borderWidth: '1px',
      shadow: '0 8px 24px -4px rgba(121, 102, 250, 0.12)', // Colored shadow
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'center',
      blockTransparency: 0,
    },
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    type: 'modern',
    colors: {
      background: '#F0F4F8',
      text: '#001858',
      card: '#FFFFFF',
      primary: '#001858',
      border: '#8BD3DD',
    },
    styles: {
      fontFamily: '"Manrope", sans-serif',
      borderRadius: '12px',
      borderWidth: '2px',
      shadow: '4px 4px 0px 0px #8BD3DD',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'left',
      blockTransparency: 0,
    },
  },
  {
    id: 'volt',
    name: 'Volt',
    type: 'modern',
    colors: {
      background: '#1F2937',
      text: '#FDE047',
      card: '#374151',
      primary: '#FDE047',
      border: '#FDE047',
    },
    styles: {
      fontFamily: '"Space Mono", monospace',
      borderRadius: '4px',
      borderWidth: '1px',
      shadow: '0 0 10px rgba(253, 224, 71, 0.3)', // Glow effect
      backgroundType: 'solid',
      buttonStyle: 'outline', // Outline buttons fit the "tech" vibe
      blockBackgroundColor: '#374151',
      blockTextColor: '#FDE047',
      blockAlign: 'left',
      blockTransparency: 0,
      blockButtonText: '#1F2937', // Dark text on yellow button
      blockButtonBg: '#FDE047',
    },
  },
  {
    id: 'adventure',
    name: 'Adventure',
    type: 'retro',
    colors: {
      background: '#2D2D2D',
      text: '#F0EBDE',
      card: '#133629',
      primary: '#ED602E',
      border: '#133629',
    },
    styles: {
      fontFamily: '"Libre Baskerville", serif',
      borderRadius: '16px',
      borderWidth: '0px',
      shadow: '0 4px 12px rgba(0,0,0,0.3)',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#133629',
      blockTextColor: '#F0EBDE',
      blockAlign: 'center',
      blockTransparency: 0,
    },
  },

  {
    id: 'sunset',
    name: 'Sunset',
    type: 'modern',
    colors: {
      background: '#FF512F', // Fallback for gradient
      text: '#FFFFFF',
      card: 'rgba(255, 255, 255, 0.1)',
      primary: '#FFFFFF',
      border: 'rgba(255, 255, 255, 0.2)',
    },
    styles: {
      fontFamily: '"Outfit", sans-serif',
      borderRadius: '16px',
      borderWidth: '1px',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      backgroundType: 'gradient',
      backgroundImage: 'linear-gradient(to bottom right, #FF512F, #DD2476)',
      backgroundBlur: 4,
      buttonStyle: 'solid',
      blockBackgroundColor: 'rgba(255, 255, 255, 0.1)',
      blockTextColor: '#FFFFFF',
      blockAlign: 'center',
      blockTransparency: 0.1,
      blockButtonText: '#DD2476',
      blockButtonBg: '#FFFFFF',
    },
  },
  {
    id: 'noir',
    name: 'Noir',
    type: 'minimal',
    colors: {
      background: '#ffffff',
      text: '#000000',
      card: '#ffffff',
      primary: '#000000',
      border: '#000000',
    },
    styles: {
      fontFamily: '"Playfair Display", serif',
      borderRadius: '0px',
      borderWidth: '2px',
      shadow: '0 0 0 0 transparent',
      backgroundType: 'solid',
      buttonStyle: 'outline',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'center',
      blockTransparency: 0,
    },
  },
  {
    id: 'elegance',
    name: 'Elegance',
    type: 'modern',
    colors: {
      background: '#121212',
      text: '#E0E0E0',
      card: '#1E1E1E',
      primary: '#D4AF37',
      border: '#D4AF37',
    },
    styles: {
      fontFamily: '"Libre Baskerville", serif',
      borderRadius: '8px',
      borderWidth: '1px',
      shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#1E1E1E',
      blockTextColor: '#E0E0E0',
      blockAlign: 'left',
      blockTransparency: 0,
      blockButtonText: '#121212',
      blockButtonBg: '#D4AF37',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'modern',
    colors: {
      background: '#E8F5E9',
      text: '#1B4332',
      card: '#FFFFFF',
      primary: '#2D6A4F',
      border: '#B7E4C7',
    },
    styles: {
      fontFamily: '"DM Sans", sans-serif',
      borderRadius: '24px',
      borderWidth: '1px',
      shadow: '0 10px 15px -3px rgba(45, 106, 79, 0.1)',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'left',
      blockTransparency: 0,
    },
  },
  {
    id: 'azure',
    name: 'Azure',
    type: 'modern',
    colors: {
      background: '#F0F9FF',
      text: '#0C4A6E',
      card: '#FFFFFF',
      primary: '#0284C7',
      border: '#BAE6FD',
    },
    styles: {
      fontFamily: '"Inter", sans-serif',
      borderRadius: '12px',
      borderWidth: '1px',
      shadow: '0 4px 6px -1px rgba(2, 132, 199, 0.1)',
      backgroundType: 'solid',
      buttonStyle: 'solid',
      blockBackgroundColor: '#ffffff',
      blockAlign: 'left',
      blockTransparency: 0,
    },
  },
];
