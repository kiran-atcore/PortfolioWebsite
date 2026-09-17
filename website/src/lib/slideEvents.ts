// Custom event bus for synchronizing slide telemetry across decoupled components
export interface SlideStatePayload {
  currentSlide: number;
  totalSlides: number;
}

const SLIDE_STATE_EVENT = "portfolio:slide-state";
const SLIDE_SELECT_EVENT = "portfolio:slide-select";
const SLIDE_REQUEST_EVENT = "portfolio:slide-request";

export function publishSlideState(payload: SlideStatePayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SLIDE_STATE_EVENT, { detail: payload }));
}

export function subscribeSlideState(callback: (payload: SlideStatePayload) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<SlideStatePayload>;
    if (custom.detail) callback(custom.detail);
  };
  window.addEventListener(SLIDE_STATE_EVENT, handler);
  // Also request current state immediately in case HomeHero is already mounted
  window.dispatchEvent(new CustomEvent(SLIDE_REQUEST_EVENT));
  return () => window.removeEventListener(SLIDE_STATE_EVENT, handler);
}

export function publishSlideSelect(index: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SLIDE_SELECT_EVENT, { detail: { index } }));
}

export function subscribeSlideSelect(callback: (index: number) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ index: number }>;
    if (custom.detail && typeof custom.detail.index === "number") {
      callback(custom.detail.index);
    }
  };
  window.addEventListener(SLIDE_SELECT_EVENT, handler);
  return () => window.removeEventListener(SLIDE_SELECT_EVENT, handler);
}

export function subscribeSlideRequest(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(SLIDE_REQUEST_EVENT, handler);
  return () => window.removeEventListener(SLIDE_REQUEST_EVENT, handler);
}
