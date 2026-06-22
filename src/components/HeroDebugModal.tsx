"use client";
import React, { useState, useEffect } from 'react';
import { CustomSlider } from './CustomSlider';

export const HeroDebugModal: React.FC = () => {
  const [minIntensity, setMinIntensity] = useState(0.5);
  const [maxIntensity, setMaxIntensity] = useState(1.0);

  useEffect(() => {
    const doc = document.documentElement;
    doc.style.setProperty('--hero-min-intensity', minIntensity.toString());
    doc.style.setProperty('--hero-max-intensity', maxIntensity.toString());
  }, [minIntensity, maxIntensity]);

  const cssOutput = `--hero-min-intensity: ${minIntensity.toFixed(2)};
--hero-max-intensity: ${maxIntensity.toFixed(2)};`;

  return (
    <div className="fixed bottom-4 right-4 z-[3000] w-[280px] border border-[#3b3b3b] bg-[#0A0A0A]/95 backdrop-blur-xl p-4 shadow-2xl space-y-6 pointer-events-auto select-none">
      <div className="flex justify-between items-center border-b border-[#3b3b3b] pb-2 mb-4">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/60">Motion Calibration</h3>
      </div>

      <div className="w-full space-y-4 font-mono text-[10px]">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Min Intensity (320px)</span>
            <span className="text-[#39C73B]">{minIntensity.toFixed(2)}</span>
          </div>
          <CustomSlider 
            id="hero-min-i" 
            value={minIntensity * 100} 
            max={200} 
            min={0} 
            step={1}
            onValueChange={(v) => setMinIntensity(v / 100)} 
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Max Intensity (800px)</span>
            <span className="text-[#39C73B]">{maxIntensity.toFixed(2)}</span>
          </div>
          <CustomSlider 
            id="hero-max-i" 
            value={maxIntensity * 100} 
            max={200} 
            min={0} 
            step={1}
            onValueChange={(v) => setMaxIntensity(v / 100)} 
          />
        </div>

        <div className="pt-4 border-t border-[#232323]">
          <h4 className="text-white/20 mb-2 uppercase text-[9px]">Drafting Variables</h4>
          <textarea 
            readOnly 
            className="w-full bg-black border border-[#232323] p-2 rounded-none text-[8px] text-[#39C73B] h-16 select-all font-mono custom-scrollbar outline-none resize-none"
            value={cssOutput}
          />
        </div>
      </div>
    </div>
  );
};
