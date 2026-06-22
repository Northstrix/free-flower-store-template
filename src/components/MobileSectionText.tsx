"use client";

import React from "react";

interface MobileSectionTextProps {
  ref: React.RefObject<HTMLDivElement | null>;
  isRTL: boolean;
  config: {
    fontWeight: number;
    trackingGap: string;
    marginInlineStart: string;
  };
  descFontSize: string;
  titleFontSize: string;
  descMarginTop: string;
  uniqueId: string;
  parsedTitleLines: Array<{ key: number; chars: string[] }>;
  parsedDescLines: Array<{ key: number; text: string }>;
  lineContainerStyle: React.CSSProperties;
  getFillMaskStyle: () => React.CSSProperties;
}

export default function MobileSectionText({
  ref,
  isRTL,
  config,
  descFontSize,
  titleFontSize,
  descMarginTop,
  uniqueId,
  parsedTitleLines,
  parsedDescLines,
  lineContainerStyle,
  getFillMaskStyle,
}: MobileSectionTextProps) {
  // ==========================================
  // LAYOUT B: MOBILE RENDERING (Width < 1024px)
  // ==========================================
  return (
    <div
      ref={ref}
      className="flex flex-col w-full overflow-hidden relative items-center text-center px-[10px] py-16 select-none"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <h2
        className="font-headline tracking-tight mt-4 mb-2.5 leading-tight w-full flex flex-col items-center"
        style={{ fontSize: descFontSize, fontWeight: config.fontWeight, lineHeight: 1.2 }}
      >
        {parsedTitleLines.map(({ key, chars }) => (
          <span 
            key={key} 
            className={`${uniqueId}-title-line-wrapper block relative`}
            style={lineContainerStyle}
          >
            <span className="base-layer flex relative z-10" style={{ color: "var(--reveal-mask, #262626)", gap: config.trackingGap }}>
              {chars.map((ch, i) => (
                <span key={i} className="inline-block whitespace-pre leading-none">
                  {ch === ' ' ? '\u00a0' : ch}
                </span>
              ))}
            </span>
            <span 
              className="reveal-layer flex absolute inset-0 z-20 pointer-events-none user-select-none" 
              aria-hidden="true"
              style={{ ...getFillMaskStyle(), height: "130%", gap: config.trackingGap }}
            >
              {chars.map((ch, i) => (
                <span 
                  key={i} 
                  className="inline-block whitespace-pre leading-none"
                  style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--foreground)" }}
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h2>
      
      <div
        className="w-full relative mt-1.5 text-[var(--muted-foreground)]"
        style={{ fontSize: titleFontSize, lineHeight: 1.4, marginTop: descMarginTop, fontWeight: config.fontWeight }}
      >
        {parsedDescLines.map(({ key, text }) => (
          <p key={key} className="block m-0 p-0">{text}</p>
        ))}
      </div>
    </div>
  );
}