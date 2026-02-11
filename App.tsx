
import React, { useState, useEffect, useCallback } from 'react';
import { StyleInputs, GenerationResult } from './types';
import StyleForm from './components/StyleForm';
import ResultDisplay from './components/ResultDisplay';
import ImageUploader from './components/ImageUploader';
import { generateOutfitSuggestion, generateMoodboardImage } from './services/geminiService';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<StyleInputs>({
    gender: 'Unisex',
    occasion: 'Casual',
    travelPurpose: 'Vacation',
    outfitInspiration: 'Minimalist',
    skinTone: 'Wheatish',
    climate: 'Sunny',
    location: '',
    setting: 'Indoor',
    userRequest: ''
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate on input changes for a reactive "Live" feel
  useEffect(() => {
    // Trigger if key inputs change
    if (inputs.occasion) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 500); // Debounce to prevent too many calls
      return () => clearTimeout(timer);
    }
  }, [inputs.occasion, inputs.travelPurpose, inputs.outfitInspiration, inputs.climate, inputs.setting]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const suggestion = await generateOutfitSuggestion(inputs, uploadedImage || undefined);
      setResult({ suggestion });
      
      const moodboardUrl = await generateMoodboardImage(suggestion, inputs);
      setResult(prev => prev ? { ...prev, moodboardUrl } : null);
    } catch (err) {
      console.error(err);
      setError("AI Stylist is recalibrating. Please wait...");
    } finally {
      setLoading(false);
    }
  }, [inputs, uploadedImage]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-20 selection:bg-black selection:text-white">
      <header className="pt-16 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 shadow-sm text-black text-[10px] uppercase font-black tracking-widest mb-6 rounded-full">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          Tech_Fashion Intelligence
        </div>
        <h1 className="text-6xl md:text-8xl font-serif gradient-text mb-6 tracking-tighter">Tech_Fashion</h1>
        <p className="max-w-2xl mx-auto text-gray-400 font-light text-xl leading-relaxed">
          Instantly curate your look. Switch tabs to see designs change automatically. 
          Upload a piece for a professional suitability audit.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* CONFIGURATION SIDE */}
        <section className="lg:col-span-5 space-y-10">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl shadow-black/[0.02] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            
            <h2 className="text-3xl font-serif mb-8 flex items-center gap-3">
              Design Controls
            </h2>
            
            <div className="space-y-10">
              <ImageUploader 
                onImageSelected={(img) => {
                  setUploadedImage(img);
                  if (img) handleSubmit(); // Immediate generate on upload
                }} 
                requestValue={inputs.userRequest || ""}
                onRequestChange={(val) => setInputs(prev => ({...prev, userRequest: val}))}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Contextual Modules</span>
                </div>
              </div>

              <StyleForm 
                inputs={inputs} 
                setInputs={setInputs} 
                onSubmit={handleSubmit} 
                isLoading={loading} 
              />
            </div>
          </div>
        </section>

        {/* RESULTS SIDE */}
        <section className="lg:col-span-7">
          {error && (
            <div className="p-6 mb-8 bg-amber-50 text-amber-800 rounded-3xl border border-amber-100 text-sm font-bold flex items-center gap-3">
              ⚠️ {error}
            </div>
          )}

          {result ? (
            <ResultDisplay suggestion={result.suggestion} moodboardUrl={result.moodboardUrl} />
          ) : !loading && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[60px] bg-white/40 text-gray-300 p-16 text-center">
              <div className="w-32 h-32 mb-8 bg-white rounded-full shadow-inner flex items-center justify-center text-6xl opacity-30">
                ✨
              </div>
              <h3 className="text-3xl font-serif text-gray-500 mb-4 tracking-tight">Design Awaits</h3>
              <p className="text-sm max-w-sm leading-relaxed text-gray-400 font-medium">
                Your wardrobe intelligence is currently offline. Select an occasion above to activate the generative engine.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 space-y-8">
               <div className="relative w-48 h-48">
                 <div className="absolute inset-0 border-b-2 border-black rounded-full animate-spin"></div>
                 <div className="absolute inset-4 border-t-2 border-gray-200 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-4xl">👔</div>
               </div>
               <div className="space-y-2">
                 <h3 className="text-3xl font-serif tracking-tight">Recalibrating Styles...</h3>
                 <p className="text-gray-400 max-w-xs mx-auto text-xs uppercase tracking-widest font-bold">
                   Matching colors, fabrics, and setting comfort
                 </p>
               </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-32 py-16 px-6 border-t border-gray-100 flex flex-col items-center bg-white/50 backdrop-blur-sm">
        <div className="text-3xl font-serif gradient-text mb-6">Tech_Fashion</div>
        <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
          <span>Accuracy</span>
          <span>Aesthetics</span>
          <span>Ethics</span>
        </div>
        <p className="mt-10 text-gray-300 text-[10px] tracking-[0.4em] uppercase font-bold">EST. 2025 • GEMINI PRO INFRASTRUCTURE</p>
      </footer>
    </div>
  );
};

export default App;
