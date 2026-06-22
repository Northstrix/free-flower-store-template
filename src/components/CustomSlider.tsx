'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface CustomSliderProps {
  id: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  onActiveChange?: (active: boolean) => void;
  disabled?: boolean;
  trackHeight?: string;
  width?: string;
  trackFillBorderRadius?: string;
  thumbBorderRadius?: string;
  thumbBorderWidth?: string;
  colorTrackBackground?: string;
  colorFillDefault?: string;
  colorFillHover?: string;
  colorFillActive?: string;
  colorThumbDefault?: string;
  colorThumbHover?: string;
  colorThumbActive?: string;
  colorThumbBorderDefault?: string;
  colorThumbBorderHover?: string;
  colorThumbBorderActive?: string;
  ariaLabel?: string;
  isRTL?: boolean;
}

export function CustomSlider({
  id,
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  onActiveChange,
  disabled = false,
  trackHeight = '4px',
  width = '100%',
  trackFillBorderRadius = '0px',
  thumbBorderRadius = '0px',
  thumbBorderWidth = '1px',
  colorTrackBackground = '#1a1a1a',
  colorFillDefault = '#3b3b3b',
  colorFillHover = '#4B4B4B',
  colorFillActive = '#39C73B',
  colorThumbDefault = '#0A0A0A',
  colorThumbHover = '#0A0A0A',
  colorThumbActive = '#0A0A0A',
  colorThumbBorderDefault = '#3b3b3b',
  colorThumbBorderHover = '#4B4B4B',
  colorThumbBorderActive = '#FFFFFF',
  ariaLabel = 'slider',
  isRTL = false,
}: CustomSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isActive = isDragging || isFocused;

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const getPercentage = useCallback(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (disabled || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      let percentage;
      if (isRTL) {
        percentage = ((rect.right - clientX) / rect.width) * 100;
      } else {
        percentage = ((clientX - rect.left) / rect.width) * 100;
      }
      percentage = Math.max(0, Math.min(100, percentage));
      let newValue = min + (percentage / 100) * (max - min);
      if (step !== 0) newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));
      onValueChange(newValue);
    },
    [disabled, min, max, step, onValueChange, isRTL]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsDragging(true);
    handleInteraction(e.clientX);
    sliderRef.current?.focus();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) handleInteraction(e.clientX);
    },
    [isDragging, handleInteraction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let newValue = value;
    const stepSize = step || 1;
    const largeStep = stepSize * 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = isRTL ? value - stepSize : value + stepSize;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = isRTL ? value + stepSize : value - stepSize;
        break;
      case 'PageUp':
        newValue = value + largeStep;
        break;
      case 'PageDown':
        newValue = value - largeStep;
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    newValue = Math.max(min, Math.min(max, newValue));
    onValueChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = getPercentage();
  const fillColor = isActive ? colorFillActive : isHovered ? colorFillHover : colorFillDefault;
  const thumbColor = isActive ? colorThumbActive : isHovered ? colorThumbHover : colorThumbDefault;
  const thumbBorderColor = isActive ? colorThumbBorderActive : isHovered ? colorThumbBorderHover : colorThumbBorderDefault;

  const thumbSize = 14;

  const wrapperClasses = `custom-slider-${id}-wrapper${disabled ? ' disabled' : ''}`;
  const trackClass = `custom-slider-${id}-track`;
  const rangeClass = `custom-slider-${id}-range`;
  const thumbClass = `custom-slider-${id}-thumb`;

  return (
    <div className="w-full">
      <style>{`
        .${wrapperClasses} {
          position: relative;
          width: ${width};
          height: 24px;
          display: flex;
          align-items: center;
          cursor: pointer;
          touch-action: none;
          outline: none;
        }
        .${trackClass}, .${rangeClass} {
          position: absolute;
          height: ${trackHeight};
          border-radius: ${trackFillBorderRadius};
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          transition: background-color 0.3s ease;
        }
        .${trackClass} {
          background-color: ${colorTrackBackground};
        }
        .${rangeClass} {
          background-color: ${fillColor};
          width: ${percentage}%;
          ${isRTL ? 'right: 0;' : 'left: 0;'}
        }
        .${thumbClass} {
          position: absolute;
          width: ${thumbSize}px;
          height: ${thumbSize}px;
          border-radius: ${thumbBorderRadius};
          top: 50%;
          transform: translateY(-50%);
          background-color: ${thumbColor};
          border: ${thumbBorderWidth} solid ${thumbBorderColor};
          transition: border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
          z-index: 10;
          ${isRTL
            ? `right: calc(${percentage}% - ${thumbSize/2}px);`
            : `left: calc(${percentage}% - ${thumbSize/2}px);`}
        }
      `}</style>

      <div
        ref={sliderRef}
        className={wrapperClasses}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={trackClass} />
        <div className={rangeClass} />
        <div className={thumbClass} />
      </div>
    </div>
  );
}
