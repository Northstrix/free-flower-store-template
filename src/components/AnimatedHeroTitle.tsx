"use client";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useApp } from './AppProvider';

const ease = {
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  in: (t: number) => Math.pow(t, 3),
};

function cyc(f: number, offset: number, enter: number, hold: number, exit: number, pause: number) {
  if (f < offset) return 0;
  const total = enter + hold + exit + pause;
  const t = (f - offset) % total;
  if (t < enter) return ease.out(t / enter);
  if (t < enter + hold) return 1;
  if (t < enter + hold + exit) return 1 - ease.in((t - enter - hold) / exit);
  return 0;
}

const calculateIntensity = (width: number, minI: number, maxI: number) => {
  const low = 320;
  const high = 800;
  if (width >= high) return maxI;
  if (width <= low) return minI;
  const factor = (width - low) / (high - low);
  return minI + factor * (maxI - minI);
};

// Linearly interpolates margin values between 1280px and 1464px screen widths
const calculateMarginInlineStart = (width: number, isRTL: boolean): string => {
  const minWidth = 1280;
  const maxWidth = 1464;

  // Determine bounds depending on Text Direction
  const startVal = isRTL ? -2 : -7;
  const endVal = isRTL ? -4 : -10;

  if (width <= minWidth) return `${startVal}px`;
  if (width >= maxWidth) return `${endVal}px`;

  // Standard linear interpolation formula: y = y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
  const factor = (width - minWidth) / (maxWidth - minWidth);
  const interpolatedValue = startVal + factor * (endVal - startVal);
  
  return `${interpolatedValue}px`;
};

export const AnimatedHeroTitle = ({ isLargeDesktop = false }: { isLargeDesktop?: boolean }) => {
  const { t, isRTL } = useApp();
  const word = t('flower_word');
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [chars, setChars] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);

  useEffect(() => {
    setChars(word.split(''));
    frameRef.current = 0;
  }, [word]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (containerRef.current) {
        const style = getComputedStyle(document.documentElement);
        
        const baseEnter = parseInt(style.getPropertyValue('--hero-enter')) || 92;
        const baseHold = parseInt(style.getPropertyValue('--hero-hold')) || 42;
        const baseExit = parseInt(style.getPropertyValue('--hero-exit')) || 36;
        const basePause = parseInt(style.getPropertyValue('--hero-pause')) || 44;
        const baseStagger = parseInt(style.getPropertyValue('--hero-stagger')) || 8;
        const baseSpread = parseInt(style.getPropertyValue('--hero-spread')) || 16;
        const baseOffset = parseInt(style.getPropertyValue('--hero-offset')) || 32;
        const minIntensity = parseFloat(style.getPropertyValue('--hero-min-intensity')) || 0.5;
        const maxIntensity = parseFloat(style.getPropertyValue('--hero-max-intensity')) || 1.0;

        const intensity = calculateIntensity(windowWidth, minIntensity, maxIntensity);
        const liveChars = containerRef.current.querySelectorAll('.char-live');
        const N = liveChars.length;
        const center = (N - 1) / 2;

        liveChars.forEach((el: any, i) => {
          const p = cyc(frameRef.current, i * (baseStagger * intensity), baseEnter, baseHold, baseExit, basePause);
          const dist = (Math.abs(i - center) * baseSpread + baseOffset) * intensity;
          const dir = i % 2 === 0 ? -1 : 1;
          el.style.transform = `translateY(${dir * dist * p}px)`;
          el.style.opacity = '1';
        });
      }
      frameRef.current++;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [chars, windowWidth]);

  const config = useMemo(() => {
    return {
      fontWeight: isRTL ? 600 : 900,
      fontSize: isRTL ? "clamp(4.95rem, 12.1vw, 13.2rem)" : "clamp(3.6rem, 8.8vw, 9.6rem)",
      trackingGap: isRTL ? "0.05em" : "0.0275em",
      marginInlineStart: isLargeDesktop ? calculateMarginInlineStart(windowWidth, isRTL) : "auto"
    };
  }, [isRTL, isLargeDesktop, windowWidth]);

  return (
    <div 
      className="relative flex min-h-[160px] md:min-h-[220px] w-full"
      style={{
        // Logical properties handle direction-aware swapping cleanly without adding space gaps
        justifyContent: isLargeDesktop ? "start" : "center",
        alignItems: isLargeDesktop ? "start" : "center",
        textAlign: isLargeDesktop ? "start" : "center"
      }}
    >
      <div 
        ref={containerRef} 
        className="grid grid-cols-1 grid-rows-1 select-none inline-grid"
        style={{ 
          fontWeight: config.fontWeight, 
          fontSize: config.fontSize,
          justifyItems: isLargeDesktop ? "start" : "center",
          // Interpolated dynamics hook onto the layout securely here
          marginInlineStart: config.marginInlineStart,
          marginInlineEnd: isLargeDesktop ? "0px" : "auto",
        }}
      >
        {/* Ghost Layer */}
        <div 
          className="col-start-1 row-start-1 hero-title pointer-events-none flex" 
          style={{ 
            gap: config.trackingGap,
            color: "var(--foreground)",
            opacity: 0.14,
            justifyContent: isLargeDesktop ? "start" : "center"
          }}
          aria-hidden="true"
        >
          {chars.map((ch, i) => (
            <span key={`ghost-${i}`} className="inline-block whitespace-pre leading-none">
              {ch === ' ' ? '\u00a0' : ch}
            </span>
          ))}
        </div>

        {/* Live Layer */}
        <div 
          className="col-start-1 row-start-1 hero-title flex pointer-events-none"
          style={{ 
            gap: config.trackingGap,
            color: "var(--foreground)",
            justifyContent: isLargeDesktop ? "start" : "center"
          }}
        >
          {chars.map((ch, i) => (
            <span 
              key={`live-${i}`} 
              className="char-live inline-block whitespace-pre leading-none will-change-transform opacity-0"
              style={{
                color: i % 2 === 0 ? "var(--primary)" : "inherit"
              }}
            >
              {ch === ' ' ? '\u00a0' : ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};