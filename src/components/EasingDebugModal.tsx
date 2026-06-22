"use client";
import React, { useState, useEffect } from 'react';
import { CustomSlider } from './CustomSlider';
import { Switch } from '@/components/ui/switch';

interface EasingDebugModalProps {
  forceHover: boolean;
  onForceHoverChange: (val: boolean) => void;
}

export const EasingDebugModal: React.FC<EasingDebugModalProps> = ({ 
  forceHover, 
  onForceHoverChange 
}) => {
  const [steps, setSteps] = useState(12);
  const [opacity, setOpacity] = useState(0.95);
  const [solid, setSolid] = useState(15); // Percentage of the gradient that is solid black
  const [totalHeight, setTotalHeight] = useState(65); // Percentage of card height the shadow covers

  // Generate an eased gradient based on the quadratic falloff logic
  const generateEasedGradient = () => {
    const easeStops = Array.from({ length: steps }).map((_, i) => {
      const t = i / (steps - 1);
      // Quadratic falloff for alpha: starts at 1 (bottom/solid end) and goes to 0 (top)
      const alpha = (opacity * Math.pow(1 - t, 2)).toFixed(3);
      // Map normalized t to the remaining percentage after the solid part
      const pos = (solid + t * (100 - solid)).toFixed(1);
      return `rgba(0,0,0,${alpha}) ${pos}%`;
    });

    return `linear-gradient(to top, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity}) ${solid}%, ${easeStops.join(', ')})`;
  };

  const gradientValue = generateEasedGradient();

  useEffect(() => {
    document.documentElement.style.setProperty('--eased-gradient', gradientValue);
    document.documentElement.style.setProperty('--eased-shadow-height', `${totalHeight}%`);
  }, [gradientValue, totalHeight]);

  return (
    <div className="fixed bottom-4 left-4 z-[3000] w-[280px] border border-[#3b3b3b] bg-[#0A0A0A]/95 backdrop-blur-xl p-4 shadow-2xl space-y-6 pointer-events-auto select-none">
      <div className="flex justify-between items-center border-b border-[#3b3b3b] pb-2 mb-4">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/60">Easing Discovery</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase text-white/40">Force Hover</span>
          <Switch checked={forceHover} onCheckedChange={onForceHoverChange} className="scale-75 origin-right" />
        </div>
      </div>

      <div className="w-full space-y-4 font-mono text-[10px]">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Shadow Coverage (%)</span>
            <span className="text-[#39C73B]">{totalHeight}%</span>
          </div>
          <CustomSlider id="easing-height" value={totalHeight} max={100} min={10} onValueChange={setTotalHeight} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Steps (Resolution)</span>
            <span className="text-[#39C73B]">{steps}</span>
          </div>
          <CustomSlider id="easing-steps" value={steps} max={24} min={2} onValueChange={setSteps} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Solid Base (%)</span>
            <span className="text-[#39C73B]">{solid}%</span>
          </div>
          <CustomSlider id="easing-solid" value={solid} max={60} min={0} onValueChange={setSolid} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-white/40 uppercase">
            <span>Base Opacity</span>
            <span className="text-[#39C73B]">{(opacity * 100).toFixed(0)}%</span>
          </div>
          <CustomSlider id="easing-opacity" value={opacity * 100} max={100} min={0} onValueChange={(v) => setOpacity(v / 100)} />
        </div>

        <div className="pt-4 border-t border-[#232323]">
          <h4 className="text-white/20 mb-2 uppercase text-[9px]">CSS Output (Content Ease)</h4>
          <textarea 
            readOnly 
            className="w-full bg-black border border-[#232323] p-2 rounded-none text-[8px] text-[#39C73B] h-20 select-all font-mono custom-scrollbar outline-none resize-none"
            value={`background: ${gradientValue};\nheight: ${totalHeight}%;`}
          />
        </div>
      </div>
    </div>
  );
};
