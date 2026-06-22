"use client";
import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface NavCenterProps {
  isMobile: boolean;
  localizedItems: {
    id: string;
    label: string;
    icon?: React.ReactElement;
    onClick: () => void;
  }[];
  activeIndex: number;
  setNavItemRef: (index: number) => (el: HTMLAnchorElement | null) => void;
  limelightRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  isRTL?: boolean;
}

const NavCenter: React.FC<NavCenterProps> = ({
  isMobile,
  localizedItems,
  activeIndex,
  setNavItemRef,
  limelightRef,
  isReady,
  isRTL = false,
}) => {
  const [showNavCenter, setShowNavCenter] = useState<boolean>(true);

  // Track the previous directional layout state to calculate the relative inversion index delta
  const [prevRTL, setPrevRTL] = useState<boolean>(isRTL);

  const evaluateVisibility = useCallback(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 768;
  }, []);

  useEffect(() => {
    const update = () => setShowNavCenter(evaluateVisibility());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [evaluateVisibility]);

  // Handle flicker-free placement computations 
  useEffect(() => {
    if (!limelightRef.current || localizedItems.length === 0 || !isReady) return;
    const limelight = limelightRef.current;
    const parent = limelight.parentElement;
    if (!parent) return;

    const links = parent.querySelectorAll("a");
    
    // Determine the true active node index dynamically based on the current layout direction state
    let targetIndex = activeIndex;
    if (isRTL !== prevRTL) {
      targetIndex = localizedItems.length - 1 - activeIndex;
      setPrevRTL(isRTL);
    }

    const activeLink = links[targetIndex] as HTMLElement | undefined;

    if (activeLink) {
      // Calculate coordinates dynamically relative to the shared parent anchor container bounds
      const iconCenter = activeLink.offsetLeft + activeLink.offsetWidth / 2;
      const limelightLeft = iconCenter - limelight.offsetWidth / 2;
      limelight.style.left = `${limelightLeft}px`;
    } else {
      limelight.style.left = "-999px";
    }
  }, [activeIndex, limelightRef, localizedItems.length, isReady, showNavCenter, isRTL, prevRTL]);

  if (!showNavCenter && !isMobile) return null;

  return (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none transform -translate-y-1">
      <div className="relative flex items-center h-full pointer-events-auto">
        {localizedItems.map((item, index) => (
          <a
            key={item.id}
            ref={setNavItemRef(index)}
            className={cn(
              "relative z-20 flex h-full scale cursor-pointer items-center justify-center group",
              isMobile ? "p-4" : "p-5"
            )}
            onClick={item.onClick}
            aria-label={item.label}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon &&
                React.cloneElement(item.icon as React.ReactElement, {
                  className: cn(
                    "w-[18px] h-[18px] translate-y-[12px]",
                    "transition-colors duration-300 ease-in-out",
                    activeIndex === index
                      ? "opacity-100 text-[var(--lightened-primary)]"
                      : "opacity-60 text-muted-foreground group-hover:opacity-100 group-hover:text-white"
                  )
                })}
            </div>
          </a>
        ))}

        {/* Limelight Indicator */}
        <div
          ref={limelightRef}
          className="absolute z-10"
          style={{
            top: 0,
            width: 40,
            height: 4,
            borderRadius: "0.5rem",
            backgroundColor: "var(--primary)",
            boxShadow: `0 8px 25px -5px rgba(57, 199, 59, 0.5)`,
            transition: isReady ? "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            left: "-999px",
            transform: "translateY(-11px)",
          }}
        >
          {/* Triangle glow */}
          <div
            style={{
              position: "absolute",
              left: "-30%",
              top: 3,
              width: "160%",
              height: 51,
              clipPath: "polygon(5% 100%, 25% 0, 75% 0, 95% 100%)",
              background: `linear-gradient(to bottom, var(--primary), transparent)`,
              pointerEvents: "none",
              scale: 0.72,
              transform: "translateY(-11px)",
            }}
          />
          {/* Bottom glowing line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "-34px",
              width: "64%",
              height: "1px",
              borderRadius: "12px",
              background: `radial-gradient(ellipse 120% 200% at 50% 50%, var(--primary), transparent 80%)`,
              boxShadow: `0 0 10px 5px var(--primary), inset 0 0 20px 8px var(--primary)`,
              filter: "blur(3px)",
              zIndex: -1,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(NavCenter);