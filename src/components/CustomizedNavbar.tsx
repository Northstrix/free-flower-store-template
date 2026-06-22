"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import NavCenter from "./Limelight";
import { useApp } from "@/components/AppProvider";
import { Layout, Box, Layers, PenTool, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomDialog } from "./CustomDialog";
import flowerData from "@/lib/flower-data.json";
import { LanguageIcon } from "@/components/LanguageIcon";
import { motion } from "framer-motion";
import { getLegacyBackdropStyle } from "@/components/LegacyBackdrop";
import { CartDropdown } from "./CartDropdown";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  targetId: string;
}

interface NavbarProps {
  navItems: NavItem[];
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
  onLanguageClick?: (lang: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isRTL?: boolean;
  isMobile: boolean;
}

export default function Navbar({
  navItems: originalNavItems,
  cart,
  setCart,
  onLanguageClick,
  scrollContainerRef,
  isRTL = false,
  isMobile,
}: NavbarProps) {
  const { t } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<"cart" | "lang" | null>(null);
  const [supportsBackdropFilter, setSupportsBackdropFilter] = useState(true);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);
  const disableScrollHighlightRef = useRef(false);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lastRTLRef = useRef(isRTL);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const supportsFilter =
        window.CSS?.supports?.("backdrop-filter", "blur(1px)") ||
        window.CSS?.supports?.("-webkit-backdrop-filter", "blur(1px)");
      setSupportsBackdropFilter(!!supportsFilter);
    }
  }, []);

  useEffect(() => {
    if (lastRTLRef.current !== isRTL) {
      setActiveIndex((prevIndex) => originalNavItems.length - 1 - prevIndex);
      lastRTLRef.current = isRTL;
    }
  }, [isRTL, originalNavItems.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      setIsScrolled(container.scrollTop >= 24);
      if (disableScrollHighlightRef.current) return;

      const containerRect = container.getBoundingClientRect();
      let bestMatchIndex = 0;
      let closestTopDistance = Number.POSITIVE_INFINITY;

      originalNavItems.forEach((item, index) => {
        const target = document.getElementById(item.targetId);
        if (!target) return;
        const targetRect = target.getBoundingClientRect();
        const distanceFromContainerTop = targetRect.top - containerRect.top;

        if (distanceFromContainerTop <= 20) {
          const absDist = Math.abs(distanceFromContainerTop);
          if (absDist < closestTopDistance) {
            closestTopDistance = absDist;
            bestMatchIndex = index;
          }
        }
      });

      const functionalIndex = isRTL
        ? originalNavItems.length - 1 - bestMatchIndex
        : bestMatchIndex;

      if (functionalIndex !== -1) {
        setActiveIndex(functionalIndex);
      }
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef, originalNavItems, isRTL]);

  const handleItemClick = useCallback(
    (index: number) => {
      const trueIndex = isRTL ? originalNavItems.length - 1 - index : index;
      const item = originalNavItems[trueIndex];
      if (!item || !scrollContainerRef.current) return;

      const target = document.getElementById(item.targetId);
      if (target) {
        disableScrollHighlightRef.current = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (scrollEndTimeoutRef.current) clearTimeout(scrollEndTimeoutRef.current);
        scrollEndTimeoutRef.current = setTimeout(() => {
          disableScrollHighlightRef.current = false;
        }, 1000);
      }
      setActiveIndex(index);
    },
    [originalNavItems, scrollContainerRef, isRTL]
  );

  const handleBrandClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      handleItemClick(0);
    },
    [handleItemClick]
  );

  const localizedItems = useMemo(() => {
    const iconsMap: Record<string, React.ReactElement> = {
      home: <Layout key="h" />,
      products: <Box key="p" />,
      testimonials: <Layers key="s" />,
      planner: <PenTool key="l" />,
    };

    let baseItems = originalNavItems.map((item) => ({
      ...item,
      label: t(`nav_${item.id.toLowerCase()}`),
      icon: iconsMap[item.id.toLowerCase()] || <Layout key={item.id} />,
    }));

    if (isRTL) {
      baseItems = [...baseItems].reverse();
    }

    return baseItems.map((item, index) => ({
      ...item,
      onClick: () => handleItemClick(index),
    }));
  }, [originalNavItems, t, handleItemClick, isRTL]);

  const handleLangToggle = () => {
    if (onLanguageClick) {
      const nextLang = isRTL ? "en" : "he";
      onLanguageClick(nextLang);
    }
  };

  const legacyBackdropStyle = useMemo(() => {
    return getLegacyBackdropStyle({
      supportsBackdropFilter,
      bodyOpacity: 0.36,
      borderOpacity: 0.09,
      blurStrength: 9,
      isScrolled,
    });
  }, [supportsBackdropFilter, isScrolled]);

  if (!mounted) return null;

  return (
    <>
      <div
        id="nav-wrapper"
        className={cn(
          "w-full flex justify-center sticky top-0 z-[90]",
          isScrolled ? "pt-[10px]" : "pt-1"
        )}
      >
        <nav
          className={cn(
            "w-full max-w-4xl mx-3 relative overflow-hidden transition-transform duration-500",
            "rounded-full transition-[padding] duration-200 ease-out"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-full z-0 pointer-events-none transition-all duration-300 ease-in-out",
              isScrolled ? "shadow-[0_0_30px_rgba(0,0,0,0.25)]" : "shadow-none"
            )}
            style={legacyBackdropStyle}
          />
          <div
            className={cn(
              "relative z-20 flex items-center justify-between",
              isScrolled ? "px-4 py-3" : "py-2 px-[2px]"
            )}
            style={{
              transition: "padding 0.2s ease",
            }}
          >
            <a
              href="/"
              onClick={handleBrandClick}
              className="flex items-center gap-2 font-bold tracking-tighter text-lg group select-none outline-none"
            >
              <div
                className="relative w-[22px] h-[22px] overflow-hidden flex items-center justify-center bg-[#000000]"
                style={{
                  border: "1px solid var(--secondary-border)",
                  borderRadius: isScrolled ? "50%" : "0px",
                  transition: "border-radius 0.3s ease-in-out",
                }}
              >
                <img src="/logo.webp" alt="logo" />
              </div>
              <span
                className={cn(
                  "hidden min-[320px]:block transition-colors duration-300 ease-in-out",
                  "text-[var(--foreground)] group-hover:text-[var(--primary)]"
                )}
              >
                {t("app_name")}
              </span>
            </a>

            <div className="flex-1 relative h-full">
              <div className="transform -translate-y-2 h-full">
                <NavCenter
                  isMobile={isMobile}
                  localizedItems={localizedItems}
                  activeIndex={activeIndex}
                  setNavItemRef={(index) => (el) => {
                    navItemRefs.current[index] = el;
                  }}
                  limelightRef={limelightRef as any}
                  isReady={mounted}
                  isRTL={isRTL}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* CART BUTTON */}
              <motion.button
                type="button"
                onClick={() => setIsCartOpen(true)}
                onHoverStart={() => setHoveredAction("cart")}
                onHoverEnd={() => setHoveredAction((v) => (v === "cart" ? null : v))}
                className="group relative isolate flex items-center justify-center h-9 w-9 rounded-full outline-none border transition-colors duration-300 bg-transparent border-transparent text-muted-foreground"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300 z-0 opacity-0 scale-75",
                    hoveredAction === "cart" && "opacity-100 scale-100"
                  )}
                  style={{
                    background: `var(--primary)`,
                    boxShadow: `0 0 6px 2px var(--primary), inset 0 0 10px 4px var(--primary)`,
                    filter: "blur(1.5px)",
                  }}
                />
                <ShoppingCart
                  className={cn(
                    "relative z-10 w-4 h-4 opacity-70 transition-all duration-300",
                    hoveredAction === "cart" && "text-[var(--background)] opacity-100 scale-105"
                  )}
                />
                  {cart.length > 0 && (
                    <span 
                      className="absolute -top-[3px] -right-[3px] z-30 font-mono font-black w-[14px] h-[14px] rounded-full flex items-center justify-center pointer-events-none leading-none"
                      style={{
                        color: 'var(--background)',
                        fontSize: cart.length > 9 ? '6.75px' : '8px',
                      }}
                    >
                      {/* Blurred background layer */}
                      <span 
                        className="absolute inset-0 rounded-full -z-10 border border-[var(--foreground)]"
                        style={{
                          background: `var(--foreground)`,
                          boxShadow: `0 0 2px var(--foreground)`,
                          filter: "blur(0.75px)"
                        }}
                      />
                      {/* Crisp text content */}
                      {cart.length}
                    </span>
                  )}
              </motion.button>

              {/* LANGUAGE BUTTON */}
              <motion.button
                type="button"
                onClick={handleLangToggle}
                onHoverStart={() => setHoveredAction("lang")}
                onHoverEnd={() => setHoveredAction((v) => (v === "lang" ? null : v))}
                className="group relative isolate flex items-center justify-center h-9 w-9 rounded-full outline-none border transition-colors duration-300 bg-transparent border-transparent text-muted-foreground"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300 z-0 opacity-0 scale-75",
                    hoveredAction === "lang" && "opacity-100 scale-100"
                  )}
                  style={{
                    background: `var(--primary)`,
                    boxShadow: `0 0 6px 2px var(--primary), inset 0 0 10px 4px var(--primary)`,
                    filter: "blur(1.5px)",
                  }}
                />
                <LanguageIcon
                  size={19}
                  duration={1}
                  className={cn(
                    "relative z-10 opacity-70 transition-all duration-300",
                    hoveredAction === "lang" && "text-[var(--background)] opacity-100 scale-105"
                  )}
                />
              </motion.button>
            </div>
          </div>
        </nav>
      </div>

      <CustomDialog open={isCartOpen} onOpenChange={setIsCartOpen} title={t("cart")}>
        <CartDropdown 
          products={flowerData.flowers} 
          cart={cart} 
          setCart={setCart} 
        />
      </CustomDialog>
    </>
  );
}