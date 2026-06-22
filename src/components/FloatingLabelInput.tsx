"use client";
import React, { useEffect, useState, useCallback } from "react";

export interface FloatingLabelInputProps {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  isRTL?: boolean;
  accentColor?: string;
  textareaHeight?: string;
  parentBackground?: string; 
  inputOutlineColor?: string;
  inputFocusOutlineColor?: string; 
  outlineWidth?: string;
  foregroundColor?: string;
  mutedForegroundColor?: string;
  activeLabelColor?: string;
  rounding?: string;
  inputPadding?: string;
  inputFontSize?: string;
  labelFontSize?: string;
  labelActiveFontSize?: string;
  labelPadding?: string;
  labelActivePadding?: string;
  inputHeight?: string;
}

function detectRTL(text: string): boolean {
  return /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
}
function detectLabelDir(text: string): "rtl" | "ltr" {
  return detectRTL(text) ? "rtl" : "ltr";
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onValueChange,
  type = "text",
  autoComplete = "off",
  required = false,
  disabled = false,
  textarea = false,
  isRTL,
  accentColor = "#39C73B",
  textareaHeight = "152px",
  parentBackground = "#050505",
  inputOutlineColor = "#232323",
  inputFocusOutlineColor = "#FFFFFF",
  outlineWidth = "1px",
  foregroundColor = "#fff",
  mutedForegroundColor = "#666",
  activeLabelColor = "#39C73B",
  rounding = "0px",
  inputPadding = "12px 16px 8px",
  inputFontSize = "12px",
  labelFontSize = "12px",
  labelActiveFontSize = "9px",
  labelPadding = "0 7px",
  labelActivePadding = "0 6px",
  inputHeight = "44px",
}) => {
  const [focused, setFocused] = useState(false);
  const [rtlInput, setRtlInput] = useState(isRTL ?? false);

  useEffect(() => {
    if (!value) setRtlInput(isRTL ?? false);
    else setRtlInput(detectRTL(value));
  }, [value, isRTL]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onValueChange(e.target.value);
    },
    [onValueChange]
  );

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const hasValue = value.length > 0;
  const labelDir = detectLabelDir(label);

  const style: React.CSSProperties = {
    "--accent-color": activeLabelColor,
    "--mobile-form-input-bg": "transparent",
    "--input-outline": inputOutlineColor,
    "--input-outline-focus": inputFocusOutlineColor,
    "--input-outline-width": outlineWidth,
    "--foreground": foregroundColor,
    "--muted-foreground": mutedForegroundColor,
    "--parent-background": parentBackground,
    "--general-rounding": rounding,
    "--floating-input-layout-text-area-height": textareaHeight,
    "--input-padding": inputPadding,
    "--input-font-size": inputFontSize,
    "--label-font-size": labelFontSize,
    "--label-active-font-size": labelActiveFontSize,
    "--label-padding": labelPadding,
    "--label-active-padding": labelActivePadding,
    "--input-height": inputHeight,
  } as React.CSSProperties;

  return (
    <div
      className={[
        "mobile-form-group",
        rtlInput ? "rtl" : "",
        focused ? "active" : "",
        hasValue ? "has-value" : "",
        textarea ? "textarea" : "",
      ].join(" ")}
      style={style}
    >
      {textarea ? (
        <textarea
          className="mobile-form-input"
          required={required}
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          dir={rtlInput ? "rtl" : "ltr"}
          spellCheck={false}
        />
      ) : (
        <input
          className="mobile-form-input"
          type={type}
          required={required}
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          dir={rtlInput ? "rtl" : "ltr"}
          spellCheck={false}
        />
      )}
      <label
        className={"mobile-form-label" + (textarea ? " label-textarea" : "")}
        dir={labelDir}
      >
        {label}
      </label>
      <style jsx>{`
        .mobile-form-group {
          position: relative;
          width: 100%;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 0px;
        }
        .mobile-form-input {
          width: 100%;
          height: var(--input-height);
          padding: var(--input-padding);
          font-family: "JetBrains Mono", monospace;
          font-size: var(--input-font-size);
          font-weight: 400;
          color: var(--foreground);
          background: var(--mobile-form-input-bg);
          border: var(--input-outline-width) solid var(--input-outline);
          border-radius: var(--general-rounding);
          outline: none;
          box-sizing: border-box;
          text-align: left;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
          resize: none;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .mobile-form-input:focus {
          border-color: var(--input-outline-focus);
        }
        .mobile-form-group.rtl .mobile-form-input {
          direction: rtl;
          text-align: right;
        }
        .mobile-form-label {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted-foreground);
          font-family: "JetBrains Mono", monospace;
          font-size: var(--label-font-size);
          font-weight: 400;
          pointer-events: none;
          background: var(--parent-background);
          padding: var(--label-padding);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          text-transform: uppercase;
        }
        .mobile-form-group.rtl .mobile-form-label {
          right: 12px;
          left: auto;
          text-align: right;
        }
        .mobile-form-group.active .mobile-form-label {
          color: var(--accent-color) !important;
          top: 0;
          font-size: var(--label-active-font-size);
          padding: var(--label-active-padding);
        }
        .mobile-form-group.has-value:not(.active) .mobile-form-label {
           color: var(--muted-foreground);
           top: 0;
           font-size: var(--label-active-font-size);
           padding: var(--label-active-padding);
        }
      `}</style>
    </div>
  );
};

export default FloatingLabelInput;
