"use client";

import React, { useEffect, useState } from "react";
import SlideTelemetry3DCanvas from "./SlideTelemetry3DCanvas";
import {
  subscribeSlideState,
  publishSlideSelect,
  SlideStatePayload,
} from "@/lib/slideEvents";

interface SlideTelemetryHUDProps {
  currentSlide?: number;
  totalSlides?: number;
  onSlideSelect?: (index: number) => void;
  className?: string;
}

export default function SlideTelemetryHUD({
  currentSlide: propCurrent,
  totalSlides: propTotal,
  onSlideSelect,
  className = "",
}: SlideTelemetryHUDProps) {
  const [internalSlide, setInternalSlide] = useState(0);
  const [internalTotal, setInternalTotal] = useState(6);

  useEffect(() => {
    const unsub = subscribeSlideState((data: SlideStatePayload) => {
      setInternalSlide(data.currentSlide);
      setInternalTotal(data.totalSlides);
    });
    return unsub;
  }, []);

  const activeSlide = typeof propCurrent === "number" ? propCurrent : internalSlide;
  const safeTotal = Math.max(typeof propTotal === "number" ? propTotal : internalTotal, 1);
  const progressPercent = safeTotal > 1 ? ((activeSlide + 1) / safeTotal) * 100 : 100;

  const handleNext = () => {
    const nextIdx = (activeSlide + 1) % safeTotal;
    if (onSlideSelect) onSlideSelect(nextIdx);
    publishSlideSelect(nextIdx);
  };

  return (
    <button
      style={{ transform: "scale(0.8)" }}
      type="button"
      onClick={handleNext}
      className={`mb-2 frameless-slide-telemetry-btn ${className}`}
      title="Click to advance slide"
      aria-label={`Slide ${activeSlide + 1} of ${safeTotal}. Click to advance.`}
    >
      {/* Free-Floating 3D Gyro */}
      <div className="frameless-gyro-slot" aria-hidden="true">
        <SlideTelemetry3DCanvas currentSlide={activeSlide} totalSlides={safeTotal} />
      </div>

      {/* Free-Floating Mono Readout & Glowing Hairline */}
      <div className="frameless-telemetry-body">
        <div className="frameless-telemetry-digits font-mono">
          <span className="frameless-digit-curr">{(activeSlide + 1).toString().padStart(2, "0")}</span>
          <span className="frameless-digit-sep">/</span>
          <span className="frameless-digit-total">{safeTotal.toString().padStart(2, "0")}</span>
        </div>
        <div className="frameless-progress-rail" aria-hidden="true">
          <div
            className="frameless-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </button>
  );
}
