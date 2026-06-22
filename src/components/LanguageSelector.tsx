'use client';

import React, { useEffect, useState, useCallback } from "react";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import "@ncdai/react-wheel-picker/style.css";
import RefinedChronicleButton from "@/components/ui/RefinedChronicleButton";
import { CustomDialog } from "./CustomDialog";
import { useApp } from "@/components/AppProvider";

export interface LanguageSelectorHandle {
  open: () => void;
  close: () => void;
}

interface LanguageSelectorProps {
  onClose?: () => void;
  customWidth?: string; // Optional custom argument parameter to dynamically adjust component width bounds
}

const LANGUAGES = [
  { code: "en", label: "English", applyText: "Apply" },
  { code: "he", label: "עברית", applyText: "החל" },
  { code: "it", label: "Italiano", applyText: "Applica" },
  { code: "es", label: "Español", applyText: "Aplicar" },
  { code: "ja", label: "日本語", applyText: "適用" },
  { code: "pt", label: "Português", applyText: "Aplicar" },
  { code: "pl", label: "Polski", applyText: "Zastosuj" },
  { code: "ar", label: "العربية", applyText: "تطبيق" },
  { code: "fr", label: "Français", applyText: "Appliquer" },
  { code: "cz", label: "Čeština", applyText: "Použít" },
  { code: "de", label: "Deutsch", applyText: "Anwenden" },
];
function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        // Inactive items: muted opacity, no forced transformations, standard scale down
        optionItem: "text-[var(--muted-foreground)] font-mono text-[12px] tracking-wide transition-all duration-200 scale-90",
        // Selected highlight line area: filled with your specific accent token variable
        highlightWrapper: "bg-[var(--accent)]",
        // Active selected item: Text color flipped to background to pop against the accent background
        highlightItem: "text-[var(--background)] font-mono text-[16px] tracking-wide font-medium transition-all duration-200 scale-100",
        ...classNames,
      }}
      {...props}
    />
  );
}

export const LanguageSelector = React.forwardRef<
  LanguageSelectorHandle,
  LanguageSelectorProps
>(function LanguageSelector({ onClose, customWidth = "320px" }, ref) {
  const { lang, setLang, isRTL } = useApp();
  const [open, setOpen] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState<string>(lang);

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  useEffect(() => {
    setTempSelectedValue(lang);
  }, [lang]);

  const handleValueChange = useCallback((value: any) => {
    if (value && typeof value === 'object' && 'value' in value) {
      setTempSelectedValue(String(value.value));
    } else {
      setTempSelectedValue(String(value));
    }
  }, []);

  const handleApply = async () => {
    if (tempSelectedValue !== lang) {
      await new Promise((resolve) => setTimeout(resolve, 30));
      setLang(tempSelectedValue);
    }
    setOpen(false);
    onClose?.();
  };

  const applyButtonText =
    LANGUAGES.find((l) => l.code === tempSelectedValue)?.applyText || "Apply";

  const options = LANGUAGES.map((l) => ({
    label: l.label,
    value: l.code,
  }));

  return (
    <CustomDialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onClose?.();
      }} 
      title="[ Language ]"
      showCloseButton={false}
      maxWidth={customWidth} // Passes the dynamic customWidth value directly to the dialog shell wrapper
    >
      {/* Kept your exact padding style settings, only restricting the max width parameters dynamically */}
      <div 
        className="w-full py-2 flex flex-col items-center"
        style={{
          maxWidth: customWidth,
          width: "100%"
        }}
      >
        <div
          className="w-full mb-6 overflow-hidden flex justify-center bg-transparent border border-[var(--secondary-border)]"
          style={{
            borderRadius: '0px', // Strict square architectural styling profile
          }}
        >
          <WheelPicker
            options={options}
            value={tempSelectedValue}
            onValueChange={handleValueChange}
          />
        </div>

        <RefinedChronicleButton
          isRTL={isRTL}
          onClick={handleApply}
          className="w-full"
          variant="default"
          backgroundColor="var(--foreground)"
          hoverBackgroundColor="var(--primary)"
          textColor="var(--background)"
          hoverTextColor="var(--background)"
          borderVisible={false}
          width="100%"
        >
          {applyButtonText}
        </RefinedChronicleButton>
      </div>
    </CustomDialog>
  );
});

LanguageSelector.displayName = "LanguageSelector";