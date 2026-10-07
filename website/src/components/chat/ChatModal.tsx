"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import * as THREE from "three";
import { ChatMessage, SUGGESTED_QUESTIONS } from "@/data/chatboxdata";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function renderMessageContent(content: string) {
  if (!content) return null;
  const lines = content.split("\n");

  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} style={{ height: "0.35rem" }} />;
    }

    const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
    const textToParse = isBullet ? line.trim().slice(2) : line;
    const tokens = textToParse.split(/(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|`[^`]+?`|\*[^*]+?\*)/g);

    return (
      <div
        key={lineIdx}
        className={isBullet ? "d-flex align-items-start gap-1 ps-1 my-0.5" : "my-0.5"}
        style={{ lineHeight: 1.45 }}
      >
        {isBullet && <span className="text-cyan user-select-none">•</span>}
        <span>
          {tokens.map((token, tokenIdx) => {
            if (token.startsWith("***") && token.endsWith("***") && token.length >= 6) {
              return (
                <strong key={tokenIdx} className="fw-semibold text-white">
                  <em>{token.slice(3, -3)}</em>
                </strong>
              );
            }
            if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
              return (
                <strong key={tokenIdx} className="fw-semibold text-white">
                  {token.slice(2, -2)}
                </strong>
              );
            }
            if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
              return (
                <code
                  key={tokenIdx}
                  className="px-1 py-0.5 rounded text-cyan"
                  style={{ background: "rgba(0, 242, 254, 0.12)", fontSize: "0.85em" }}
                >
                  {token.slice(1, -1)}
                </code>
              );
            }
            if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
              return <em key={tokenIdx}>{token.slice(1, -1)}</em>;
            }
            return token;
          })}
        </span>
      </div>
    );
  });
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hey! 👋 Thanks for dropping by. Feel free to say hi, ask about my projects, or chat about tech!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js Background Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.6,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Floating Geometric Shape
    const shapeGeo = new THREE.IcosahedronGeometry(8, 1);
    const shapeMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const shape = new THREE.Mesh(shapeGeo, shapeMat);
    scene.add(shape);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.003;
      particles.rotation.y = time * 0.3;
      particles.rotation.x = time * 0.1;
      
      shape.rotation.x = time;
      shape.rotation.y = time * 0.8;
      
      // Floating effect
      shape.position.y = Math.sin(time * 2) * 2;
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      shapeGeo.dispose();
      shapeMat.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Lock background scroll when ChatModal is active, allowing only the chat box to scroll
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const chatBody = target?.closest(".cyber-chat-body") as HTMLElement | null;

      // Cursor outside the chat scrollable body (e.g. backdrop, modal header/footer, background page)
      if (!chatBody) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      // Check boundary inside chat body to prevent overscroll chaining to window/page behind
      const { scrollTop, scrollHeight, clientHeight } = chatBody;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const chatBody = target?.closest(".cyber-chat-body") as HTMLElement | null;

      if (!chatBody) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = chatBody;
      if (scrollHeight <= clientHeight) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if ((deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom)) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      if (!document.querySelector(".cyber-modal-overlay")) {
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");
      }
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const botReply = data?.reply || "I didn't quite catch that. Feel free to rephrase!";

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I ran into an issue connecting to the AI service. Please try again shortly!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="cyber-chat-modal"
      role="dialog"
      aria-label="Kiran Chand AI Chat"
    >
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.8,
        }}
      />

      {/* Modal Header */}
      <div className="cyber-chat-header d-flex align-items-center justify-content-between position-relative z-1">
        <div className="d-flex align-items-center gap-2">
          <div className="cyber-chat-modal-avatar">
            <div className="cyber-chat-modal-avatar-ring">
              <Image
                src="/hero-portrait.png"
                alt="Kiran Chand S"
                width={36}
                height={36}
                priority
                className="cyber-chat-avatar-img"
              />
            </div>
            <span className="cyber-chat-status-pulse" />
          </div>
          <div>
            <div className="cyber-chat-title font-syncopate">
              Kiran Chand S <span className="cyber-chat-tag">AI</span>
            </div>
            <div className="cyber-chat-status-text font-outfit">
              <span className="text-cyan">●</span> Groq LPU Powered • Online
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="cyber-chat-header-btn btn p-1"
            title="Clear conversation"
            aria-label="Clear conversation"
            onClick={() =>
              setMessages([
                {
                  id: "welcome-reset",
                  role: "assistant",
                  content: "Chat refreshed! Feel free to say hi or ask anything.",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ])
            }
          >
            <i className="bi bi-arrow-counterclockwise" />
          </button>
          <button
            type="button"
            className="cyber-chat-header-btn btn p-1"
            title="Close chat"
            aria-label="Close chat"
            onClick={onClose}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div className="cyber-chat-suggestions position-relative z-1">
          <div className="cyber-chat-suggestions-label font-outfit">Suggested questions:</div>
          <div className="d-flex flex-wrap gap-1">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="cyber-chat-chip btn font-outfit"
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="cyber-chat-body position-relative z-1">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`cyber-chat-msg-row ${m.role === "user" ? "user-row" : "bot-row"}`}
            >
              <div className={`cyber-chat-bubble ${m.role === "user" ? "user-bubble" : "bot-bubble"}`}>
                <div className="cyber-chat-bubble-content font-outfit">
                  {renderMessageContent(m.content)}
                </div>
                <span className="cyber-chat-time font-outfit">{m.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-chat-msg-row bot-row"
          >
            <div className="cyber-chat-bubble bot-bubble typing-bubble">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="cyber-chat-footer position-relative z-1">
        <div className="cyber-chat-input-wrap">
          <input
            ref={inputRef}
            type="text"
            className="cyber-chat-input font-outfit"
            placeholder="Ask Kiran about his CV, projects, stack..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <motion.button
            type="button"
            className="cyber-chat-send-btn btn p-0 border-0"
            disabled={!input.trim() || isLoading}
            onClick={() => handleSend()}
            whileHover={input.trim() && !isLoading ? { scale: 1.08 } : {}}
            whileTap={input.trim() && !isLoading ? { scale: 0.92 } : {}}
            aria-label="Send message"
          >
            {isLoading ? (
              <i className="bi bi-arrow-repeat cyber-chat-spin" />
            ) : (
              <i className="bi bi-arrow-up-short cyber-send-arrow-icon" />
            )}
          </motion.button>
        </div>
        <div className="cyber-chat-disclaimer font-outfit">
          Directly grounded in Kiran Chand&apos;s CV & verified projects
        </div>
      </div>
    </motion.div>
  );
}
