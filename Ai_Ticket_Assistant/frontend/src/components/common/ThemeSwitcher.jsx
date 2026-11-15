import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/60 border border-white/[0.08] backdrop-blur-md shadow-inner">
      <div className="hidden xl:flex items-center pl-2 pr-1 text-slate-500">
        <Palette className="w-3.5 h-3.5" />
      </div>

      {themes.map((t) => {
        const isSelected = t.id === theme;

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={`${t.name} — ${t.description}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-white/[0.14] text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: t.color,
                boxShadow: isSelected ? `0 0 10px ${t.color}, 0 0 20px ${t.color}` : 'none',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              }}
            />
            <span className="hidden md:inline font-semibold tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
