
import React from 'react';
import { StyleInputs } from '../types';

interface StyleFormProps {
  inputs: StyleInputs;
  setInputs: React.Dispatch<React.SetStateAction<StyleInputs>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const StyleForm: React.FC<StyleFormProps> = ({ inputs, setInputs, onSubmit, isLoading }) => {
  const occasions = ['Partywear', 'Formalwear', 'Traditional', 'Casual', 'Wedding', 'Sports'];
  const travelPurposes = ['Vacation', 'Business Trip', 'Airport Look', 'Hiking', 'Beach Day', 'City Tour'];
  const inspirations = ['Minimalist', 'Streetwear', 'Old Money', 'Vintage', 'Avant-Garde', 'Bohemian'];
  const climates = ['Sunny', 'Cool', 'Snowing', 'Raining', 'Moderate'];
  const settings = ['Indoor', 'Outdoor'];

  const handleSelect = (name: keyof StyleInputs, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-3";
  const chipClasses = (selected: boolean) => 
    `px-5 py-2.5 text-[11px] font-bold rounded-2xl border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
      selected 
        ? "bg-black text-white border-black shadow-xl shadow-black/10 translate-y-[-1px]" 
        : "bg-gray-50/50 text-gray-400 border-gray-100 hover:border-gray-300"
    }`;

  const selectClasses = "w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white focus:outline-none transition-all text-sm font-semibold text-gray-700";

  return (
    <div className="space-y-10">
      {/* Occasion Section */}
      <div>
        <label className={labelClasses}>Current Occasion</label>
        <div className="flex flex-wrap gap-2.5">
          {occasions.map(opt => (
            <button 
              key={opt}
              type="button"
              onClick={() => handleSelect('occasion', opt)}
              className={chipClasses(inputs.occasion === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Travel Purpose Section */}
      <div>
        <label className={labelClasses}>Travel Purpose</label>
        <div className="flex flex-wrap gap-2.5">
          {travelPurposes.map(opt => (
            <button 
              key={opt}
              type="button"
              onClick={() => handleSelect('travelPurpose', opt)}
              className={chipClasses(inputs.travelPurpose === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit Inspiration Section */}
      <div>
        <label className={labelClasses}>Outfit Inspiration</label>
        <div className="flex flex-wrap gap-2.5">
          {inspirations.map(opt => (
            <button 
              key={opt}
              type="button"
              onClick={() => handleSelect('outfitInspiration', opt)}
              className={chipClasses(inputs.outfitInspiration === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Weather & Complexion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClasses}>Current Weather</label>
          <div className="flex flex-wrap gap-2.5">
            {climates.map(opt => (
              <button 
                key={opt}
                type="button"
                onClick={() => handleSelect('climate', opt)}
                className={chipClasses(inputs.climate === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Complexion Profile</label>
          <select 
            name="skinTone" 
            value={inputs.skinTone} 
            onChange={(e) => handleSelect('skinTone', e.target.value)} 
            className={selectClasses}
          >
            <option value="Fair">Fair (Very Light)</option>
            <option value="Wheatish">Wheatish (Medium Tan)</option>
            <option value="Deep Olive">Deep Olive (Warm)</option>
            <option value="Rich Deep">Rich Deep (Bronze)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div>
            <label className={labelClasses}>Gender</label>
            <select name="gender" value={inputs.gender} onChange={(e) => handleSelect('gender', e.target.value)} className={selectClasses}>
               <option value="Unisex">Unisex</option>
               <option value="Male">Male</option>
               <option value="Female">Female</option>
            </select>
         </div>
         <div>
            <label className={labelClasses}>Outfit Area</label>
            <select name="setting" value={inputs.setting} onChange={(e) => handleSelect('setting', e.target.value)} className={selectClasses}>
               {settings.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
         </div>
         <div className="flex items-end">
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full h-[54px] bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-800 disabled:bg-gray-200 transition-all shadow-xl shadow-black/10"
            >
              {isLoading ? "..." : "Refresh"}
            </button>
         </div>
      </div>
    </div>
  );
};

export default StyleForm;
