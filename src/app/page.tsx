"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import flowerData from "@/lib/flower-data.json";
import Navbar from "@/components/CustomizedNavbar";
import { Footer } from "@/components/Footer";
import CreditModal from "@/components/CreditModal";
import SpecimenIndex from "@/components/SpecimenIndex";
import ArrangementSection from "@/components/ArrangementSection";
import { useApp } from "@/components/AppProvider";
import Hero from "@/components/Hero";
import { LanguageSelector, LanguageSelectorHandle } from "@/components/LanguageSelector";
import FlowerInfoModal from "@/components/FlowerInfoModal";
import { SatelliteToast } from "@/components/SatelliteToast";
// Import the DisclaimerModal component
import DisclaimerModal from "@/components/DisclaimerModal";

export default function FlowerStoreApp() {
  const { isHydrated } = useApp();
  
  if (!isHydrated) {
    return (
      <div 
        className="min-h-screen" 
        style={{ backgroundColor: "var(--background)" }} 
      />
    );
  }
  
  return <HomePage />;
}

function HomePage() {
  const { t, isRTL } = useApp();
  const [cart, setCart] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [infoModal, setInfoModal] = useState<any>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  
  // State to manage the visibility of the disclaimer modal on launch
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);
  
  const satelliteToastRef = useRef<{ showNotification: (options: any) => void } | null>(null);
  const languageSelectorRef = useRef<LanguageSelectorHandle>(null);

  useEffect(() => {
    const checkSize = () => {
      setIsLargeDesktop(window.innerWidth >= 1280 && window.innerHeight >= 800);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const navItems = useMemo(() => {
    const items = [
      { id: "home", label: t("nav_home"), targetId: "home-anchor" },
      { id: "products", label: t("specimen_title"), targetId: "products" },
      { id: "planner", label: t("arranger_title"), targetId: "planner" },
    ];
    
    if (isRTL) return [...items].reverse();
    return items;
  }, [t, isRTL]);

  const sectionNames = useMemo(() => {
    return navItems.reduce((acc, item) => {
      acc[item.id] = item.label;
      return acc;
    }, {} as Record<string, string>);
  }, [navItems]);

  const cartCounts = useMemo(() => {
    return cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [cart]);

  const addToCart = () => {
    if (satelliteToastRef.current) {
      satelliteToastRef.current.showNotification({
        title: t("toast_success_title") || "Success!",
        content: t("toast_success_content") || "Item has been added to cart.",
        isRTL: isRTL,
      });
    }
  };

  const toFtIn = (inches: number) => {
    const ft = Math.floor(inches / 12);
    const in_ = Math.round(inches % 12);
    let result = "";
    if (ft > 0) result += `${ft}' `;
    if (in_ > 0 || (ft > 0 && in_ === 0)) result += `${in_}"`;
    if (ft === 0 && in_ === 0) result = '0"';
    return result.trim();
  };

  const scrollTo = (id: string) => {
    const target = id === "home" ? document.getElementById("home-anchor") : document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const featuredProduct = flowerData.flowers.find(f => f.id === "hydrangea");

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col selection:bg-[var(--primary)]" 
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)"
      }}
    >
      <div 
        ref={scrollContainerRef} 
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative custom-scrollbar"
      >
        <div className="w-full">
          <div className="mx-auto w-full max-w-[1440px]">
            <div id="home-anchor" className="w-full h-px invisible -mt-px" />
            <Navbar 
              navItems={navItems} 
              cart={cart} 
              setCart={setCart} 
              isRTL={isRTL} 
              isMobile={false} 
              scrollContainerRef={scrollContainerRef} 
              onLanguageClick={() => languageSelectorRef.current?.open()}
            />
            <main className="w-full">
              <Hero 
                t={t} 
                isRTL={isRTL} 
                scrollTo={scrollTo} 
                cart={cart} 
                setCart={setCart} 
                toFtIn={toFtIn} 
                featuredProduct={featuredProduct} 
                isLargeDesktop={isLargeDesktop} 
              />
              
              <SpecimenIndex 
                flowerData={flowerData}
                cartCounts={cartCounts}
                addToCart={(flower) => {
                  setCart(prev => [...prev, flower.id]);
                  addToCart();
                }}
                setInfoModal={setInfoModal}
                scrollContainerRef={scrollContainerRef}
              />

              <ArrangementSection 
                cart={cart} 
                setCart={setCart} 
                scrollContainerRef={scrollContainerRef}
              />
            </main>
          </div>
          
          <Footer 
            onNavClick={scrollTo} 
            onCreditClick={() => setIsCreditModalOpen(true)} 
            scrollContainerRef={scrollContainerRef} 
            sectionNames={sectionNames}
          />
        </div>
        
        {/* Modals & Global Overlays */}
        <SatelliteToast ref={satelliteToastRef} maxWidth="360px" />
        <CreditModal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} />
        <FlowerInfoModal infoModal={infoModal} setInfoModal={setInfoModal} toFtIn={toFtIn} />
        <LanguageSelector ref={languageSelectorRef} />
        
        {/* Disclaimer Modal setup to display on launch */}
        <DisclaimerModal 
          isOpen={isDisclaimerOpen} 
          onClose={() => setIsDisclaimerOpen(false)} 
          onAccept={() => setIsDisclaimerOpen(false)} 
        />
      </div>
    </div>
  );
}