
import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string | null) => void;
  onRequestChange: (request: string) => void;
  requestValue: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, onRequestChange, requestValue }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Have an item already?
        </label>
        <div className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-black transition-all cursor-pointer overflow-hidden group">
          {preview ? (
            <>
              <img src={preview} alt="Garment preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); onImageSelected(null); onRequestChange(""); }}
                  className="p-2 bg-white rounded-full shadow-xl text-red-500 hover:scale-110 transition-transform"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-tighter">Upload piece (e.g. your white pants)</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
        </div>
      </div>

      {preview && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            What do you need help with?
          </label>
          <textarea
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:outline-none text-sm min-h-[100px] shadow-inner"
            placeholder="Ex: 'What color shirt goes best with these pants for a dinner?' or 'How should I style this jacket?'"
            value={requestValue}
            onChange={(e) => onRequestChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
