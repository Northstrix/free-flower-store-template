"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle, Move, Ruler, ZoomIn, Square, Check } from 'lucide-react';
import flowerData from '@/lib/flower-data.json';
import { cn } from '@/lib/utils';
import { getColorHarmonies } from '@/lib/color-utils';
import FloatingLabelInput from './FloatingLabelInput';
import { CustomSlider } from './CustomSlider';

interface PlottedFlower {
  id: string;
  typeId: string;
  x: number;
  y: number;
}

export default function VividPlotter({ cart }: { cart: string[] }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [bedWidth, setBedWidth] = useState(60); 
  const [bedHeight, setBedHeight] = useState(36); 
  const [plottedFlowers, setPlottedFlowers] = useState<PlottedFlower[]>([]);
  const [baseColor, setBaseColor] = useState('#B4E637'); 
  const [zoom, setZoom] = useState(1);
  const [markerTextColor, setMarkerTextColor] = useState<'white' | 'black'>('black');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const convergencePalette = useMemo(() => getColorHarmonies(baseColor).convergence, [baseColor]);

  const flowersInCart = useMemo(() => {
    const uniqueIds = Array.from(new Set(cart));
    return uniqueIds.map(id => flowerData.flowers.find(f => f.id === id)).filter(Boolean);
  }, [cart]);

  const specimenColors = useMemo(() => {
    const mapping: Record<string, string> = {};
    flowerData.flowers.forEach((f, idx) => {
      mapping[f.id] = convergencePalette[idx % convergencePalette.length];
    });
    return mapping;
  }, [convergencePalette]);

  const addFlower = (typeId: string) => {
    const newFlower: PlottedFlower = {
      id: Math.random().toString(36).substr(2, 9),
      typeId,
      x: bedWidth / 2,
      y: bedHeight / 2,
    };
    setPlottedFlowers(prev => [...prev, newFlower]);
  };

  const calculatePenalty = (flower: PlottedFlower) => {
    const data = flowerData.flowers.find(f => f.id === flower.typeId);
    if (!data) return 0;

    let minDistance = Infinity;
    plottedFlowers.forEach(other => {
      if (other.id === flower.id) return;
      const dist = Math.sqrt(Math.pow(flower.x - other.x, 2) + Math.pow(flower.y - other.y, 2));
      if (dist < minDistance) minDistance = dist;
    });

    if (minDistance === Infinity) return 0;
    const recommended = data.recommended_spacing;
    if (minDistance >= recommended) return 0;
    
    const deficit = recommended - minDistance;
    const profile = [...data.grow_insufficiency_profile].sort((a, b) => b.deficit - a.deficit);
    const match = profile.find(p => deficit >= p.deficit);
    return match ? match.penalty : 0;
  };

  const handleDrag = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const moveHandler = (moveEvent: any) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const relativeX = (clientX - rect.left) / (rect.width);
      const relativeY = (clientY - rect.top) / (rect.height);

      setPlottedFlowers(prev => prev.map(f => 
        f.id === id ? { 
          ...f, 
          x: Math.max(0, Math.min(bedWidth, relativeX * bedWidth)), 
          y: Math.max(0, Math.min(bedHeight, relativeY * bedHeight)) 
        } : f
      ));
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

  const baseScale = 8;
  const currentScale = baseScale * zoom;

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Card className="lg:col-span-1 rounded-none border border-[#3b3b3b] bg-[#0A0A0A] shadow-2xl">
        <CardHeader className="border-b border-[#3b3b3b] py-4">
          <CardTitle className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 text-white/60">
            <Move className="w-3 h-3" />
            Vivid Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-6">
             <div className="space-y-2">
              <FloatingLabelInput 
                label="Base Harmony (HEX)" 
                value={baseColor} 
                onValueChange={setBaseColor}
                accentColor={baseColor}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[9px] uppercase text-white/40">
                <span className="flex items-center gap-1.5"><ZoomIn className="w-2.5 h-2.5" /> {t('zoom_level')}</span>
                <span className="text-white font-bold">{(zoom * 100).toFixed(0)}%</span>
              </div>
              <CustomSlider id="zoom" value={zoom * 10} onValueChange={(v) => setZoom(v / 10)} max={20} min={5} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[9px] uppercase text-white/40">
                <span className="flex items-center gap-1.5"><Square className="w-2.5 h-2.5" /> {t('marker_color')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn("rounded-none border-[#232323] text-[9px] uppercase font-mono", markerTextColor === 'white' && "bg-white text-black")}
                  onClick={() => setMarkerTextColor('white')}
                >
                  {t('white')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn("rounded-none border-[#232323] text-[9px] uppercase font-mono", markerTextColor === 'black' && "bg-white text-black")}
                  onClick={() => setMarkerTextColor('black')}
                >
                  {t('black')}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[9px] uppercase text-white/40">
                <span className="flex items-center gap-1.5"><Ruler className="w-2.5 h-2.5" /> Bed Width</span>
                <span className="text-white font-bold">{bedWidth}"</span>
              </div>
              <CustomSlider id="bed-width" value={bedWidth} onValueChange={setBedWidth} max={240} min={12} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-[9px] uppercase text-white/40">
                <span className="flex items-center gap-1.5"><Ruler className="w-2.5 h-2.5" /> Bed Height</span>
                <span className="text-white font-bold">{bedHeight}"</span>
              </div>
              <CustomSlider id="bed-height" value={bedHeight} onValueChange={setBedHeight} max={240} min={12} />
            </div>
          </div>
          
          <div className="pt-6 border-t border-[#3b3b3b]">
            <h4 className="font-mono text-[9px] uppercase mb-4 text-white/40">{t('add_to_plot')}</h4>
            <div className="grid grid-cols-1 gap-1.5">
              {flowersInCart.map((flower: any) => (
                <Button 
                  key={flower.id} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-none border-[#232323] bg-black/40 font-mono text-[9px] uppercase justify-start h-9 px-3 hover:bg-white hover:text-black transition-colors"
                  onClick={() => addFlower(flower.id)}
                >
                  <div className="w-2.5 h-2.5 mr-3 border border-white/10" style={{ backgroundColor: specimenColors[flower.id] }} />
                  {flower.flower_name}
                </Button>
              ))}
              {flowersInCart.length === 0 && (
                <p className="font-mono text-[9px] uppercase italic text-white/20">{t('cart_empty')}</p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#3b3b3b]">
            <h4 className="font-mono text-[9px] uppercase mb-4 text-white/40">Plot Legend</h4>
            <div className="space-y-2 max-h-[250px] overflow-auto pr-2 custom-scrollbar divide-y divide-[#232323]">
              {plottedFlowers.map((f, i) => {
                const data = flowerData.flowers.find(fd => fd.id === f.typeId)!;
                return (
                  <div key={f.id} className="flex items-center justify-between font-mono text-[9px] uppercase text-white/60 py-2 first:pt-0">
                    <span className="flex items-center gap-2">
                      <strong className="text-white">[{i + 1}]</strong> {data.flower_name}
                    </span>
                    <span style={{ color: specimenColors[data.id] }}>■</span>
                  </div>
                );
              })}
              {plottedFlowers.length === 0 && <p className="text-[9px] text-white/20 uppercase">No specimens plotted</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        <div className="relative overflow-auto p-12 bg-[#050505] border border-[#3b3b3b] flex items-center justify-center min-h-[650px] shadow-inner custom-scrollbar">
          <div 
            ref={containerRef}
            className="relative bg-[#0A0A0A] border border-[#232323] transition-all duration-300"
            style={{ 
              width: bedWidth * currentScale, 
              height: bedHeight * currentScale,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`
            }}
          >
            {plottedFlowers.map((f, index) => {
              const data = flowerData.flowers.find(fd => fd.id === f.typeId)!;
              const penalty = calculatePenalty(f);
              const spacingSize = data.recommended_spacing * currentScale;
              const color = specimenColors[data.id];

              return (
                <div 
                  key={f.id}
                  className="absolute cursor-move group z-20"
                  style={{ 
                    left: f.x * currentScale, 
                    top: f.y * currentScale,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseDown={(e) => handleDrag(f.id, e)}
                  onTouchStart={(e) => handleDrag(f.id, e)}
                >
                  {/* Spacing Zone - Secondary Outline Square */}
                  <div 
                    className={cn(
                      "absolute inset-0 border-2 border-dashed transition-all duration-300 pointer-events-none",
                      penalty > 0 ? "border-red-500/60 bg-red-500/5" : "border-[#232323]"
                    )}
                    style={{ 
                      width: spacingSize, 
                      height: spacingSize,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  
                  {/* Numerical Marker - Filled Square */}
                  <div className={cn(
                    "relative w-7 h-7 border transition-all flex items-center justify-center font-mono text-[9px] font-bold shadow-lg",
                    penalty > 0 ? "border-red-500" : "border-white/10"
                  )} style={{ 
                    backgroundColor: color,
                    color: markerTextColor,
                  }}>
                    {index + 1}
                    {penalty > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 animate-pulse border border-black">
                        <AlertCircle className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Context Info Overlay */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <Card className="rounded-none border border-[#3b3b3b] bg-[#0A0A0A] w-40 shadow-2xl">
                      <CardContent className="p-3">
                        <p className="font-mono text-[9px] font-bold uppercase mb-1 text-white">{data.flower_name}</p>
                        <div className="flex justify-between items-center font-mono text-[8px] uppercase">
                           <span className="text-white/40">{t('growth_penalty')}</span>
                           <span className={cn(penalty > 0 ? "text-red-500 font-bold" : "text-white/60")}>{penalty}%</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 absolute -top-2 -right-2 bg-red-500 text-white rounded-none hover:bg-black pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlottedFlowers(prev => prev.filter(pf => pf.id !== f.id));
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}