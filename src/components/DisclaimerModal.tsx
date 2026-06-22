"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCheckbox from "@/components/CustomCheckbox";
import ChronicleButton from "@/components/ui/RefinedChronicleButton";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const DISCLAIMER_POINTS = [
  "This website is a fictional demonstration project created for design and development purposes only.",
  "All flower/species names, descriptions, prices, as well as contact details, and address are fictitious and should not be treated as real or relied upon for any purpose.",
  "The Flower Store name, product listings, imagery, layouts, and sample text are presented as part of a conceptual storefront and do not represent an actual commercial offer.",
  "Any resemblance to real businesses, products, locations, people, or events is purely coincidental and unintentional.",
  "This site is not affiliated with, sponsored by, endorsed by, or otherwise connected to any third party whose name, mark, or likeness may appear in the design.",
  "All trademarks, brand names, logos, and other intellectual property remain the property of their respective owners.",
  "The information on this site is provided for presentation purposes only and carries no warranty, guarantee, or legal effect.",
];

export default function DisclaimerModal({
  isOpen,
  onClose,
  onAccept,
}: DisclaimerModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  const supportsBackdropFilter = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.CSS?.supports?.("backdrop-filter", "blur(24px)") ||
      window.CSS?.supports?.("-webkit-backdrop-filter", "blur(24px)")
    );
  }, []);

  const backdropStyle: React.CSSProperties = {
    background: supportsBackdropFilter ? "rgba(0, 0, 0, 0.65)" : "rgba(0, 0, 0, 0.8)",
    backdropFilter: supportsBackdropFilter ? "blur(24px)" : "none",
    WebkitBackdropFilter: supportsBackdropFilter ? "blur(24px)" : "none",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          dir="ltr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[5000] flex items-center justify-center px-4"
          style={backdropStyle}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="disclaimer-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 100 }}
            transition={{ duration: 0.35, ease: "easeInOut", delay: 0.1 }}
            style={{
              width: "min(640px, 90vw)",
              maxWidth: 640,
              borderRadius: "var(--radius)",
              backgroundColor: "#0a0a0a",
              border: "1px solid #1e1e1e",
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <section
              className="px-6 py-6 text-[var(--foreground)] text-sm"
              style={{
                lineHeight: 1.7,
                overflowY: "auto",
                borderRadius: "var(--radius)",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--accent) var(--scrolbar-track-color)",
              }}
            >
              <h2
                id="disclaimer-modal-title"
                className="text-[24px] font-semibold mb-5 text-center select-none font-headline uppercase tracking-tighter"
                style={{ userSelect: "none" }}
              >
                Disclaimer
              </h2>

              <ul className="mb-6 space-y-3 list-disc pl-5">
                {DISCLAIMER_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="flex items-center space-x-3 mb-6 select-none cursor-pointer">
                <CustomCheckbox
                  accentColor="var(--accent)"
                  borderWidth={1.5}
                  labelFontSize={15}
                  labelSpacing={10}
                  checked={isChecked}
                  onChange={setIsChecked}
                  label="I acknowledge that I have read and understood this disclaimer."
                  direction="ltr"
                />
              </div>

              <ChronicleButton
                onClick={onAccept}
                disabled={!isChecked}
                className="w-full"
                variant="default"
                backgroundColor="var(--foreground)"
                hoverBackgroundColor="var(--accent)"
                textColor="var(--background)"
                hoverTextColor="var(--foreground)"
                borderVisible={false}
                borderRadius="var(--button-border-radius)"
                buttonHeight="2.75rem"
                width="100%"
                type="button"
              >
                Continue
              </ChronicleButton>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}