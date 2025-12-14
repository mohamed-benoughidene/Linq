
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
      borderRadius: '0.75rem', // rounded-xl
      borderWidth: '1px',
      shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
    },
  },
  {
    id: 'retro-pop',
    name: 'Retro Pop',
    type: 'retro',
    colors: {
      background: '#FEFCE8', // Cream
      text: '#000000',
      card: '#FFFFFF',
      primary: '#FACC15', // Yellow
      border: '#000000',
    },
    styles: {
      fontFamily: '"Space Mono", monospace',
      borderRadius: '0px',
      borderWidth: '2px',
      shadow: '4px 4px 0px 0px #000000',
    },
  },
];
