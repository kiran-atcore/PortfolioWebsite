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

// About Slider event channels
export interface AboutSlideStatePayload {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
}

const ABOUT_SLIDE_STATE_EVENT = "portfolio:about-slide-state";
const ABOUT_SLIDE_ACTION_EVENT = "portfolio:about-slide-action";
const ABOUT_SLIDE_REQUEST_EVENT = "portfolio:about-slide-request";

export function publishAboutSlideState(payload: AboutSlideStatePayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ABOUT_SLIDE_STATE_EVENT, { detail: payload }));
}

export function subscribeAboutSlideState(callback: (payload: AboutSlideStatePayload) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<AboutSlideStatePayload>;
    if (custom.detail) callback(custom.detail);
  };
  window.addEventListener(ABOUT_SLIDE_STATE_EVENT, handler);
  window.dispatchEvent(new CustomEvent(ABOUT_SLIDE_REQUEST_EVENT));
  return () => window.removeEventListener(ABOUT_SLIDE_STATE_EVENT, handler);
}

export function publishAboutSlideAction(action: "next" | "prev" | "togglePlay" | number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ABOUT_SLIDE_ACTION_EVENT, { detail: { action } }));
}

export function subscribeAboutSlideAction(callback: (action: "next" | "prev" | "togglePlay" | number) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ action: "next" | "prev" | "togglePlay" | number }>;
    if (custom.detail && custom.detail.action !== undefined) {
      callback(custom.detail.action);
    }
  };
  window.addEventListener(ABOUT_SLIDE_ACTION_EVENT, handler);
  return () => window.removeEventListener(ABOUT_SLIDE_ACTION_EVENT, handler);
}

export function subscribeAboutSlideRequest(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(ABOUT_SLIDE_REQUEST_EVENT, handler);
  return () => window.removeEventListener(ABOUT_SLIDE_REQUEST_EVENT, handler);
}
