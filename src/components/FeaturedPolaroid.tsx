"use client";
import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import RefinedChronicleButton from '@/components/ui/RefinedChronicleButton';
import { useApp } from "@/components/AppProvider"; 
import { cn } from '@/lib/utils';
import { getFlowerName } from "@/lib/flower-name-translations";

interface FeaturedPolaroidProps {
  product: any;
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
  toFtIn: (inches: number) => string;
  isDesktop?: boolean;
}

export const FeaturedPolaroid: React.FC<FeaturedPolaroidProps> = ({
  product,
  cart,
  setCart,
  toFtIn,
  isDesktop = false,
}) => {
  const { t, isRTL, lang } = useApp();
  
  const quantity = cart.filter(id => id === product.id).length;

  const [isTallScreen, setIsTallScreen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsTallScreen(window.innerHeight >= 912);
      setIsWideScreen(window.innerWidth >= 912);
      setIsSmallMobile(window.innerWidth < 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateQuantity = (delta: number) => {
    if (delta > 0) {
      setCart(prev => [...prev, product.id]);
    } else {
      setCart(prev => {
        const idx = prev.lastIndexOf(product.id);
        if (idx === -1) return prev;
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      });
    }
  };

  const tiltClass = isDesktop ? (isRTL ? "-rotate-2" : "rotate-2") : "rotate-0";
  const localizedFontWeight = isRTL ? 600 : 900;
  const titlePriceFontSize = isSmallMobile ? "24px" : "27px";

  return (
    <div className="relative group perspective-1000 w-full max-w-[420px]" dir={isRTL ? "rtl" : "ltr"}>
      <div 
        className={cn(
          "bg-[var(--card)] p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] border border-[var(--secondary-border)] transition-transform duration-[2400ms] ease-in-out will-change-transform",
          tiltClass,
          isDesktop && "group-hover:rotate-0"
        )}
      >
        <div className="aspect-square overflow-hidden border border-[var(--secondary-border)] relative">
          <img 
            src={product.image} 
            alt={getFlowerName(product.id, lang, product.flower_name)} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.07] transform-gpu backface-hidden"
          />
          
          {/* Fixed text alignment by forcing flex centering, removing line height, and balancing padding */}
          <div 
            className={cn(
              "absolute top-4 z-20 font-mono text-[9px] font-bold h-[22px] px-2 py-1.5 uppercase flex items-center justify-center leading-none",
              isRTL ? "right-4" : "left-4"
            )}
            style={{ 
              backgroundColor: "var(--accent)", 
              color: "var(--background)",
              borderRadius: "var(--radius, 0px)"
            }}
          >
            {t('featured_product') || 'Featured Product'}
          </div>
        </div>

        <div className={cn("text-white space-y-6", isTallScreen ? "mt-8" : "mt-7")}>
          
          <div className="flex justify-between items-end border-b border-[var(--secondary-border)] group-hover:border-transparent transition-colors duration-300 pb-4 gap-4">
            
            <div className={cn("flex flex-col justify-end flex-1 min-w-0 self-stretch", isRTL ? "text-right" : "text-left")}>
              <h3 
                className="hero-title uppercase leading-none truncate break-words max-w-full"
                style={{ fontWeight: localizedFontWeight, fontSize: titlePriceFontSize }}
              >
                {getFlowerName(product.id, lang, product.flower_name)}
              </h3>
            </div>
            
            <div className={cn("shrink-0 flex flex-col justify-end", isRTL ? "text-left" : "text-right")}>
              <span className="font-mono text-[10px] text-white/40 block leading-none mb-1">{t('price')}</span>
              <span className="hero-title leading-none text-[var(--primary)]" style={{ fontWeight: localizedFontWeight, fontSize: titlePriceFontSize }}>
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div 
            className={cn(
              "grid grid-cols-2 gap-y-6 gap-x-4 font-mono",
              isWideScreen ? "text-[11px]" : "text-[10px]"
            )}
          >
            <div className={cn("space-y-1", isRTL ? "text-right" : "text-left")}>
              <span className="text-white/40 block">{t('mature_height')}</span>
              <span className="text-white font-bold block">{toFtIn(product.min_height)} – {toFtIn(product.max_height)}</span>
            </div>
            <div className={cn("space-y-1", isRTL ? "text-left" : "text-right")}>
              <span className="text-white/40 block">{t('bloom_intensity')}</span>
              <span className="text-white font-bold block">
                {isRTL ? product.bloom_intensity : `${product.bloom_intensity}/10`}
              </span>
            </div>
            <div className={cn("space-y-1", isRTL ? "text-right" : "text-left")}>
              <span className="text-white/40 block">{t('water_need')}</span>
              <span className="text-white font-bold block">{product.water_need} {t('water_unit')}</span>
            </div>
            <div className={cn("space-y-1", isRTL ? "text-left" : "text-right")}>
              <span className="text-white/40 block">{t('spacing')}</span>
              <span className="text-white font-bold block">{toFtIn(product.recommended_spacing)}</span>
            </div>
          </div>

          <div className={cn("items-center justify-between gap-4 flex", isTallScreen ? "pt-6" : "pt-4")}>
            <div className="flex-1 flex items-center justify-between border border-[var(--secondary-border)] p-2 bg-black/40" style={{ borderRadius: "var(--radius)" }}>
               <span className="font-mono text-[10px] font-bold mx-2 text-white/60">{t('quantity')}</span>
               <div className="flex items-center gap-3">
                  <RefinedChronicleButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateQuantity(-1)} 
                    disabled={quantity === 0}
                    padding="0" 
                    width="32px" 
                    buttonHeight="32px" 
                    backgroundColor="transparent" 
                    textColor="#fff" 
                    borderColor="var(--border)"
                    borderRadius={parseInt("var(--radius)") || 0}
                    className="transition-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </RefinedChronicleButton>
                  <span className="font-mono text-[14px] font-bold w-6 text-center text-[var(--foreground)]">{quantity}</span>
                  <RefinedChronicleButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateQuantity(1)} 
                    padding="0" 
                    width="32px" 
                    buttonHeight="32px" 
                    backgroundColor="transparent" 
                    textColor="#fff" 
                    borderColor="var(--border)"
                    borderRadius={parseInt("var(--radius)") || 0}
                    className="transition-all duration-200 hover:!bg-[var(--primary)] hover:!border-[var(--primary)] hover:!text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </RefinedChronicleButton>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};