"use client";

import { useEffect, useLayoutEffect } from "react";
import ContactHeroHeader from "./ContactHeroHeader";
import ContactDirectChannels from "./ContactDirectChannels";
import ContactMessageForm from "./ContactMessageForm";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ContactContainer() {
  useIsomorphicLayoutEffect(() => {
    // Instantly land on top section of contact page before browser paint
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="contact-page-container container my-auto">
      {/* Section 1: Header & Direct Channels */}
      <section
        id="contact-channels-section"
        className="contact-section-viewport position-relative"
      >
        <ContactHeroHeader />
        <ContactDirectChannels />
      </section>

      {/* Section 2: Direct Message Form */}
      <section
        id="contact-message-section"
        className="contact-section-viewport position-relative"
      >
        <ContactMessageForm />
      </section>
    </div>
  );
}
