"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatTrigger from "./ChatTrigger";
import ChatModal from "./ChatModal";

interface ChatBoxProps {
  isMinimized?: boolean;
}

export default function ChatBox({ isMinimized }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        isMinimized={isMinimized}
      />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dimmed Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(3px)",
                zIndex: 1050, // Below trigger (1055) and modal (1060)
                pointerEvents: "auto",
                touchAction: "none",
                overscrollBehavior: "contain",
              }}
              onClick={() => setIsOpen(false)}
            />
            <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
