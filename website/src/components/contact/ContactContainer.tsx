"use client";

import ContactHeroHeader from "./ContactHeroHeader";
import ContactDirectChannels from "./ContactDirectChannels";
import ContactMessageForm from "./ContactMessageForm";

export default function ContactContainer() {
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
