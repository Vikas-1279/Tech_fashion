
import React from 'react';
import { OutfitSuggestion } from '../types';

interface ResultDisplayProps {
  suggestion: OutfitSuggestion;
  moodboardUrl?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ suggestion, moodboardUrl }) => {
  const isMismatch = suggestion.suitabilityStatus !== 'Perfect Match';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="space-y-6">
        {/* Suitability Verdict */}
        <div className={`p-6 rounded-3xl border-2 transition-all ${
          isMismatch 
            ? "bg-red-50 border-red-200 text-red-900 shadow-lg shadow-red-100" 
            : "bg-green-50 border-green-200 text-green-900"
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-3 h-3 rounded-full ${isMismatch ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            <h4 className="text-xs font-black uppercase tracking-widest">Tech_Fashion Verdict: {suggestion.suitabilityStatus}</h4>
          </div>
          <p className="text-sm font-medium leading-relaxed">{suggestion.suitabilityFeedback}</p>
        </div>

        <div>
          <h3 className="text-4xl font-serif mb-4 leading-tight">The Recommended Look</h3>
          <p className="text-gray-600 leading-relaxed italic border-l-4 border-black/10 pl-5 py-1">
            "{suggestion.explanation}"
          </p>
        </div>

        {suggestion.matchingAdvice && (
          <div className="p-5 bg-black text-white rounded-2xl shadow-xl">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Style Implementation</h4>
            <p className="text-sm leading-relaxed text-gray-200">{suggestion.matchingAdvice}</p>
          </div>
        )}

        <div className="space-y-3">
          {[
            { label: 'Top', val: suggestion.top, icon: '🧥' },
            { label: 'Bottom', val: suggestion.bottom, icon: '👖' },
            { label: 'Footwear', val: suggestion.footwear, icon: '👟' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-xl text-xl">{item.icon}</div>
              <div>
                <h4 className="font-bold text-[9px] uppercase tracking-widest text-gray-400">{item.label}</h4>
                <p className="text-gray-900 font-semibold text-sm">{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-bold text-[11px] uppercase tracking-widest text-gray-400 mb-4">Harmony Palette</h4>
          <div className="flex flex-wrap gap-2">
            {suggestion.colorPalette.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl border border-gray-100 shadow-sm" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-mono text-gray-400">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-8 self-start space-y-6">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center lg:text-left">Visual Generation</h3>
        <div className="rounded-[40px] overflow-hidden shadow-2xl bg-white aspect-square border-8 border-white group relative">
          {moodboardUrl ? (
            <img 
              src={moodboardUrl} 
              alt="AI Moodboard" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
               <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
               <p className="text-[10px] uppercase font-bold tracking-widest">Rendering Design...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
