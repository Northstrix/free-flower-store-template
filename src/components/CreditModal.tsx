"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ModalOverlay } from "@/components/modal-overlay";
import { useApp } from "@/components/AppProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import RefinedChronicleButton from "@/components/ui/RefinedChronicleButton";
import HighlightHover from "@/components/HighlightHover";

const creditsMarkdown = `
[Agency Layout - cpc-landing-page](https://codepen.io/fchaussin/pen/PwbPEVV) by [Freask'O](https://codepen.io/fchaussin)
[Resizable Navbar](https://ui.aceternity.com/components/resizable-navbar) by [Aceternity UI](https://ui.aceternity.com/)
[Limelight Nav](https://21st.dev/easemize/limelight-nav/default) by [EaseMize UI](https://21st.dev/easemize)
[Chronicle Button](https://codepen.io/Haaguitos/pen/OJrVZdJ) by [Haaguitos](https://codepen.io/Haaguitos)
[Vertical Fan | Text Loop Timeline Animation](https://codepen.io/jpbelley/pen/JobwWaP) by [JP](https://codepen.io/jpbelley)
[easing sandbox for gradients, masks, shadows 🤙](https://codepen.io/jh3y/pen/ByQQOLo) by [Jhey](https://codepen.io/jh3y)
[Wheel Picker](https://21st.dev/ncdai/wheel-picker/default) by [Chánh Đại](https://21st.dev/ncdai)
[React Wheel Picker](https://www.npmjs.com/package/@ncdai/react-wheel-picker) by [Chánh Đại](https://github.com/ncdai)
[すりガラスなプロフィールカード](https://codepen.io/ash_creator/pen/zYaPZLB) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)
[Next.js](https://nextjs.org/) by [Vercel](https://vercel.com/)
[framer-motion](https://www.npmjs.com/package/framer-motion)
[AnimateIcons](https://animateicons.vercel.app/)
[i18next](https://www.npmjs.com/package/i18next)
[Lucide React](https://www.npmjs.com/package/lucide-react)
[Text scroll and hover effect with GSAP and clip](https://codepen.io/Juxtopposed/pen/mdQaNbG) by [Juxtopposed](https://codepen.io/Juxtopposed)
[Fill Text with Image Using CSS](https://codepen.io/iamdejean/pen/wvwjjer) by [Ezekiel Japheth Ayuba](https://codepen.io/iamdejean)
[Custom Checkbox](https://21st.dev/Edil-ozi/custom-checkbox/default) by [Edil Ozi](https://21st.dev/Edil-ozi)
[チェックしないと押せないボタン](https://codepen.io/ash_creator/pen/JjZReNm) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)
[Color Picker](https://21st.dev/community/components/uplusion23/color-picker/color-picker-with-swatches-and-onchange) by [Trevor McIntire](https://21st.dev/community/uplusion23)
[Input Floating Label animation](https://codepen.io/Mahe76/pen/qBQgXyK) by [Elpeeda](https://codepen.io/Mahe76)
[JTB studios - Link](https://codepen.io/zzznicob/pen/GRPgKLM) by [Nico](https://codepen.io/zzznicob)
[Hover Link Animation](https://21st.dev/erikvalencia1/hover-link-animation/default) by [Ruben](https://21st.dev/rubenerik)
[radix-ui](https://www.npmjs.com/package/radix-ui)
[Perplexity](https://www.perplexity.ai/)
[Firebase Studio](https://firebase.studio/)
[Google Gemini](https://gemini.google.com/)
[Color Picker](https://21st.dev/community/components/uplusion23/color-picker/color-picker-with-swatches-and-onchange) by [Trevor McIntire](https://21st.dev/community/uplusion23)
[vue-color-wheel](https://vue-color-wheel.vercel.app/) by [Robert Shaw](https://github.com/xiaoluoboding)
[Splashed Toast Notifications - CSS](https://codepen.io/josetxu/pen/OJGXdzY) by [Josetxu](https://codepen.io/josetxu/pen/OJGXdzY)
[Push Notifications](https://codepen.io/FlorinPop17/pen/xxORmaB) by [Florin Pop](https://codepen.io/FlorinPop17)
[bg bars](https://21st.dev/to_be_deleted/bg-bars/default) by [Moazam](https://21st.dev/muhammadnadeemmn9485134)
[Satellite animation](https://codepen.io/Emile_Dvl/pen/RwVeVy) by [Emile Duval](https://codepen.io/Emile_Dvl)
[Illustration](https://unsplash.com/illustrations/a-pink-flower-and-a-green-trumpet-on-a-yellow-background-xfycM9PN24s?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) by [Erone Stuff](https://unsplash.com/@eronestudio/illustrations?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/illustrations?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Revati](https://unsplash.com/@revathy_93?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-yellow-rose-on-a-bush-bJXNf9y-Y1w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Ozge Alpaslan](https://www.pexels.com/@ozge-alpaslan-354415780/) from [Pexels](https://www.pexels.com/photo/pink-tulips-growing-in-garden-23319783/)
Photo by [David Gomez](https://unsplash.com/@dcanadianphotographer?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-yellow-flower-with-green-leaves-vcRsgsTiRc0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Ksenia Pixelesse](https://unsplash.com/@pixelesse?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-close-up-of-a-white-and-yellow-flower-NDXqyIM6fLI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Anna Keibalo](https://www.pexels.com/@anna-keibalo-620756389/) from [Pexels](https://www.pexels.com/photo/white-lily-flowers-18018946/)
Photo by [Mark Ticman](https://unsplash.com/@markeltic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-close-up-of-a-purple-and-white-flower-k2EBx7_8wVo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Anna Evans](https://unsplash.com/@anevans?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-large-orange-flower-in-a-garden-iiw77F1QAJk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Townsend Walton](https://www.pexels.com/@townsend-walton-6231368/) from [Pexels](https://www.pexels.com/photo/vibrant-purple-and-white-petunia-blossom-31840723/)
Photo by [Onkel Ramirez](https://www.pexels.com/@onkel-ramirez-15362567/) from [Pexels](https://www.pexels.com/photo/lavender-flowers-in-close-up-photography-10777148/)
Photo by [Zoshua Colah](https://unsplash.com/@zoshuacolah?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-close-up-of-a-pink-flower-in-a-garden-2MkoyhsXWt0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Tunafish](https://unsplash.com/@ultratunafish?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/purple-and-white-hydrangeas-in-bloom-M-EXwFJVQf4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
Photo by [Ann Ann](https://unsplash.com/@annanes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-bunch-of-flowers-that-are-in-the-grass-7X1W3oU1S-4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
`;

function renderEntry(entry: string, isRTL: boolean) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(entry)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <HighlightHover
          key={key++}
          isRTL={isRTL}
          barThickness={0}
          className="mx-1"
          disabled={true}
          style={{ color: "var(--muted-foreground)" }}
        >
          {entry.slice(lastIndex, match.index)}
        </HighlightHover>
      );
    }
    let label = match[1];
    parts.push(
      <HighlightHover
        key={key++}
        as="a"
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        isRTL={isRTL}
        className="cursor-pointer font-medium underline transition-all duration-300 ease-in-out text-[var(--foreground)] decoration-[var(--foreground)] hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
        style={{ textDecoration: "underline", whiteSpace: "nowrap" }}
      >
        {label}
      </HighlightHover>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < entry.length) {
    parts.push(
      <HighlightHover
        key={key++}
        isRTL={isRTL}
        barThickness={0}
        className="mx-1"
        disabled={true}
        style={{ color: "var(--muted-foreground)" }}
      >
        {entry.slice(lastIndex)}
      </HighlightHover>
    );
  }
  return parts;
}

export default function CreditModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const { t, isRTL } = useApp();
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  const creditEntries = creditsMarkdown.trim().split(/\n+/).map((e) => e.trim()).filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-[3000] p-4"
            onClick={onClose}
          >
            <motion.div
              layout
              className="flex flex-col relative border text-[var(--foreground)]"
              style={{ 
                width: "min(480px, 90vw)", 
                height: "min(720px, 86vh)", 
                borderRadius: "var(--radius)",
                overflow: "hidden",
                backgroundColor: "var(--card)",
                borderColor: "var(--border)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Container */}
              <div 
                className="flex items-center justify-between px-6 border-b" 
                style={{ minHeight: 72, borderColor: "var(--secondary-border)" }}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {isRTL ? (
                  <>
                    <button onClick={onClose} className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      <X size={20} />
                    </button>
                    <span className="font-headline font-black text-xl select-none mx-auto tracking-tighter">
                      {t("credit_inscription")}
                    </span>
                    <div style={{ width: "36px" }} />
                  </>
                ) : (
                  <>
                    <div style={{ width: "36px" }} />
                    <span className="font-headline font-black text-xl select-none mx-auto tracking-tighter">
                      {t("credit_inscription")}
                    </span>
                    <button onClick={onClose} className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      <X size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Scroll Container forcing right-side native scroll alignment regardless of page state */}
              <div className="flex-grow overflow-y-auto custom-scrollbar" dir="ltr">
                <div className="px-6 py-8 text-center" dir="ltr">
                  <ul className="list-none p-0 m-0 space-y-6">
                    {creditEntries.map((entry, idx) => (
                      <li key={idx} className="text-[14px] leading-relaxed">
                        {renderEntry(entry, isRTL)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Block */}
              <div className="p-6 border-t" style={{ borderColor: "var(--secondary-border)" }} dir={isRTL ? "rtl" : "ltr"}>
                <RefinedChronicleButton onClick={onClose} className="w-full" variant="default" backgroundColor="#fff" textColor="#000" hoverBackgroundColor="#39C73B" borderRadius={0} width="100%">
                  {t("ok_inscription")}
                </RefinedChronicleButton>
              </div>
            </motion.div>
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}