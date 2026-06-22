"use client";
import React from "react";
import FlowerBedArrangementTool from "@/components/FlowerBedArrangementTool";
import { useApp } from "@/components/AppProvider";
import SectionHeader from "@/components/SectionHeader";

interface ArrangementSectionProps {
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function ArrangementSection({ cart, setCart, scrollContainerRef, }: ArrangementSectionProps) {
  const { t, isRTL } = useApp();

  return (
    <section id="planner" style={{ backgroundColor: "var(--background)" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1440px] mx-auto">
        
        {/* Extracted Header Module passing parent-level translation fallbacks */}
        <SectionHeader
          id="ar_h"
          title={t("arranger_title") || 'Arranger'}
          description={t("arranger_description") || 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'}
          scrollContainerRef={scrollContainerRef}
        />
        
        {/* Embedded Interactive Layout Canvas */}
        <div className="px-[10px] md:px-[22px] py-12">
          <FlowerBedArrangementTool cart={cart} setCart={setCart} />
        </div>
      </div>
    </section>
  );
}