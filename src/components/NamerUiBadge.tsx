'use client';
import React, { useState } from 'react';

interface NamerUiBadgeProps {
  href?: string;
  isRTL?: boolean;
  poweredByText?: string;
  namerUIName?: string;
  iconSrc?: string;
  className?: string;
}

export default function NamerUiBadge({
  href = 'https://namer-ui.vercel.app/',
  isRTL = false,
  poweredByText = 'Powered by',
  namerUIName = 'Namer UI',
  iconSrc = '',
  className = '',
}: NamerUiBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    background: 'var(--background)',
    border: `1px solid var(--secondary-border)`,
    padding: '16px 24px 24px 24px',
    userSelect: 'none',
    textAlign: isRTL ? 'right' : 'left',
    transition: 'all 0.25s ease-in-out',
    cursor: 'pointer',
    direction: isRTL ? 'rtl' : 'ltr',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  };

  const hoverStyle: React.CSSProperties = {
    background: '#111',
    border: `1px solid var(--border)`,
  };

  const logoWrapperStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    minHeight: '32px',
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #4776cb, #a19fe5, #6cc606)',
    borderRadius: '0px',
    padding: '0px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  };

  const logoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...(isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle) }}
        className={`inline-flex rounded-[0px] select-none ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="powered-by-text text-[12px] mb-2"
          style={{
            userSelect: 'none',
            color: isHovered ? '#e1e1e1' : '#a1a1aa',
            transition: 'color 0.25s ease-in-out',
          }}
        >
          {poweredByText}
        </span>

        <div
          className="inline-flex items-center gap-3"
          style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}
        >
          <span style={logoWrapperStyle}>
            {iconSrc && (
              <img
                src={iconSrc}
                alt={namerUIName}
                width={32}
                height={32}
                style={logoStyle}
                className="flex-shrink-0"
              />
            )}
          </span>

          <span className="flip-wrapper">
            <span>
              <em className="flip-text">
                <span
                  className="font-bold text-base select-none whitespace-nowrap"
                  style={{ color: 'var(--foreground)' }}
                >
                  {namerUIName}
                </span>
              </em>
            </span>
            <span>
              <em className="flip-text">
                <span
                  className="font-bold text-base select-none whitespace-nowrap"
                  style={{ color: 'var(--foreground)' }}
                >
                  {namerUIName}
                </span>
              </em>
            </span>
          </span>
        </div>
      </a>

      <style jsx>{`
        .flip-wrapper {
          position: relative;
          display: block;
          perspective: 108px;
        }
        .flip-wrapper span {
          display: block;
        }
        .flip-wrapper span:nth-of-type(2) {
          position: absolute;
          top: 0;
          left: 0;
        }
        .flip-text {
          font-style: normal;
          display: inline-block;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
          will-change: transform, opacity;
          transition: transform 0.55s cubic-bezier(0.645, 0.045, 0.355, 1),
            opacity 0.35s linear 0.2s;
        }
        .flip-wrapper span:nth-of-type(1) .flip-text {
          transform-origin: top;
          opacity: 1;
          transform: rotateX(0deg);
        }
        .flip-wrapper span:nth-of-type(2) .flip-text {
          opacity: 0;
          transform: rotateX(-90deg) scaleX(0.9) translate3d(0, 10px, 0);
          transform-origin: bottom;
        }
        a:hover .flip-wrapper span:nth-of-type(1) .flip-text {
          opacity: 0;
          transform: rotateX(90deg) scaleX(0.9) translate3d(0, -10px, 0);
        }
        a:hover .flip-wrapper span:nth-of-type(2) .flip-text {
          opacity: 1;
          transform: rotateX(0deg) scaleX(1) translateZ(0);
          transition: transform 0.75s cubic-bezier(0.645, 0.045, 0.355, 1),
            opacity 0.35s linear 0.3s;
        }
      `}</style>
    </>
  );
}