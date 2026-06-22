"use client";

import React from "react";
import { Plus, Info } from "lucide-react";
import RefinedChronicleButton from "@/components/ui/RefinedChronicleButton";
import { useApp } from "@/components/AppProvider";
import SectionHeader from "@/components/SectionHeader";
import { getFlowerName } from "@/lib/flower-name-translations";

interface SpecimenIndexProps {
  flowerData: { flowers: any[] };
  cartCounts: Record<string, number>;
  addToCart: (flower: any) => void;
  setInfoModal: (flower: any) => void;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

export default function SpecimenIndex({
  flowerData,
  cartCounts,
  addToCart,
  setInfoModal,
  scrollContainerRef,
}: SpecimenIndexProps) {
  const { t, isRTL, lang } = useApp();

  return (
    <section id="products" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-[1440px] mx-auto">
        
        <SectionHeader
          id="spec_h"
          title={t('specimen_title') || 'Specimen'}
          description={t('specimen_description') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus dapibus turpis sit amet mauris laoreet pulvinar.'}
          scrollContainerRef={scrollContainerRef}
        />

        <div className="px-[10px] md:px-[22px]">
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t ${isRTL ? 'border-r' : 'border-l'}`}
            style={{ borderColor: "var(--border)" }}
          >
            {flowerData.flowers.map((flower: any) => (
              <div 
                key={flower.id} 
                className={`w-full aspect-square relative group overflow-hidden border-b ${isRTL ? 'border-l' : 'border-r'} specimen-card`}
                style={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)" 
                }}
              >
                <img 
                  src={flower.image} 
                  alt={getFlowerName(flower.id, lang, flower.flower_name)} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.07] transform-gpu backface-hidden" 
                />
                
                {cartCounts[flower.id] > 0 && (
                  <div 
                    className={`absolute top-4 z-20 font-mono text-[9px] font-bold px-2 uppercase h-[22px] flex items-center justify-center leading-none ${isRTL ? 'right-4' : 'left-4'}`}
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "var(--background)",
                      borderRadius: "var(--radius, 0px)"
                    }}
                  >
                    {(t('in_cart_badge') || 'In Cart [{{count}}]').replace('{{count}}', String(cartCounts[flower.id]))}
                  </div>
                )}
                
                <div 
                  className="specimen-card-content absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end gap-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10"
                  style={{ 
                    backgroundImage: "var(--eased-gradient)",
                    height: "var(--eased-shadow-height, 50%)"
                  }}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col gap-1 text-start w-full">
                      <h3 
                        className="hero-title text-2xl uppercase leading-none" 
                        style={{ 
                          color: "var(--foreground)", 
                          fontWeight: isRTL ? "600" : "700" 
                        }}
                      >
                        {getFlowerName(flower.id, lang, flower.flower_name)}
                      </h3>
                      <div className="font-mono text-[10px] uppercase block" style={{ color: "var(--muted-foreground)" }}>
                        <span>{t('price') || 'Price'}: </span>
                        {/* Strict LTR wrapper to guarantee currency symbol sits cleanly before the text digits */}
                        <span dir="ltr" className="inline-block">
                          ${flower.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <RefinedChronicleButton 
                      className="flex-1" 
                      onClick={() => addToCart(flower)} 
                      backgroundColor="var(--foreground)" 
                      textColor="var(--background)" 
                      hoverBackgroundColor="var(--accent)" 
                      borderRadius={parseInt("var(--radius)") || 0} 
                      size="sm"
                    >
                      <Plus className={`w-3 h-3 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('add_to_cart') || 'Add to Cart'}
                    </RefinedChronicleButton>
                    <RefinedChronicleButton 
                      size="sm" 
                      onClick={() => setInfoModal(flower)} 
                      backgroundColor="transparent" 
                      textColor="var(--foreground)" 
                      borderVisible={true} 
                      borderColor="var(--border)" 
                      borderRadius={parseInt("var(--radius)") || 0} 
                      width="2.5rem" 
                      padding="0"
                    >
                      <Info className="w-4 h-4" />
                    </RefinedChronicleButton>
                  </div>
                </div>

              </div>
            ))}
          </div>
          <div style={{ marginBottom: "18px" }} />
        </div>
      </div>
    </section>
  );
}