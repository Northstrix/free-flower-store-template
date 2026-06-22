"use client";

import React from "react";
import { CustomDialog } from "@/components/CustomDialog";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/AppProvider";
import { getFlowerName } from "@/lib/flower-name-translations";

interface FlowerInfoModalProps {
  infoModal: any;
  setInfoModal: (val: any) => void;
  toFtIn: (inches: number) => string;
}

export default function FlowerInfoModal({ infoModal, setInfoModal, toFtIn }: FlowerInfoModalProps) {
  const { t, isRTL, lang } = useApp();

  const localizedTitle = infoModal 
    ? getFlowerName(infoModal.id, lang, infoModal.flower_name) 
    : "";

  return (
    <CustomDialog open={!!infoModal} onOpenChange={() => setInfoModal(null)} title={localizedTitle}>
      {infoModal && (
        <div className="grid grid-cols-2 gap-6 py-4 font-mono text-[11px] capitalize tracking-wider">
          {/* MATURE HEIGHT */}
          <div className={cn("space-y-1", isRTL ? "text-right" : "text-left")}>
            <span className="opacity-40 block">{t("mature_height")}</span>
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {toFtIn(infoModal.min_height)} – {toFtIn(infoModal.max_height)}
            </span>
          </div>

          {/* BLOOM INTENSITY */}
          <div className={cn("space-y-1", isRTL ? "text-left" : "text-right")}>
            <span className="opacity-40 block">{t("bloom_intensity")}</span>
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {isRTL ? infoModal.bloom_intensity : `${infoModal.bloom_intensity}/10`}
            </span>
          </div>

          {/* WATER NEED */}
          <div className={cn("space-y-1", isRTL ? "text-right" : "text-left")}>
            <span className="opacity-40 block">{t("water_need")}</span>
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {infoModal.water_need} {t("water_unit")}
            </span>
          </div>

          {/* SPACING */}
          <div className={cn("space-y-1", isRTL ? "text-left" : "text-right")}>
            <span className="opacity-40 block">{t("spacing")}</span>
            <span className="font-bold" style={{ color: "var(--primary)" }}>
              {toFtIn(infoModal.recommended_spacing)}
            </span>
          </div>

          {/* PRICE SEPARATOR */}
          <div
            className="space-y-1 col-span-2 pt-6 border-t flex justify-between items-end"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="opacity-70 block text-[13px] capitalize leading-none">{t("price")}</span>
            <span className="font-bold text-[28px] leading-none tracking-tighter">
              ${infoModal.price.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </CustomDialog>
  );
}