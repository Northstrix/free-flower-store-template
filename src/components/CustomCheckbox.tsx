
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export interface CustomCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  direction?: "ltr" | "rtl";
  accentColor?: string;
  checkmarkColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
  borderWidth?: number | string;
  size?: number;
  labelColor?: string;
  labelFontSize?: number | string;
  labelFontWeight?: number | string;
  labelSpacing?: number;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  checkmarkDuration?: number;
  mirrorCheckmark?: boolean;
  checkedCoversOutline?: boolean;
  outlineTransition?: string;
  outlineHoverColor?: string;
  outlineHoverColorDisabled?: string;
  outlineColorDisabled?: string;
  borderStyle?: string;
  disabledBackgroundColor?: string;
  disabledBorderColor?: string;
  disabledCheckmarkColor?: string;
  // Group
  options?: {
    value: string;
    label: React.ReactNode;
    checkboxProps?: Partial<CustomCheckboxProps>;
  }[];
  values?: string[];
  onGroupChange?: (values: string[]) => void;
  maxSelected?: number;
  groupGap?: number;
  groupDirection?: "row" | "column";
}

const DEFAULTS = {
  accentColor: "#39C73B", // Vivid Green
  checkmarkColor: "#fff", // White checkmark
  backgroundColor: "var(--card)",
  borderColor: "var(--border)", // Secondary border color
  borderRadius: 0,
  borderWidth: 1,
  size: 24,
  labelColor: "#fff",
  labelFontSize: "10px",
  labelFontWeight: 400,
  labelSpacing: 10,
  checkmarkDuration: 0.32,
  outlineTransition: "border-color 0.3s ease-in-out",
  outlineHoverColor: "#4b4b4b", // Primary color on hover
  outlineHoverColorDisabled: "var(--secondary-border)",
  outlineColorDisabled: undefined,
  borderStyle: "solid",
  disabledBackgroundColor: undefined,
  disabledBorderColor: undefined,
  disabledCheckmarkColor: undefined,
  groupGap: 12,
  groupDirection: "column" as "row" | "column",
};

const SingleCheckbox: React.FC<
  CustomCheckboxProps & { hovered?: boolean }
> = ({
  checked = false,
  label,
  direction = "ltr",
  accentColor = DEFAULTS.accentColor,
  checkmarkColor = DEFAULTS.checkmarkColor,
  backgroundColor = DEFAULTS.backgroundColor,
  borderColor = DEFAULTS.borderColor,
  borderRadius = DEFAULTS.borderRadius,
  borderWidth = DEFAULTS.borderWidth,
  size = DEFAULTS.size,
  labelColor = DEFAULTS.labelColor,
  labelFontSize = DEFAULTS.labelFontSize,
  labelFontWeight = DEFAULTS.labelFontWeight,
  labelSpacing = DEFAULTS.labelSpacing,
  disabled = false,
  checkmarkDuration = DEFAULTS.checkmarkDuration,
  mirrorCheckmark = false,
  checkedCoversOutline = true,
  outlineTransition = DEFAULTS.outlineTransition,
  outlineHoverColor = DEFAULTS.outlineHoverColor,
  outlineHoverColorDisabled = DEFAULTS.outlineHoverColorDisabled,
  outlineColorDisabled = DEFAULTS.outlineColorDisabled,
  borderStyle = DEFAULTS.borderStyle,
  disabledBackgroundColor,
  disabledBorderColor,
  disabledCheckmarkColor,
  hovered = false,
}) => {
  const flexDirection = direction === "rtl" ? "row-reverse" : "row";
  const resolvedDisabledBackgroundColor = disabledBackgroundColor ?? backgroundColor;
  const resolvedDisabledBorderColor = disabledBorderColor ?? borderColor;
  const resolvedDisabledCheckmarkColor = disabledCheckmarkColor ?? checkmarkColor;
  const resolvedOutlineColorDisabled = outlineColorDisabled ?? resolvedDisabledBorderColor;

  let borderCol: string;
  if (disabled) {
    borderCol = hovered ? (outlineHoverColorDisabled ?? outlineHoverColor) : resolvedOutlineColorDisabled;
  } else {
    borderCol = checkedCoversOutline ? (checked ? accentColor : (hovered ? outlineHoverColor : borderColor)) : (hovered ? outlineHoverColor : borderColor);
  }

  const border = borderWidth === 0 ? "none" : `${borderWidth}px ${borderStyle} ${borderCol}`;
  const boxBg = disabled ? resolvedDisabledBackgroundColor : (checked ? (checkedCoversOutline ? accentColor : `linear-gradient(${accentColor} 0 0) padding-box, ${backgroundColor} border-box`) : backgroundColor);

  const checkboxEl = (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: boxBg,
        border,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        transition: `background 0.18s, ${outlineTransition}`,
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
        outline: "none",
        pointerEvents: "none",
        opacity: 1,
      }}
      tabIndex={-1}
      role="presentation"
      aria-hidden="true"
    >
      <motion.svg
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 24 24"
        strokeWidth={4}
        fill="none"
        style={{
          display: "block",
          pointerEvents: "none",
          transform: mirrorCheckmark ? "scaleX(-1)" : "none",
        }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0, opacity: 0, stroke: "#fff" }}
          animate={checked 
            ? { pathLength: 1, opacity: 1, stroke: "#000" } 
            : { pathLength: 0, opacity: 0, stroke: "#fff" }
          }
          transition={{
            pathLength: { duration: checkmarkDuration, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.1 },
            stroke: { 
              delay: checked ? 0.4 : 0, 
              duration: checked ? 1.2 : 0, 
              ease: "easeInOut" 
            }
          }}
        />
      </motion.svg>
      {hovered && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}
    </span>
  );

  const labelEl = label && (
    <span
      style={{
        color: labelColor,
        fontSize: labelFontSize,
        fontWeight: labelFontWeight,
        lineHeight: 1.5,
        whiteSpace: "pre-line",
        direction,
        textAlign: direction === "rtl" ? "right" : "left",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        pointerEvents: "none",
        fontFamily: "'JetBrains Mono', monospace",
      }}
      aria-hidden="true"
    >
      {label}
    </span>
  );

  return (
    <span
      dir={direction}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection,
        gap: labelSpacing,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        opacity: disabled ? 0.5 : 1,
        position: "relative",
      }}
      tabIndex={-1}
      role="presentation"
      aria-hidden="true"
    >
      {direction === "rtl" ? (
        <>
          {labelEl}
          {checkboxEl}
        </>
      ) : (
        <>
          {checkboxEl}
          {labelEl}
        </>
      )}
    </span>
  );
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = (props) => {
  if (props.options && props.values && props.onGroupChange) {
    const {
      options,
      values,
      onGroupChange,
      direction = "ltr",
      maxSelected,
      groupGap = DEFAULTS.groupGap,
      groupDirection = DEFAULTS.groupDirection,
    } = props;
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const isVertical = groupDirection === "column";
    const isRTL = direction === "rtl";
    const groupAlignItems = isVertical && isRTL ? "flex-end" : "flex-start";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: groupDirection,
          gap: groupGap,
          alignItems: groupAlignItems,
        }}
      >
        {options.map((opt, idx) => {
          const isChecked = values.includes(opt.value);
          const isDisabled = !!opt.checkboxProps?.disabled || (!isChecked && typeof maxSelected === "number" && values.length >= maxSelected);

          return (
            <label
              key={opt.value}
              dir={direction}
              style={{
                display: "inline-flex",
                alignItems: "center",
                flexDirection: direction === "rtl" ? "row-reverse" : "row",
                gap: opt.checkboxProps?.labelSpacing ?? DEFAULTS.labelSpacing,
                cursor: isDisabled ? "not-allowed" : "pointer",
                userSelect: "text",
                opacity: isDisabled ? 0.5 : 1,
                position: "relative",
              }}
              tabIndex={isDisabled ? -1 : 0}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (!isDisabled) {
                  e.preventDefault();
                  // For radio-like logic in vividflora: if we click an unchecked one, it becomes the ONLY selection.
                  // If we click an already checked one, we keep it checked (radio behavior).
                  if (!isChecked) {
                    onGroupChange([opt.value]);
                  }
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !isDisabled) {
                  e.preventDefault();
                  if (!isChecked) {
                    onGroupChange([opt.value]);
                  }
                }
              }}
              role="checkbox"
              aria-checked={isChecked}
              aria-disabled={isDisabled}
            >
              <SingleCheckbox
                {...opt.checkboxProps}
                checked={isChecked}
                disabled={isDisabled}
                direction={direction}
                label={opt.label}
                hovered={hoveredIndex === idx}
              />
            </label>
          );
        })}
      </div>
    );
  }

  const [hovered, setHovered] = useState(false);
  return (
    <label
      dir={props.direction ?? "ltr"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexDirection: props.direction === "rtl" ? "row-reverse" : "row",
        gap: props.labelSpacing ?? DEFAULTS.labelSpacing,
        cursor: props.disabled ? "not-allowed" : "pointer",
        userSelect: "text",
        opacity: props.disabled ? 0.5 : 1,
        position: "relative",
        ...props.style,
      }}
      className={props.className}
      tabIndex={props.disabled ? -1 : 0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (!props.disabled && props.onChange) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !props.disabled && props.onChange) {
          e.preventDefault();
          props.onChange(!props.checked);
        }
      }}
      role="checkbox"
      aria-checked={props.checked}
      aria-disabled={props.disabled}
    >
      <SingleCheckbox {...props} hovered={hovered} />
    </label>
  );
};

export default CustomCheckbox;
