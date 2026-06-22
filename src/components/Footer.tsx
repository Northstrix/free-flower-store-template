"use client";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useApp } from '@/components/AppProvider';
import NamerUiBadge from './NamerUiBadge';
import { cn } from '@/lib/utils';
import { InstrumentSVG } from './appLogo';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ColorPicker from './ColorPicker';
import HighlightHover from '@/components/HighlightHover';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionNames {
  home?: string;
  products?: string;
  planner?: string;
  [key: string]: string | undefined;
}

interface FooterProps {
  onNavClick: (id: string) => void;
  onCreditClick: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  sectionNames?: SectionNames;
}

export function Footer({ onNavClick, onCreditClick, scrollContainerRef, sectionNames = {} }: FooterProps) {
  const { t, lang, isRTL } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize with plain CSS fallbacks so it safely handles initial Server-Side rendering
  const [flowerColor, setFlowerColor] = useState('var(--logo-default-flower, #ffffff)');
  const [instrumentColor, setInstrumentColor] = useState('var(--logo-default-instrument, #ffffff)');
  const [stamenColor, setStamenColor] = useState('var(--logo-default-stamen, #ffffff)');

  const isMobileLayout = windowWidth < 900;

  // Resolves the raw CSS custom variables to actual values so the ColorPicker can parse them instantly without reverting to #000
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const computedStyles = window.getComputedStyle(document.documentElement);
    const getResolvedVariable = (variableName: string, fallbackColor: string) => {
      const parsedValue = computedStyles.getPropertyValue(variableName).trim();
      return parsedValue || fallbackColor;
    };

    setFlowerColor(getResolvedVariable('--logo-default-flower', '#ff8484'));
    setInstrumentColor(getResolvedVariable('--logo-default-instrument', '#ffffff'));
    setStamenColor(getResolvedVariable('--logo-default-stamen', '#ffd000'));
  }, []);

  useEffect(() => {
    function updateResponsiveMetrics() {
      setWindowWidth(window.innerWidth);
      if (!containerRef.current) return;
      setIsVisible(containerRef.current.clientWidth >= 280);
    }
    updateResponsiveMetrics();
    window.addEventListener("resize", updateResponsiveMetrics);
    return () => window.removeEventListener("resize", updateResponsiveMetrics);
  }, []);

  const svgContainerStyle = useMemo(() => {
    if (!isMobileLayout) {
      return { width: '192px', height: '128px', marginBottom: '6px' };
    }
    const clamped = Math.min(Math.max(windowWidth, 320), 880);
    const interpolationFactor = (clamped - 320) / (880 - 320);
    const width = 212 + interpolationFactor * (496 - 212);
    const height = 74 + interpolationFactor * (128 - 74);
    const marginBottom = 36 + interpolationFactor * (104 - 36);

    return {
      width: `${width.toFixed(1)}px`,
      height: `${height.toFixed(1)}px`,
      marginBottom: `${marginBottom.toFixed(1)}px`
    };
  }, [windowWidth, isMobileLayout]);

const renderMadeByCredits = () => {
    let entry = "Made by [Maxim Bortnikov](https://maxim-bortnikov.netlify.app/)";

    if (lang === "he") {
      entry = "נוצר על ידי [מקסים בורטניקוב](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "it") {
      entry = "Creato da [Maxim Bortnikov](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "es") {
      entry = "Hecho por [Máxim Bórtnikov](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "ja") {
      entry = "[マキシム・ボルトニコフ](https://maxim-bortnikov.netlify.app/)が作成";
    } else if (lang === "pt") {
      entry = "Feito por [Máxim Bortníkov](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "pl") {
      entry = "Twórca strony: [Maksym Bortnikow](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "ar") {
      entry = "صُنع بواسطة [ماكسيم بورتنيكوف](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "fr") {
      entry = "Créé par [Maxim Bortnikov](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "cz") {
      entry = "Web vytvořil: [Maxim Bortnikov](https://maxim-bortnikov.netlify.app/)";
    } else if (lang === "de") {
      entry = "Erstellt von [Maxim Bortnikow](https://maxim-bortnikov.netlify.app/)";
    }
    
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(entry)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = entry.slice(lastIndex, match.index);
        const isInitialStart = lastIndex === 0;

        const textPaddingClass = isMobileLayout
          ? "mx-1"
          : isInitialStart
            ? (isRTL ? "ml-1" : "mr-1") 
            : "mx-1";

        parts.push(
          <HighlightHover
            key={key++}
            isRTL={isRTL}
            barThickness={0}
            className={textPaddingClass}
            disabled={true}
            style={{ color: "var(--muted-foreground)" }}
          >
            {textSegment}
          </HighlightHover>
        );
      }
      let label = match[1];
      parts.push(
        <HighlightHover
          key={key++}
          as="a"
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          isRTL={isRTL}
          className="cursor-pointer font-medium underline transition-all duration-300 ease-in-out text-[var(--foreground)] decoration-[var(--foreground)] hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
          style={{ textDecoration: "underline", whiteSpace: "nowrap" }}
        >
          {label}
        </HighlightHover>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < entry.length) {
      const isInitialStart = lastIndex === 0;
      const textPaddingClass = isMobileLayout
        ? "mx-1"
        : isInitialStart
          ? (isRTL ? "ml-1" : "mr-1")
          : "mx-1";

      parts.push(
        <HighlightHover
          key={key++}
          isRTL={isRTL}
          barThickness={0}
          className={textPaddingClass}
          disabled={true}
          style={{ color: "var(--muted-foreground)" }}
        >
          {entry.slice(lastIndex)}
        </HighlightHover>
      );
    }

    return (
      <div className={cn("text-[11px] font-mono mt-6 flex flex-wrap items-center gap-y-1", isMobileLayout ? "justify-center" : "justify-start")}>
        {parts}
      </div>
    );
  };

  const columnAlignment = isMobileLayout ? "items-center text-center" : "items-start";
  const headerAlignment = isMobileLayout ? "text-center" : (isRTL ? "text-right" : "text-left");
  const linkBaseStyle = "group transition-all duration-300 ease-in-out cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-1.5";

  const renderColorControl = (label: string, value: string, setter: (v: string) => void) => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between w-full gap-8 group/row cursor-pointer outline-none" dir={isRTL ? "rtl" : "ltr"}>
          <span className="text-[10px] font-mono tracking-wider transition-colors opacity-40 group-hover/row:opacity-60" style={{ color: 'var(--foreground)' }}>{label}</span>
          <button className="w-4 h-4 shadow-inner outline-none transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: value, borderColor: 'var(--secondary-border)', borderWidth: '1px', borderRadius: 'var(--radius)' }} />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        side={isMobileLayout ? "bottom" : (isRTL ? "left" : "right")} 
        align={isMobileLayout ? "center" : "start"} 
        className="p-4 shadow-2xl w-auto min-w-[320px] z-[3000]" 
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderWidth: '1px', borderRadius: 'var(--radius)' }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <ColorPicker 
          value={value} 
          onValueChange={setter} 
          isRTL={isRTL} 
          containerBg="transparent" 
          containerBorderWidth={0} 
          containerPadding="0" 
          inputBg="var(--card)" 
          inputBorderColor="var(--secondary-border)" 
          inputTextColor="var(--foreground)" 
          floatingLabelBg="var(--card)" 
          floatingLabelTextColor="var(--muted-foreground)" 
          floatingLabelActiveTextColor="var(--accent)" 
          floatingLabelFocusBorderColor="var(--foreground)" 
          floatingLabelRadius={0} 
          inputRadius={0} 
          hueThumbRadius={0} 
          hueTrackRadius={0} 
          hueThumbSize={14} 
          hueThumbBorderWidth={1} 
          hueTrackHeight={8} 
          saturationRadius={0} 
          hueThumbBgDefault="var(--foreground)" 
          hueThumbBgHover="var(--foreground)" 
          hueThumbBgActive="var(--foreground)" 
          hueThumbBorderDefault="var(--border)" 
          hueThumbBorderHover="var(--border)" 
          hueThumbBorderActive="var(--border)" 
          showContrast={false} 
          enabledModes={["hex", "rgb", "hsl"]} 
          dropdownMenuBg="var(--card)" 
          dropdownMenuBorderColor="var(--secondary-border)" 
          dropdownMenuRadius={0} 
          dropdownRadius={0} 
          modeDropdownWidth="110px" 
          previewRadius={0} 
                        rLabel={!isMobile ? t('color_red') : "R"} gLabel={!isMobile ? t('color_green') : "G"} bLabel={!isMobile ? t('color_blue') : "B"} 
                        hLabel={!isMobile ? t('color_hue') : "H"} sLabel={!isMobile ? t('color_saturation') : "S"} lLabel={!isMobile ? t('color_luminosity') : "L"} 
                        hexLabel={t('HEX')} rgbLabel={t('RGB')} hslLabel={t('HSL')} modeLabel={t('modeLabel')}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <footer className="pt-24 pb-12 overflow-hidden w-full" style={{ backgroundColor: '#000', color: 'var(--foreground)', borderTop: '1px solid var(--secondary-border)' }}>
      <div className="max-w-[1440px] mx-auto px-[10px] md:px-[22px]">
        <div className={cn("grid gap-12 mb-12", isMobileLayout ? "grid-cols-1" : "md:grid-cols-4")} dir={isRTL ? "rtl" : "ltr"}>
          
          {/* Column 1: Logo, Color Pickers & Desktop-only Credits */}
          <div className={cn("flex flex-col", isMobileLayout ? "items-center mt-6" : "items-start")}>
            <div style={svgContainerStyle} className="transition-all duration-75 ease-out flex items-center justify-center">
              <InstrumentSVG flowerFill={flowerColor} instrumentFill={instrumentColor} stamenFill={stamenColor} />
            </div>
            <div className="flex flex-col gap-3 w-full max-w-[180px]">
              {renderColorControl(t('flower_color_label'), flowerColor, setFlowerColor)}
              {renderColorControl(t('instrument_color_label'), instrumentColor, setInstrumentColor)}
              {renderColorControl(t('stamen_color_label'), stamenColor, setStamenColor)}
            </div>
            {!isMobileLayout && renderMadeByCredits()}
          </div>

          {/* Column 2: Navigation Link Tree Elements */}
          <div className={cn("flex flex-col gap-4", columnAlignment)}>
            <span className={cn("text-[10px] opacity-40 font-mono", headerAlignment)}>{t('nav_header')}</span>
            <ul className="space-y-2 list-none p-0 flex flex-col font-mono text-[11px]">
              {['home', 'products', 'planner'].map(id => (
                <li key={id}>
                  <button onClick={() => onNavClick(id)} className={linkBaseStyle}>
                    <span className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>
                      {sectionNames[id] || t(`nav_${id}`)}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button onClick={onCreditClick} className={linkBaseStyle}>
                  <span className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>{t('credit_inscription')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Social Ecosystem Destinations */}
          <div className={cn("flex flex-col gap-4", columnAlignment)}>
            <span className={cn("text-[10px] opacity-40 font-mono", headerAlignment)}>{t('links_header')}</span>
            <ul className="space-y-2 list-none p-0 flex flex-col font-mono text-[11px]">
              {[
                { href: "https://x.com/maxim_bortnikov", label: "X" },
                { href: "https://github.com/Northstrix/free-flower-store-template", label: "GitHub" },
                { href: "https://sourceforge.net/projects/free-flower-store-template/", label: "SourceForge" }
              ].map(social => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkBaseStyle}>
                    <span className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--foreground)' }}>{social.label}</span>
                    <span className={cn("opacity-40 transition-transform duration-300", isRTL && "scale-x-[-1]")}>↳</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contextual Core Support Meta Data & Mobile Credits */}
          <div className={cn("flex flex-col gap-4", columnAlignment)}>
            <span className={cn("text-[10px] opacity-40 font-mono", headerAlignment)}>{t('nav_about')}</span>
            <div className={cn("space-y-6 flex flex-col font-mono text-[11px]", columnAlignment)} style={{ color: 'var(--muted-foreground)' }}>
              <div className={cn("leading-relaxed", isMobileLayout ? "text-center" : (isRTL ? "text-right" : "text-left"))}>
                <span className="block">{t('phone')}: <span dir="ltr">+1 234 567 8901</span></span>
                <span className="block">{t('email')}: fl-str-support@fakemail</span>
                <span className="block mt-2">{t('address_label')}:</span>
                <span className="block">{t('address_line1')}</span>
                <span className="block">{t('address_line2')}</span>
                <span className="block">{t('address_line3')}</span>
              </div>
              <div className="w-fit">
                <NamerUiBadge isRTL={isRTL} namerUIName={lang === "he" ? "נמר UI" : "Namer UI"} iconSrc="/Namer.png" poweredByText={t('powered_by')} />
              </div>
            </div>
            {isMobileLayout && renderMadeByCredits()}
          </div>

        </div>

        {isVisible && (
          <div className="w-full flex justify-center mb-16 px-4">
            <div ref={containerRef} dir={isRTL ? "rtl" : "ltr"} className="overflow-hidden flex justify-center w-full" />
          </div>
        )}
      </div>
    </footer>
  );
}