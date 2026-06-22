
"use client";

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useApp } from '@/components/AppProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ZoomIn, Download, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import flowerData from '@/lib/flower-data.json';
import { cn } from '@/lib/utils';
import { getColorHarmonies, anyToHex } from '@/lib/color-utils';
import { CustomSlider } from './CustomSlider';
import RefinedChronicleButton from '@/components/ui/RefinedChronicleButton';
import ColorPicker from './ColorPicker';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CustomCheckbox from './CustomCheckbox';
import { getFlowerName } from '@/lib/flower-name-translations';

interface PlottedFlower {
  id: string;
  typeId: string;
  x: number;
  y: number;
}

interface ArrangementToolProps {
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FlowerBedArrangementTool({ cart, setCart }: ArrangementToolProps) {
  const { t, isRTL, isHydrated, lang } = useApp();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const [wFt, setWFt] = useState(5);
  const [wIn, setWIn] = useState(0);
  const [hFt, setHFt] = useState(3);
  const [hIn, setHIn] = useState(0);

  const [plottedFlowers, setPlottedFlowers] = useState<PlottedFlower[]>([]);
  const [baseColor, setBaseColor] = useState('#39C73B');
  const [zoom, setZoom] = useState(1);
  const [markerTextColor, setMarkerTextColor] = useState<'white' | 'black'>('black');
  const [hoveredFlowerId, setHoveredFlowerId] = useState<string | null>(null);

  const [wFtActive, setWFtActive] = useState(false);
  const [wInActive, setWInActive] = useState(false);
  const [hFtActive, setHFtActive] = useState(false);
  const [hInActive, setHInActive] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | string>('auto');

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarRef.current) setSidebarHeight(sidebarRef.current.offsetHeight);
      else setSidebarHeight('auto');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const cartCountMap = cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setPlottedFlowers(prev => {
      const typeCounts = {} as Record<string, number>;
      return prev.filter(f => {
        const cartCount = cartCountMap[f.typeId] || 0;
        typeCounts[f.typeId] = (typeCounts[f.typeId] || 0) + 1;
        const info = flowerData.flowers.find(fd => fd.id === f.typeId);
        return info && typeCounts[f.typeId] <= cartCount;
      });
    });
  }, [cart]);

  const totalWidthIn = useMemo(() => (wFt * 12) + wIn, [wFt, wIn]);
  const totalHeightIn = useMemo(() => (hFt * 12) + hIn, [hFt, hIn]);
  const sanitizedBaseColor = useMemo(() => anyToHex(baseColor), [baseColor]);
  const convergencePalette = useMemo(() => getColorHarmonies(sanitizedBaseColor).convergence, [sanitizedBaseColor]);
  const sanctuaryUniqueTypes = useMemo(() => Array.from(new Set(cart)).sort(), [cart]);

  const typeMap = useMemo(() => {
    const mapping: Record<string, { color: string; index: number }> = {};
    sanctuaryUniqueTypes.forEach((typeId, idx) => {
      mapping[typeId] = { color: convergencePalette[idx % convergencePalette.length], index: idx + 1 };
    });
    return mapping;
  }, [sanctuaryUniqueTypes, convergencePalette]);

  const cartCounts = useMemo(
    () => cart.reduce((acc, id) => ((acc[id] = (acc[id] || 0) + 1), acc), {} as Record<string, number>),
    [cart]
  );

  const plottedCounts = useMemo(
    () => plottedFlowers.reduce((acc, f) => ((acc[f.typeId] = (acc[f.typeId] || 0) + 1), acc), {} as Record<string, number>),
    [plottedFlowers]
  );

  const currentScale = 8 * zoom;

  const formatDistanceForHeader = (inches: number) => {
    if (inches === 0) return '0';
    const ft = Math.floor(inches / 12);
    const remIn = Math.round(inches % 12);
    if (isRTL) {
      return `"${remIn} '${ft}`;
    } else {
      return `${ft}' ${remIn}"`;
    }
  };

  const formatDistance = (inches: number, includeUnits = false) => {
    if (inches === 0) return '0';
    const ft = Math.floor(inches / 12);
    const remIn = Math.round(inches % 12);
    const hasFt = ft > 0;
    const hasIn = remIn > 0;

    if (isRTL) {
      let parts = [];
      if (hasIn) parts.push(`"${remIn}`);
      if (hasFt) parts.push(`'${ft}`);
      return parts.join(' ');
    } else {
      let parts = [];
      if (hasFt) parts.push(`${ft}'`);
      if (hasIn) parts.push(`${remIn}"`);
      return parts.join(' ');
    }
  };

  const formatSliderValue = (val: number, unit: 'ft' | 'in') => {
    const sym = unit === 'ft' ? "'" : '"';
    if (isRTL) return `${sym}${val}`;
    return `${val}${sym}`;
  };

  const scalingInfo = useMemo(() => {
    let minFactor = 1;
    const baseSize = 76 * zoom;
    
    plottedFlowers.forEach(f => {
      const data = flowerData.flowers.find(fd => fd.id === f.typeId);
      if (data) {
        const spacingPx = data.recommended_spacing * currentScale;
        if (spacingPx * 0.6 < baseSize) {
          const factor = (spacingPx * 0.6) / baseSize;
          if (factor < minFactor) minFactor = factor;
        }
      }
    });
    
    return { 
      factor: minFactor, 
      isScaled: minFactor < 1 
    };
  }, [plottedFlowers, zoom, currentScale]);

  const finalMarkerSize = 76 * zoom * scalingInfo.factor;
  const markerFontSizeReduction = scalingInfo.isScaled ? 2 : 0;

  const hoveredFlower = useMemo(() => plottedFlowers.find(f => f.id === hoveredFlowerId), [plottedFlowers, hoveredFlowerId]);

  const addFlower = (typeId: string) => {
    const currentCount = plottedCounts[typeId] || 0;
    const maxAllowed = cartCounts[typeId] || 0;
    if (currentCount >= maxAllowed) return;
    setPlottedFlowers(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), typeId, x: totalWidthIn / 2, y: totalHeightIn / 2 }]);
  };

  const removeFlower = (typeId: string) => {
    const lastIdx = plottedFlowers.findLastIndex(f => f.typeId === typeId);
    if (lastIdx !== -1) {
      const next = [...plottedFlowers];
      next.splice(lastIdx, 1);
      setPlottedFlowers(next);
    }
  };

  const calculatePenalty = (flower: PlottedFlower) => {
    const data = flowerData.flowers.find(f => f.id === flower.typeId);
    if (!data) return 0;

    const S = data.recommended_spacing;
    const halfS = S / 2;
    let maxOverlappingDeficit = 0;

    plottedFlowers.forEach(other => {
      if (other.id === flower.id) return;
      const otherData = flowerData.flowers.find(fd => fd.id === other.typeId);
      if (!otherData) return;
      const threshold = (S + otherData.recommended_spacing) / 2;
      const dx = Math.abs(flower.x - other.x);
      const dy = Math.abs(flower.y - other.y);
      if (dx < threshold && dy < threshold) {
        maxOverlappingDeficit = Math.max(maxOverlappingDeficit, Math.max(threshold - dx, threshold - dy));
      }
    });

    const boundDeficitX = Math.max(0, halfS - flower.x) + Math.max(0, (flower.x + halfS) - totalWidthIn);
    const boundDeficitY = Math.max(0, halfS - flower.y) + Math.max(0, (flower.y + halfS) - totalHeightIn);
    const totalDeficit = Math.max(maxOverlappingDeficit, boundDeficitX, boundDeficitY);
    if (totalDeficit <= 0) return 0;

    const profile = [...data.grow_insufficiency_profile].sort((a, b) => b.deficit - a.deficit);
    const match = profile.find(p => totalDeficit >= p.deficit);
    return match ? match.penalty : 0;
  };

  const handleDrag = (id: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const moveHandler = (moveEvent: any) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const relativeX = (clientX - rect.left) / rect.width;
      const relativeY = (clientY - rect.top) / rect.height;

      const logicalX = isRTL ? (1 - relativeX) * totalWidthIn : relativeX * totalWidthIn;
      const logicalY = relativeY * totalHeightIn;

      setPlottedFlowers(prev =>
        prev.map(f =>
          f.id === id
            ? { ...f, x: Math.max(0, Math.min(totalWidthIn, logicalX)), y: Math.max(0, Math.min(totalHeightIn, logicalY)) }
            : f
        )
      );
    };

    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      window.removeEventListener('touchend', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('mouseup', upHandler);
    window.addEventListener('touchend', upHandler);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.98 : 1.02;
      setZoom(prev => Math.max(0.2, Math.min(10.0, prev * factor)));
    }
  };

  const zoomToSlider = (z: number) => 50 * (Math.log10(z) + 1);
  const sliderToZoom = (v: number) => Math.pow(10, (v / 50) - 1);

  const renderRulerTicks = (totalSize: number, orientation: 'horizontal' | 'vertical') => {
    const ticks = [] as JSX.Element[];
    const tickInterval = zoom >= 7.5 ? 3 : zoom >= 3 ? 4 : zoom >= 1 ? 6 : 12;
    const tickFontSize = Math.min(12, Math.max(8, 9 * zoom));
    
    for (let i = 0; i <= totalSize; i += tickInterval) {
      const isFoot = i % 12 === 0;
      const tickSize = isFoot ? 16 : (zoom >= 5 ? 12 : 8);
      const showLabel = isFoot || zoom >= 5;
      const labelValue = i === 0 ? '0' : (isFoot ? `${i/12}'` : `${i}"`);
      const label = isRTL ? (isFoot && i !== 0 ? `'${i/12}` : (i === 0 ? '0' : `"${i}`)) : labelValue;

      const style: React.CSSProperties = { position: 'absolute', pointerEvents: 'none' };

      if (orientation === 'horizontal') {
        const pos = i * currentScale;
        if (isRTL) style.right = pos;
        else style.left = pos;
        
        style.bottom = 0;
        style.height = tickSize;
        style.borderLeft = '1px solid var(--secondary-border)';
        style.transform = isRTL ? 'translateX(0.5px)' : 'translateX(-0.5px)';
      } else {
        style.top = i * currentScale;
        if (isRTL) style.right = 0;
        else style.left = 0;
        
        style.width = tickSize;
        style.borderTop = '1px solid var(--secondary-border)';
        style.transform = 'translateY(-0.5px)';
      }

      ticks.push(
        <div key={`${orientation}-${i}`} style={style}>
          {showLabel && (
            <span
              className={cn(
                'absolute font-mono text-white/20 whitespace-nowrap transition-all duration-200 bg-transparent select-none',
                orientation === 'horizontal'
                  ? 'bottom-full mb-[12px] left-1/2 -translate-x-1/2 text-center'
                  : 'text-center',
                orientation === 'vertical' ? (isRTL ? 'left-full ml-[12px] top-1/2 -translate-y-1/2' : 'right-full mr-[12px] top-1/2 -translate-y-1/2') : ''
              )}
              style={{ 
                fontSize: `${tickFontSize}px`,
                transform: orientation === 'horizontal' ? 'translate(-50%, 0)' : 'translateY(-50%)'
              }}
              dir="ltr"
            >
              {label}
            </span>
          )}
        </div>
      );
    }

    return ticks;
  };

  const exportConfig = () => {
    const config = { wFt, wIn, hFt, hIn, baseColor, markerTextColor, zoom, plottedFlowers, cart };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flower-store-config-${Date.now()}.json`;
    a.click();
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target?.result as string);
        if (config.wFt !== undefined) setWFt(config.wFt);
        if (config.wIn !== undefined) setWIn(config.wIn);
        if (config.hFt !== undefined) setHFt(config.hFt);
        if (config.hIn !== undefined) setHIn(config.hIn);
        if (config.baseColor) setBaseColor(config.baseColor);
        if (config.markerTextColor) setMarkerTextColor(config.markerTextColor);
        if (config.plottedFlowers) setPlottedFlowers(config.plottedFlowers);
        if (config.cart) setCart(config.cart);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  if (!mounted || !isHydrated) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div ref={sidebarRef}>
        <Card className="rounded-none border border-[var(--border)] bg-[var(--card)] h-fit shadow-2xl">
          <CardHeader className="border-b border-[var(--secondary-border)] py-4">
            <CardTitle className="font-mono text-[12px] flex items-center gap-2 text-white/60 capitalize">
              <Settings className="w-3.5 h-3.5" />
              {t('flower_arrangement_tool')}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 font-mono text-[12px]">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--secondary-border)] select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                  <span className={cn('capitalize transition-colors', (wFtActive || wInActive) ? 'text-[var(--accent)]' : 'text-white/40')}>{t('width')}</span>
                  <span className={cn('font-bold transition-colors tabular-nums', (wFtActive || wInActive) ? 'text-[var(--accent)]' : 'text-white/40')} dir="ltr">
                    {formatDistanceForHeader(totalWidthIn)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                    <span className={cn('transition-colors', wFtActive ? 'text-white' : 'text-white/30')}>{t('ft')}</span>
                    <span className={cn('transition-colors font-bold tabular-nums', wFtActive ? 'text-[var(--accent)]' : 'text-white/30')} dir="ltr">
                      {formatSliderValue(wFt, 'ft')}
                    </span>
                  </div>
                  <CustomSlider id="w-ft" value={wFt} onValueChange={setWFt} onActiveChange={setWFtActive} max={24} min={0} isRTL={isRTL} thumbSize={14} thumbBorderWidth="1px" colorFillActive="var(--accent)" colorThumbDefault="var(--card)" colorThumbHover="var(--card)" colorThumbActive="var(--card)" colorThumbBorderDefault="var(--border)" colorThumbBorderHover="#4B4B4B" colorThumbBorderActive="#FFFFFF" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                    <span className={cn('transition-colors', wInActive ? 'text-white' : 'text-white/30')}>{t('in')}</span>
                    <span className={cn('transition-colors font-bold tabular-nums', wInActive ? 'text-[var(--accent)]' : 'text-white/30')} dir="ltr">
                      {formatSliderValue(wIn, 'in')}
                    </span>
                  </div>
                  <CustomSlider id="w-in" value={wIn} onValueChange={setWIn} onActiveChange={setWInActive} max={11} min={0} isRTL={isRTL} thumbSize={14} thumbBorderWidth="1px" colorFillActive="var(--accent)" colorThumbDefault="var(--card)" colorThumbHover="var(--card)" colorThumbActive="var(--card)" colorThumbBorderDefault="var(--border)" colorThumbBorderHover="#4B4B4B" colorThumbBorderActive="#FFFFFF" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--secondary-border)] select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                  <span className={cn('capitalize transition-colors', (hFtActive || hInActive) ? 'text-[var(--accent)]' : 'text-white/40')}>{t('height')}</span>
                  <span className={cn('font-bold transition-colors tabular-nums', (hFtActive || hInActive) ? 'text-[var(--accent)]' : 'text-white/40')} dir="ltr">
                    {formatDistanceForHeader(totalHeightIn)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                    <span className={cn('transition-colors', hFtActive ? 'text-white' : 'text-white/30')}>{t('ft')}</span>
                    <span className={cn('transition-colors font-bold tabular-nums', hFtActive ? 'text-[var(--accent)]' : 'text-white/30')} dir="ltr">
                      {formatSliderValue(hFt, 'ft')}
                    </span>
                  </div>
                  <CustomSlider id="h-ft" value={hFt} onValueChange={setHFt} onActiveChange={setHFtActive} max={24} min={0} isRTL={isRTL} thumbSize={14} thumbBorderWidth="1px" colorFillActive="var(--accent)" colorThumbDefault="var(--card)" colorThumbHover="var(--card)" colorThumbActive="var(--card)" colorThumbBorderDefault="var(--border)" colorThumbBorderHover="#4B4B4B" colorThumbBorderActive="#FFFFFF" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                    <span className={cn('transition-colors', hInActive ? 'text-white' : 'text-white/30')}>{t('in')}</span>
                    <span className={cn('transition-colors font-bold tabular-nums', hInActive ? 'text-[var(--accent)]' : 'text-white/30')} dir="ltr">
                      {formatSliderValue(hIn, 'in')}
                    </span>
                  </div>
                  <CustomSlider id="h-in" value={hIn} onValueChange={setHIn} onActiveChange={setHInActive} max={11} min={0} isRTL={isRTL} thumbSize={14} thumbBorderWidth="1px" colorFillActive="var(--accent)" colorThumbDefault="var(--card)" colorThumbHover="var(--card)" colorThumbActive="var(--card)" colorThumbBorderDefault="var(--border)" colorThumbBorderHover="#4B4B4B" colorThumbBorderActive="#FFFFFF" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--secondary-border)] space-y-2">
              <div className="flex items-center justify-between mb-1 select-none" dir={isRTL ? 'rtl' : 'ltr'}>
                <span className={cn('flex items-center gap-2 capitalize transition-colors', zoomActive ? 'text-white' : 'text-white/40')}>
                  <ZoomIn className="w-3 h-3" />
                  {t('zoom')}
                </span>
                <span className={cn('font-bold transition-colors', zoomActive ? 'text-[var(--accent)]' : 'text-white/40')} dir="ltr">
                  {(zoom * 100).toFixed(0)}%
                </span>
              </div>
              <CustomSlider id="zoom" value={zoomToSlider(zoom)} onValueChange={(v) => setZoom(sliderToZoom(v))} onActiveChange={setZoomActive} max={100} min={20} isRTL={isRTL} thumbSize={14} thumbBorderWidth="1px" colorFillActive="var(--accent)" colorThumbDefault="var(--card)" colorThumbHover="var(--card)" colorThumbActive="var(--card)" colorThumbBorderDefault="var(--border)" colorThumbBorderHover="#4B4B4B" colorThumbBorderActive="#FFFFFF" />
            </div>

            <div className="pt-4 border-t border-[var(--secondary-border)] space-y-4">
              <div className="space-y-2">
                <span className="text-white/40 block capitalize select-none">{t('base_color')}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn('w-8 h-8 border border-[var(--secondary-border)] bg-black/40 cursor-pointer outline-none transition-none', isRTL ? 'ml-auto' : 'mr-auto')}>
                      <div className="w-full h-full" style={{ backgroundColor: sanitizedBaseColor }} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    side={isRTL ? "left" : "right"} 
                    align="start" 
                    alignOffset={0} 
                    sideOffset={12} 
                    className="p-4 w-auto min-w-[320px] bg-[#0A0A0A] border border-[#3b3b3b] shadow-2xl z-[3000] outline-none rounded-none"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="space-y-6">
                      <ColorPicker 
                        value={baseColor} onValueChange={setBaseColor} isRTL={isRTL} 
                        containerBg="transparent" containerBorderWidth={0} containerPadding="0" 
                        inputBg="#0A0A0A" inputBorderColor="#232323" inputTextColor="#ffffff" 
                        floatingLabelBg="#0A0A0A" floatingLabelTextColor="#666666" floatingLabelActiveTextColor="#39C73B"
                        floatingLabelFocusBorderColor="#FFFFFF"
                        floatingLabelRadius={0} inputRadius={0} hueThumbRadius={0} hueTrackRadius={0}
                        hueThumbSize={14} hueThumbBorderWidth={1} hueTrackHeight={8} saturationRadius={0}
                        hueThumbBgDefault="#FFFFFF" hueThumbBgHover="#FFFFFF" hueThumbBgActive="#FFFFFF"
                        hueThumbBorderDefault="#EEEEEE" hueThumbBorderHover="#EEEEEE" hueThumbBorderActive="#EEEEEE"
                        showContrast={false} enabledModes={["hex", "rgb", "hsl"]} 
                        dropdownMenuBg="#0A0A0A" dropdownMenuBorderColor="#232323" dropdownMenuRadius={0} 
                        dropdownRadius={0} modeDropdownWidth="110px" previewRadius={0}
                        rLabel={!isMobile ? t('color_red') : "R"} gLabel={!isMobile ? t('color_green') : "G"} bLabel={!isMobile ? t('color_blue') : "B"} 
                        hLabel={!isMobile ? t('color_hue') : "H"} sLabel={!isMobile ? t('color_saturation') : "S"} lLabel={!isMobile ? t('color_luminosity') : "L"} 
                        hexLabel={t('HEX')} rgbLabel={t('RGB')} hslLabel={t('HSL')} modeLabel={t('modeLabel')}
                      />
                      <div className="pt-6 border-t border-[#232323] space-y-3 select-none">
                        <span className="text-white/40 block uppercase text-[10px] tracking-wider">{t('indicator_colors')}</span>
                        <div className={cn("flex flex-row gap-1 overflow-x-auto custom-scrollbar pb-2", isRTL ? "justify-start" : "justify-start")}>
                          {convergencePalette.map((c, i) => (
                            <div key={i} className="w-[24px] h-[24px] border border-[#232323] flex-shrink-0" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 w-full">
                {/* Top layer: Label */}
                <span className="text-white/40 block capitalize">{t('marker_color')}</span>

                {/* Bottom layer: Checkboxes stretched to the opposite edges */}
                <div className="w-full flex justify-between items-center">
                  <CustomCheckbox
                    direction={isRTL ? 'rtl' : 'ltr'}
                    groupDirection="row"
                    options={[{ value: 'white', label: t('white') }]}
                    values={[markerTextColor]}
                    onGroupChange={(vals) => vals.length && setMarkerTextColor('white')}
                  />

                  <CustomCheckbox
                    // Explicitly flipped RTL logic strictly for the black option
                    direction={isRTL ? 'ltr' : 'rtl'}
                    groupDirection="row"
                    options={[{ value: 'black', label: t('black') }]}
                    values={[markerTextColor]}
                    onGroupChange={(vals) => vals.length && setMarkerTextColor('black')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--secondary-border)]">
              <div className="grid grid-cols-1 gap-1.5 max-h-[250px] overflow-auto pr-1 custom-scrollbar">
                {sanctuaryUniqueTypes.length === 0 ? (
                  <p className="text-[10px] text-white/20 italic leading-relaxed select-none">{t('no_flowers_msg')}</p>
                ) : (
                  sanctuaryUniqueTypes.map((typeId) => {
                    const flower = flowerData.flowers.find(f => f.id === typeId)!;
                    const plottedCount = plottedCounts[typeId] || 0;
                    const available = (cartCounts[typeId] || 0) - plottedCount;
                    
                    const StartIcon = isRTL ? ArrowRight : ArrowLeft;
                    const EndIcon = isRTL ? ArrowLeft : ArrowRight;

                    return (
                      <div key={typeId} className="flex items-center gap-3 p-2 border border-[var(--secondary-border)] group/item transition-colors hover:bg-white/5">
                        <div className="w-[20px] h-[20px] border border-[var(--secondary-border)] flex-shrink-0" style={{ backgroundColor: typeMap[typeId]?.color }} />
                        <span className="flex-1 capitalize truncate font-mono text-[10px] text-white/80 select-none">
                          {getFlowerName(typeId, lang, flower.flower_name)}
                        </span>
                        <div className="flex items-center gap-1">
                          <RefinedChronicleButton 
                            variant="outline" 
                            disabled={plottedCount <= 0} 
                            onClick={() => removeFlower(typeId)} 
                            padding="0" 
                            width="24px" 
                            buttonHeight="24px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            hoverBackgroundColor="var(--theme-red)" 
                            hoverBorderColor="var(--theme-red)"
                            hoverTextColor="#fff"
                            borderColor="var(--secondary-border)" 
                            className="transition-none"
                            borderRadius={0}
                            iconedButtonMode={true}
                          >
                            <StartIcon className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>
                          
                          <span className="text-[10px] w-6 text-center text-[var(--foreground)] font-bold font-mono select-none">[{available}]</span>
                          
                          <RefinedChronicleButton 
                            variant="outline" 
                            disabled={available <= 0} 
                            onClick={() => addFlower(typeId)} 
                            padding="0" 
                            width="24px" 
                            buttonHeight="24px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            hoverBackgroundColor="var(--accent)" 
                            hoverBorderColor="var(--accent)"
                            hoverTextColor="#000"
                            borderColor="var(--secondary-border)" 
                            className="transition-none"
                            borderRadius={0}
                            iconedButtonMode={true}
                          >
                            <EndIcon className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--secondary-border)] flex flex-col gap-2">
              <input type="file" id="import-config" className="hidden" accept=".json" onChange={importConfig} />
              <RefinedChronicleButton variant="outline" width="100%" onClick={() => document.getElementById('import-config')?.click()} backgroundColor="transparent" textColor="var(--foreground)" borderVisible={true} borderColor="var(--secondary-border)" borderRadius={0} className="capitalize transition-none">
                <Upload className="w-3.5 h-3.5 mr-2" />
                {t('import')}
              </RefinedChronicleButton>
              <RefinedChronicleButton variant="outline" width="100%" onClick={exportConfig} backgroundColor="transparent" textColor="var(--foreground)" borderVisible={true} borderColor="var(--secondary-border)" borderRadius={0} className="capitalize transition-none">
                <Download className="w-3.5 h-3.5 mr-2" />
                {t('export')}
              </RefinedChronicleButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3 relative bg-[var(--card)] border border-[var(--border)] group overflow-hidden" style={{ height: sidebarHeight }} onWheel={handleWheel}>
        <div className={cn('absolute inset-0 overflow-auto custom-scrollbar', (totalWidthIn > 72 || totalHeightIn > 48) ? 'p-32' : 'p-20')} dir="ltr">
          <div
            ref={containerRef}
            className="relative bg-[var(--card)] border border-[var(--secondary-border)] transition-all duration-300 shadow-2xl mx-auto"
            style={{
              width: totalWidthIn * currentScale,
              height: totalHeightIn * currentScale,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: `${12 * zoom}px ${12 * zoom}px`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-0 pointer-events-none translate-y-[-10px]">
              {renderRulerTicks(totalWidthIn, 'horizontal')}
            </div>

            <div className={cn('absolute top-0 bottom-0 w-0 pointer-events-none', isRTL ? 'right-0 translate-x-[12px]' : 'left-0 translate-x-[-12px]')}>
              {renderRulerTicks(totalHeightIn, 'vertical')}
            </div>

            {hoveredFlower && (
              <>
                <div
                  className="absolute border-t border-dashed border-[var(--secondary-border)] pointer-events-none z-10 flex justify-center"
                  style={{
                    top: hoveredFlower.y * currentScale,
                    left: isRTL ? (totalWidthIn - hoveredFlower.x) * currentScale : 0,
                    width: isRTL ? hoveredFlower.x * currentScale : hoveredFlower.x * currentScale,
                  }}
                >
                  <span className="absolute top-full mt-1 font-mono text-[9px] text-white/40 bg-transparent px-1 whitespace-nowrap uppercase select-none" dir="ltr">
                    {formatDistance(hoveredFlower.x)}
                  </span>
                </div>

                <div
                  className="absolute border-l border-dashed border-[var(--secondary-border)] pointer-events-none z-10 flex items-center"
                  style={{
                    left: isRTL ? (totalWidthIn - hoveredFlower.x) * currentScale : hoveredFlower.x * currentScale,
                    top: 0,
                    height: hoveredFlower.y * currentScale,
                  }}
                >
                  <span className="absolute left-full ml-2 font-mono text-[9px] text-white/40 bg-transparent px-1 whitespace-nowrap uppercase select-none" dir="ltr">
                    {formatDistance(hoveredFlower.y)}
                  </span>
                </div>
              </>
            )}

            {plottedFlowers.map((f) => {
              const data = flowerData.flowers.find(fd => fd.id === f.typeId);
              if (!data) return null;
              const info = typeMap[f.typeId];
              if (!info) return null;

              const penalty = calculatePenalty(f);
              const spacingPx = data.recommended_spacing * currentScale;

              return (
                <div
                  key={f.id}
                  className="absolute cursor-move group/item z-20"
                  style={{
                    left: isRTL ? (totalWidthIn - f.x) * currentScale : f.x * currentScale,
                    top: f.y * currentScale,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div
                    className={cn('absolute border-2 border-dashed transition-all duration-300 pointer-events-none', penalty > 0 ? 'border-red-500/60 bg-red-500/5' : 'border-[var(--secondary-border)]')}
                    style={{
                      width: spacingPx,
                      height: spacingPx,
                      transform: 'translate(-50%, -50%)',
                      boxSizing: 'border-box',
                    }}
                  />

                  <div
                    className={cn('absolute border flex items-center justify-center font-mono font-bold shadow-2xl transition-all select-none', penalty > 0 ? 'border-red-500' : 'border-[var(--secondary-border)]')}
                    style={{
                      width: finalMarkerSize,
                      height: finalMarkerSize,
                      fontSize: `${Math.max(8, 16 * zoom - markerFontSizeReduction)}px`,
                      backgroundColor: info.color,
                      color: markerTextColor,
                      transform: 'translate(-50%, -50%)',
                      boxSizing: 'border-box',
                    }}
                    onMouseDown={() => handleDrag(f.id)}
                    onTouchStart={() => handleDrag(f.id)}
                    onMouseEnter={() => setHoveredFlowerId(f.id)}
                    onMouseLeave={() => setHoveredFlowerId(null)}
                  >
                    {info.index}
                  </div>

                  {hoveredFlowerId === f.id && penalty > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white font-mono text-[9px] px-2 py-1 uppercase font-bold z-50 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-black select-none" style={{ top: (spacingPx / 2) + 8 }}>
                      {t('growth_penalty')}: {penalty}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {plottedFlowers.length > 0 && (
          <div className={cn('absolute bottom-4 z-50 p-6 border border-[var(--secondary-border)] bg-[var(--card)]/95 shadow-2xl min-w-[240px] pointer-events-none select-none backdrop-blur-xl', isRTL ? 'left-4' : 'right-4')} dir={isRTL ? 'rtl' : 'ltr'}>
            <h4 className="font-mono text-[11px] mb-4 text-white/40 border-b border-[var(--secondary-border)] pb-2 capitalize">{t('indicator_colors')}</h4>
            <div className="space-y-3 flex flex-col items-start">
              {sanctuaryUniqueTypes.map((typeId) => {
                const flower = flowerData.flowers.find(f => f.id === typeId)!;
                const info = typeMap[typeId];
                if (!info || !plottedFlowers.some(pf => pf.typeId === typeId)) return null;
                return (
                  <div key={typeId} className="flex items-center gap-3 font-mono text-[10px] flex-row">
                    <div className="w-[16px] h-[16px] flex-shrink-0 border border-[var(--secondary-border)]" style={{ backgroundColor: info.color }} />
                    <span className="text-white/60 capitalize">
                      [{info.index}] — {getFlowerName(typeId, lang, flower.flower_name)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
