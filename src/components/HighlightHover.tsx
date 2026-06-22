'use client';
import { useEffect, useMemo, useRef } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface HighlightHoverProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  effect?: Transition;
  highlightColor?: string;
  barThickness?: number;
  gapRatio?: number;
  maxWidth?: string | number;
  isRTL?: boolean;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export const HighlightHover = ({
  children,
  as: Tag = "span",
  className,
  effect = { type: "spring", stiffness: 260, damping: 24 },
  highlightColor = "#39C73B", // Vivid Green
  barThickness = 0.12,
  gapRatio = 0.03,
  maxWidth = "100%",
  isRTL = false,
  style,
  disabled = false,
  ...rest
}: HighlightHoverProps) => {
  const ref = useRef<HTMLElement>(null);
  const MotionTag = useMemo(() => motion(Tag), [Tag]);

  useEffect(() => {
    const applyVars = () => {
      if (ref.current) {
        const size = parseFloat(getComputedStyle(ref.current).fontSize);
        ref.current.style.setProperty("--hh-bar", `${size * barThickness}px`);
        ref.current.style.setProperty("--hh-gap", `${size * gapRatio}px`);
      }
    };
    applyVars();
    window.addEventListener("resize", applyVars);
    return () => window.removeEventListener("resize", applyVars);
  }, [barThickness, gapRatio]);

  const barAnim = {
    rest: {
      height: "var(--hh-bar)",
      backgroundColor: "#39C73B",
      bottom: "calc(-1 * var(--hh-gap))",
    },
    hover: {
      height: "100%",
      bottom: 0,
      backgroundColor: "#39C73B",
      transition: effect,
    },
  };

  const textAnim = {
    rest: {
      color: "inherit",
      paddingLeft: "0px",
      paddingRight: "0px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    hover: {
      color: "#000",
      paddingLeft: "6px",
      paddingRight: "6px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    ...style
  };

  return (
    <MotionTag
      ref={ref as any}
      whileHover={disabled ? "rest" : "hover"}
      initial="rest"
      animate="rest"
      className={cn(
        "relative inline-block select-none overflow-hidden",
        !disabled && "cursor-pointer",
        className
      )}
      style={wrapperStyle}
      {...(rest as any)}
    >
      {!disabled && (
        <motion.div
          aria-hidden="true"
          variants={barAnim}
          className="absolute w-full left-0"
          style={{
            height: "var(--hh-bar)",
            bottom: "calc(-1 * var(--hh-gap))",
            transformOrigin: "bottom center",
            borderRadius: 0,
          }}
        />
      )}
      <motion.span
        variants={disabled ? {} : textAnim}
        className="relative z-[1] inline-block"
        style={{ display: "inline-block", whiteSpace: "normal" }}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
};

export default HighlightHover;