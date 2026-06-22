"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import RefinedChronicleButton from '@/components/ui/RefinedChronicleButton';
import { useApp } from "@/components/AppProvider"; 
import { cn } from '@/lib/utils';
import { getFlowerName } from "@/lib/flower-name-translations";

const SALES_TAX_RATE = 0.061; // 6.1%

interface Product {
  id: string;
  flower_name: string;
  price: number;
  image: string;
  [key: string]: any;
}

interface CartDropdownProps {
  products: Product[];
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
  products,
  cart,
  setCart,
}) => {
  const { t, isRTL, lang } = useApp();
  const [isCartMobile, setIsCartMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Determine the breakpoint based on the current language
    let breakpoint = 540;
    if (lang === 'en') {
      breakpoint = 420;
    } else if (lang === 'he') {
      breakpoint = 412;
    }

    const handleResize = () => {
      setIsCartMobile(window.innerWidth < breakpoint);
    };

    // Run initial assessment
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [lang]); // Re-run if the user toggles languages dynamically

  const cartQuantities = useMemo(() => {
    return cart.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [cart]);

  const cartItems = useMemo(() => {
    return products.filter(product => cartQuantities[product.id] > 0);
  }, [products, cartQuantities]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, product) => {
      return sum + (product.price * (cartQuantities[product.id] || 0));
    }, 0);
  }, [cartItems, cartQuantities]);
  
  const taxAmount = subtotal * SALES_TAX_RATE;
  const totalWithTax = subtotal + taxAmount;

  const updateQuantity = (productId: string, delta: number) => {
    if (delta > 0) {
      setCart(prev => [...prev, productId]);
    } else {
      setCart(prev => {
        const idx = prev.lastIndexOf(productId);
        if (idx === -1) return prev;
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      });
    }
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(itemId => itemId !== productId));
  };

  const localizedFontWeight = isRTL ? 600 : 900;

  return (
    <div className="w-full text-[var(--foreground)]" dir={isRTL ? "rtl" : "ltr"}>
      {cartItems.length === 0 ? (
        <p className="text-center text-[var(--muted-foreground)] font-mono text-[11px] py-8">
          {t("empty_cart_msg")}
        </p>
      ) : (
        <>
          <div className="space-y-4 max-h-[40vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
            {cartItems.map((product) => {
              const count = cartQuantities[product.id] || 0;
              return (
                <div
                  key={product.id}
                  className={cn(
                    "border-b border-[var(--secondary-border)] pb-4 last:border-0 last:pb-0 flex gap-4 items-center justify-between",
                    isCartMobile && "flex-col items-center text-center justify-center"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-4 flex-1 min-w-0 w-full",
                    isCartMobile && "flex-col justify-center text-center"
                  )}>
                    <img
                      src={product.image}
                      alt={getFlowerName(product.id, lang, product.flower_name)}
                      className="w-12 h-12 object-cover border border-[var(--secondary-border)]"
                      style={{ borderRadius: "var(--radius, 0px)" }}
                    />
                    <div className={cn(
                      "font-mono text-[10px] text-start flex-1 min-w-0",
                      isCartMobile && "text-center w-full"
                    )}>
                      <div className="text-[var(--foreground)] font-bold uppercase truncate">
                        {getFlowerName(product.id, lang, product.flower_name)}
                      </div>
                      <div className="text-[var(--muted-foreground)] mt-0.5">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls Container */}
                  <div className={cn("shrink-0 flex items-center", isCartMobile && "w-full pt-2 justify-center")}>
                    {isCartMobile ? (
                      /* Mobile Layout: Plus/Minus row, trash full-width beneath */
                      <div className="flex flex-col gap-2 w-full max-w-[130px] items-center justify-center">
                        <div className="flex items-center justify-between w-full">
                          <RefinedChronicleButton 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(product.id, -1)} 
                            disabled={count <= 1}
                            padding="0" 
                            width="32px" 
                            buttonHeight="32px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            borderColor="var(--border)"
                            borderRadius={parseInt("var(--radius, 0px)") || 0}
                            iconedButtonMode={true}
                            className="transition-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>

                          <span className="font-mono text-[14px] font-bold w-6 text-center text-[var(--foreground)] select-none">
                            {count}
                          </span>

                          <RefinedChronicleButton 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(product.id, 1)} 
                            padding="0" 
                            width="32px" 
                            buttonHeight="32px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            borderColor="var(--secondary-border)"
                            borderRadius={parseInt("var(--radius, 0px)") || 0}
                            iconedButtonMode={true}
                            className="transition-all duration-200 hover:!bg-[var(--primary)] hover:!border-[var(--primary)] hover:!text-[var(--background)]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>
                        </div>

                        <RefinedChronicleButton
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(product.id)}
                          padding="0"
                          width="100%"
                          buttonHeight="32px"
                          backgroundColor="transparent"
                          textColor="var(--theme-red)"
                          hoverTextColor="var(--foreground)"
                          borderColor="var(--secondary-border)"
                          borderRadius={parseInt("var(--radius, 0px)") || 0}
                          hoverBackgroundColor="var(--theme-red)"
                          hoverBorderColor="var(--theme-red)"
                          iconedButtonMode={true}
                          className="w-full transition-all duration-200 hover:!bg-[var(--theme-red)] hover:!border-[var(--theme-red)] hover:!text-[var(--foreground)] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </RefinedChronicleButton>
                      </div>
                    ) : (
                      /* Desktop Layout */
                      <div 
                        className="flex items-center gap-3 w-full justify-between" 
                        style={{ borderRadius: "var(--radius, 0px)" }}
                      >
                        <div className="flex items-center gap-3">
                          <RefinedChronicleButton 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(product.id, -1)} 
                            disabled={count <= 1}
                            padding="0" 
                            width="32px" 
                            buttonHeight="32px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            borderColor="var(--border)"
                            borderRadius={parseInt("var(--radius, 0px)") || 0}
                            iconedButtonMode={true}
                            className="transition-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>

                          <span className="font-mono text-[14px] font-bold w-6 text-center text-[var(--foreground)] select-none">
                            {count}
                          </span>

                          <RefinedChronicleButton 
                            variant="outline" 
                            size="sm" 
                            onClick={() => updateQuantity(product.id, 1)} 
                            padding="0" 
                            width="32px" 
                            buttonHeight="32px" 
                            backgroundColor="transparent" 
                            textColor="var(--foreground)" 
                            borderColor="var(--secondary-border)"
                            borderRadius={parseInt("var(--radius, 0px)") || 0}
                            iconedButtonMode={true}
                            className="transition-all duration-200 hover:!bg-[var(--primary)] hover:!border-[var(--primary)] hover:!text-[var(--background)]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </RefinedChronicleButton>
                        </div>

                        <RefinedChronicleButton
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(product.id)}
                          padding="0"
                          width="32px"
                          buttonHeight="32px"
                          backgroundColor="transparent"
                          textColor="var(--theme-red)"
                          hoverTextColor="var(--foreground)"
                          borderColor="var(--secondary-border)"
                          borderRadius={parseInt("var(--radius, 0px)") || 0}
                          hoverBackgroundColor="var(--theme-red)"
                          hoverBorderColor="var(--theme-red)"
                          iconedButtonMode={true}
                          className="transition-all duration-200 hover:!bg-[var(--theme-red)] hover:!border-[var(--theme-red)] hover:!text-[var(--foreground)]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </RefinedChronicleButton>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary Block */}
          <div className="border-t border-[var(--secondary-border)] pt-4 mt-4">
            {isCartMobile ? (
              /* Mobile Pricing Order: Subtotal -> Tax -> Total */
              <div className="flex flex-col gap-3 items-center justify-center text-center">
                <div className="font-mono text-[10px] text-[var(--muted-foreground)] flex flex-col gap-1.5 items-center">
                  <span className="flex gap-1">
                    <span>{t('subtotal')}:</span> 
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </span>
                  <span className="flex gap-1">
                    <span>{t('mobile_tax_percentage_label')}:</span> 
                    <span className="font-bold">${taxAmount.toFixed(2)}</span>
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center gap-1">
                  <span 
                    className="hero-title uppercase leading-none text-[var(--foreground)] tracking-tight"
                    style={{ fontWeight: localizedFontWeight, fontSize: "19px" }}
                  >
                    {t('total')}
                  </span>
                  <span 
                    className="hero-title leading-none text-[var(--primary)]" 
                    style={{ fontWeight: localizedFontWeight, fontSize: "21px" }}
                  >
                    ${totalWithTax.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              /* Desktop Pricing Order: Total Row over Subtotal/Tax Breakdowns */
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span 
                    className="hero-title uppercase leading-none text-[var(--foreground)] tracking-tight"
                    style={{ fontWeight: localizedFontWeight, fontSize: "19px" }}
                  >
                    {t('total')}
                  </span>
                  <span 
                    className="hero-title leading-none text-[var(--primary)]" 
                    style={{ fontWeight: localizedFontWeight, fontSize: "21px" }}
                  >
                    ${totalWithTax.toFixed(2)}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-[var(--muted-foreground)] flex justify-between pt-0.5 gap-4 flex-row">
                  <span className="flex gap-1">
                    <span>{t('subtotal')}:</span> 
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </span>
                  <span className="flex gap-1">
                    <span>{t('tax_percentage_label')}:</span> 
                    <span className="font-bold">${taxAmount.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};