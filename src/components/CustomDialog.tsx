"use client";

import React, { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ModalOverlay } from "@/components/modal-overlay";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  descriptionLine2?: string;
  children?: React.ReactNode;
  maxWidth?: string;
  densePadding?: boolean;
  showCloseButton?: boolean; // New argument prop allowing you to hide the close button entirely
}

const ANIMATION_DURATION = 0.3;

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onOpenChange,
  title = "Details",
  description = "",
  descriptionLine2 = "",
  children,
  maxWidth = "520px",
  densePadding = false,
  showCloseButton = true,
}) => {
  const handleCancel = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <ModalOverlay onClose={handleCancel}>
          {/* Wrapper div ensures that any click outside the dialog content triggers handleCancel */}
          <div 
            className="fixed inset-0 m-2.5 flex items-center justify-center" 
            onClick={handleCancel}
          >
            <motion.div
              key="custom-dialog"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: ANIMATION_DURATION, ease: "easeInOut" }}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative w-full border shadow-xl outline-none",
                "flex flex-col items-center gap-3",
                "text-center",
                densePadding ? "p-4" : "p-4 sm:p-6"
              )}
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                maxWidth: maxWidth,
              }}
            >
              {/* Renders conditionally and uses logical positioning 'end-3' to auto-align based on app direction */}
              {showCloseButton && (
                <button
                  onClick={handleCancel}
                  className="absolute top-3 end-3 text-white/40 hover:text-white transition-colors p-2"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <h2 className="w-full pt-1 text-center text-[15px] font-mono tracking-widest font-bold text-white/40">
                {title}
              </h2>

              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-col gap-[4px] text-center">
                  {description && (
                    <p className="text-[14px] leading-relaxed opacity-60">
                      {description}
                    </p>
                  )}
                  {descriptionLine2 && (
                    <p className="text-[14px] leading-relaxed opacity-60">
                      {descriptionLine2}
                    </p>
                  )}
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};