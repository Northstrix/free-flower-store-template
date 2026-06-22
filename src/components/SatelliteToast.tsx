"use client";

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type ToastPosition = "bottom-left" | "bottom-right";

export interface ToastNotification {
  id?: string;
  title?: string;
  content?: string;
  isRTL?: boolean;
}

export interface SatelliteToastProps {
  maxWidth?: string;
}

const Notification = ({ notification, onClose }: { notification: ToastNotification; onClose: () => void }) => {
  const { title, content, isRTL = false } = notification;

  const [isVisible, setIsVisible] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const remainingRef = useRef(4000);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400);
  };

  useEffect(() => {
    const uid = Date.now();
    const style = document.createElement("style");
    style.textContent = `@keyframes timerDeplete-${uid} { from { transform: scaleX(1); } to { transform: scaleX(0); } }`;
    document.head.appendChild(style);

    if (timerRef.current) {
      timerRef.current.style.animation = `timerDeplete-${uid} 4000ms linear forwards`;
    }

    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(handleClose, 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      style.remove();
    };
  }, []);

  const pauseTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    remainingRef.current -= Date.now() - startTimeRef.current;
    if (timerRef.current) timerRef.current.style.animationPlayState = "paused";
  };

  const resumeTimer = () => {
    if (remainingRef.current > 0) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(handleClose, remainingRef.current);
      if (timerRef.current) timerRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <div
      ref={notifRef}
      dir={isRTL ? "rtl" : "ltr"}
      className={`toast-wrapper ${isVisible ? "animate-slide-in" : "animate-slide-out"}`}
      style={{
        zIndex: 1100,
        ["--anim-translateX" as any]: isRTL ? "-150%" : "150%",
        ["--anim-bounceX" as any]: isRTL ? "12%" : "-12%",
        position: "relative",
        pointerEvents: "auto",
        width: "100%",
      }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <style>{`
        @keyframes slideInWithBounce {
          0% { transform: translateX(var(--anim-translateX)); opacity: 0; }
          60% { transform: translateX(var(--anim-bounceX)); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutWithBounce {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(var(--anim-bounceX)); opacity: 1; }
          100% { transform: translateX(var(--anim-translateX)); opacity: 0; }
        }
        .animate-slide-in { animation: slideInWithBounce 400ms ease forwards; }
        .animate-slide-out { animation: slideOutWithBounce 400ms ease forwards; }
      `}</style>
      
      <div
        style={{
          borderRadius: "var(--radius, 0px)",
          outline: "1px solid var(--border)",
          backgroundColor: "var(--card)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          paddingTop: "1.1rem",
          paddingBottom: "1.3rem",
          paddingLeft: isRTL ? "3.25rem" : "1.25rem",
          paddingRight: isRTL ? "1.25rem" : "3.25rem",
        }}
      >
        <div style={{ flex: 1, zIndex: 20 }}>
          <h3 style={{ fontSize: "0.95rem", color: "var(--accent)", fontWeight: 700, margin: 0, paddingBottom: "0.15rem" }}>
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", fontWeight: 400, margin: 0, fontFamily: "monospace" }}>
            {content}
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "4%",
            right: "4%",
            width: "92%",
            height: "3px",
            background: "var(--secondary-border)",
            borderRadius: "var(--radius, 0px)",
            overflow: "hidden",
            zIndex: 15,
          }}
        >
          <div 
            ref={timerRef} 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              height: "100%", 
              background: "var(--accent)", 
              transformOrigin: isRTL ? "right" : "left" 
            }} 
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          [isRTL ? "left" : "right"]: "0.75rem",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Close notification"
          style={{
            height: "28px",
            width: "28px",
            cursor: "pointer",
            borderRadius: "var(--radius, 0px)",
            backgroundColor: "var(--muted)",
            color: "var(--foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            padding: 0,
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--border)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--muted)";
            e.currentTarget.style.color = "var(--foreground)";
          }}
        >
          <X size={15} strokeWidth={2.5} style={{ display: "block" }} />
        </button>
      </div>
    </div>
  );
};

export const SatelliteToast = forwardRef<{ showNotification: (options: Omit<ToastNotification, "id">) => void }, SatelliteToastProps>(
  ({ maxWidth = "360px" }, ref) => {
    const [notifications, setNotifications] = useState<ToastNotification[]>([]);
    const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

    useEffect(() => {
      const node = document.createElement("div");
      node.setAttribute("id", "satellite-toast-portal");
      document.body.appendChild(node);
      setPortalNode(node);
      return () => {
        document.body.removeChild(node);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      showNotification: (options) => {
        const newNotification: ToastNotification = { ...options, id: Math.random().toString(36).substring(2, 9) };
        setNotifications((prev) => [...prev, newNotification]);
      },
    }));

    const removeNotification = useCallback((id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const grouped = useMemo(() => {
      return notifications.reduce((acc, n) => {
        const pos = n.isRTL ? "bottom-left" : "bottom-right";
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(n);
        return acc;
      }, {} as Record<ToastPosition, ToastNotification[]>);
    }, [notifications]);

    if (!portalNode) return null;

    const getPosStyles = (pos: ToastPosition): React.CSSProperties => ({
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      zIndex: 2000,
      pointerEvents: "none",
      width: "calc(100% - 54px)", 
      maxWidth,
      rowGap: "12px", // Increased space between toasts from 10px to 12px
      bottom: "21px",  // Increased space from page bottom from 20px to 21px
      [pos.includes("left") ? "left" : "right"]: "27px", 
    });

    return createPortal(
      <>
        {Object.entries(grouped).map(([pos, arr]) => (
          <div key={pos} style={getPosStyles(pos as ToastPosition)}>
            {arr.map((n) => <Notification key={n.id} notification={n} onClose={() => removeNotification(n.id!)} />)}
          </div>
        ))}
      </>,
      portalNode
    );
  }
);

SatelliteToast.displayName = "SatelliteToast";