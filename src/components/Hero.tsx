"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import RefinedChronicleButton from "@/components/ui/RefinedChronicleButton";
import { FeaturedPolaroid } from "@/components/FeaturedPolaroid";
import { AnimatedHeroTitle } from "@/components/AnimatedHeroTitle";

export default function Hero({
  t,
  isRTL,
  scrollTo,
  cart,
  setCart,
  toFtIn,
  featuredProduct,
  isLargeDesktop,
}: {
  t: any;
  isRTL: boolean;
  scrollTo: (id: string) => void;
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
  toFtIn: (inches: number) => string;
  featuredProduct: any;
  isLargeDesktop: boolean;
}) {
  const contentLeftAligned = isLargeDesktop && !isRTL;
  const contentRightAligned = isLargeDesktop && isRTL;
  const ActionArrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      className={cn(
        "flex items-center",
        isLargeDesktop ? "min-h-[calc(100vh-60px)]" : "min-h-[calc(100vh-102px)]"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-[1440px] mx-auto px-[10px] md:px-[22px] w-full">
        {!isLargeDesktop && <div className="h-[30px]" />}

        <div
          className={cn(
            "grid grid-cols-1 w-full items-center",
            isLargeDesktop ? "grid-cols-2 gap-24" : "gap-14 justify-items-center"
          )}
        >
          <div
            className={cn(
              "flex flex-col w-full",
              isLargeDesktop ? "gap-12" : "gap-8 items-center"
            )}
          >
            <div
              className={cn(
                "flex flex-col w-full",
                isLargeDesktop ? "gap-12 items-stretch" : "gap-8 items-center"
              )}
            >
              <AnimatedHeroTitle isLargeDesktop={isLargeDesktop} />

              <div
                className={cn(
                  "w-full",
                  isLargeDesktop ? "space-y-12" : "space-y-8 text-center max-w-md mx-auto"
                )}
              >
                <p
                  className={cn(
                    "text-lg leading-tight font-medium text-white/80",
                    isLargeDesktop ? "max-w-md" : "mx-auto max-w-md"
                  )}
                  style={{ textAlign: isLargeDesktop ? (isRTL ? 'right' : 'left') : 'center' }}
                >
                  <span
                    className={cn(
                      "text-[11px] font-mono text-white/40 block mb-3.5 tracking-widest",
                      isLargeDesktop
                        ? contentLeftAligned
                          ? "text-left"
                          : "text-right"
                        : "text-center"
                    )}
                  >
                    {t("etymology")}
                  </span>
                  {t("flower_definition")}
                </p>

                <div
                  className={cn(
                    "flex flex-wrap gap-4 pt-4 w-full",
                    isLargeDesktop
                      ? contentLeftAligned
                        ? "justify-start"
                        : "justify-start"
                      : "justify-center"
                  )}
                >
                  <RefinedChronicleButton
                    variant="default"
                    onClick={() => scrollTo("products")}
                    backgroundColor="#fff"
                    textColor="var(--background)"
                    hoverBackgroundColor="var(--accent)"
                    borderRadius={0}
                    size="lg"
                    iconTextGap="0.75rem" 
                    isRTL={isRTL} 
                  >
                    <span>{t("explore_btn")}</span>
                    <ActionArrow className="w-4 h-4" />
                  </RefinedChronicleButton>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex w-full",
              isLargeDesktop
                ? "justify-end"
                : "justify-center"
            )}
          >
            <FeaturedPolaroid
              product={featuredProduct}
              cart={cart}
              setCart={setCart}
              t={t}
              toFtIn={toFtIn}
              isDesktop={isLargeDesktop}
            />
          </div>
        </div>
      </div>
    </section>
  );
}