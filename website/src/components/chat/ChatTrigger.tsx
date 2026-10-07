"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ChatTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  isMinimized?: boolean;
}

export default function ChatTrigger({ isOpen, onToggle, isMinimized }: ChatTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`cyber-chat-trigger-wrap ${isMinimized ? "dock-minimized" : ""}`}
      style={{
        position: "fixed",
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
        right: "2%",
        zIndex: 1055,
        pointerEvents: "auto",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
      }}
    >
      <div className="position-relative d-inline-flex align-items-center">
        {/* Floating Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              className="dock-tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.92, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 4, scale: 0.92, x: "-50%" }}
              transition={{ duration: 0.15 }}
              style={{ bottom: "100%", left: "50%", marginBottom: "10px" }}
            >
              <span
                style={{ fontSize: "0.55rem", letterSpacing: 1.2, whiteSpace: "nowrap" }}
                className="font-outfit text-uppercase"
              >
                Chat with Kiran (AI)
              </span>
              <div className="dock-tooltip-arrow" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pill Trigger Button */}
        <motion.button
          type="button"
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="cyber-chat-fab btn p-0 border-0"
          aria-label={isOpen ? "Close AI Chat" : "Open AI Chat with Kiran"}
          title={isOpen ? "Close AI Chat" : "Chat with Kiran (AI)"}
        >
          {/* Avatar Container with Glowing Cyan Ring & Green Badge */}
          <div className="cyber-chat-fab-avatar">
            <div className="cyber-chat-fab-avatar-ring">
              <Image
                src="/hero-portrait.png"
                alt="Kiran Chand S"
                width={64}
                height={64}
                priority
                className="cyber-chat-avatar-img"
              />
            </div>
            {/* Online Green Indicator Dot */}
            <span className="cyber-chat-fab-status-dot" aria-hidden="true" />
          </div>

          {/* Sparkles Area */}
          <div className="cyber-chat-sparkles-wrap">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.i
                  key="close-icon"
                  className="bi bi-x-lg text-cyan"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ fontSize: "1.2rem" }}
                />
              ) : (
                <motion.div
                  key="sparkles"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cyber-chat-sparkles-svg"
                  >
                    <path
                      d="M10 9Q10 16 16.5 16Q10 16 10 23Q10 16 3.5 16Q10 16 10 9Z"
                      fill="#00f2fe"
                    />
                    <path
                      d="M24 14Q24 23 33 23Q24 23 24 32Q24 23 15 23Q24 23 24 14Z"
                      fill="#00f2fe"
                    />
                    <path
                      d="M29 4.5Q29 8 32.5 8Q29 8 29 11.5Q29 8 25.5 8Q29 8 29 4.5Z"
                      fill="#00f2fe"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
