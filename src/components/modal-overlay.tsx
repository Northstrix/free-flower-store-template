"use client";

import { motion } from "framer-motion";
import React, { useEffect, useCallback, useMemo } from "react";

interface BackdropOptions {
  supportsBackdropFilter: boolean;
  bodyOpacity: number;
  borderOpacity: number;
  blurStrength: number;
  isScrolled?: boolean;
}

export function getLegacyBackdropStyle({
  supportsBackdropFilter,
  bodyOpacity,
  borderOpacity,
  blurStrength,
  isScrolled = false,
}: BackdropOptions): React.CSSProperties {
  const invisibleOpacity = 0;

  return {
    background: supportsBackdropFilter
      ? `rgba(0, 0, 0, ${isScrolled ? bodyOpacity : invisibleOpacity})`
      : `rgba(0, 0, 0, ${isScrolled ? bodyOpacity + 0.2 : invisibleOpacity})`,
    backdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    WebkitBackdropFilter: supportsBackdropFilter
      ? `blur(${isScrolled ? blurStrength : 0}px)`
      : undefined,
    border: `1px solid rgba(255, 255, 255, ${
      isScrolled ? borderOpacity : invisibleOpacity
    })`,
    boxShadow: isScrolled ? "0 2px 16px 0 rgba(0, 0, 0, 0.08)" : "none",
    transition:
      "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease",
  };
}

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  bodyOpacity?: number;
  borderOpacity?: number;
  blurStrength?: number;
}

export function ModalOverlay({ 
   children, 
   onClose, 
   bodyOpacity = 0.64,
  borderOpacity = 0.28,
  blurStrength = 9,
}: ModalOverlayProps) {
  const supportsBackdropFilter = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.CSS?.supports?.("backdrop-filter", `blur(${blurStrength}px)`) ||
           window.CSS?.supports?.("-webkit-backdrop-filter", `blur(${blurStrength}px)`);
  }, [blurStrength]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    // Only trigger close if clicking directly on the overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const backdropStyle = useMemo(() => {
    const baseStyle = getLegacyBackdropStyle({
      supportsBackdropFilter,
      bodyOpacity,
      borderOpacity,
      blurStrength,
      isScrolled: true,
    });

    return {
      ...baseStyle,
      background: supportsBackdropFilter
        ? `rgba(0, 0, 0, ${bodyOpacity * 0.5})`
        : `rgba(0, 0, 0, ${bodyOpacity * 0.3})`,
      border: `1px solid rgba(128, 128, 128, ${borderOpacity})`,
      boxShadow: "0 1px 10px 0 rgba(0, 0, 0, 0.05)",
    };
  }, [supportsBackdropFilter, bodyOpacity, borderOpacity, blurStrength]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={backdropStyle}
      onClick={handleOverlayClick}
    >
      <div 
        className="w-full max-h-[90vh] overflow-auto relative z-10 flex justify-center pointer-events-none"
      >
        <div className="pointer-events-auto w-full flex justify-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
