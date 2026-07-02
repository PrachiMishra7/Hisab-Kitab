import React, { useState } from "react";

export default function HelpSupport() {
  const [showFAQ, setShowFAQ] = useState(false);

  const volunteerNumber = "+911234567890"; // update with real number
  const whatsappNumber = "911234567890";   // use digits only for wa.me
  const defaultMessage = "Hello, I need assistance regarding the Hisab‑Kitab app.";

  // FAQ list (you can fetch from backend later)
  const faqs = [
    {
      q: "How do I reset my PIN?",
      a: "Go to Profile → Settings → Reset PIN. You will receive an OTP to verify."
    },
    {
      q: "How do I contact a volunteer?",
      a: "Use the green 'Call Volunteer' button to connect instantly."
    },
    {
      q: "Is my data safe?",
      a: "Yes, all your data is securely stored and encrypted."
    }
  ];

  function handleWhatsApp() {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  }

  function handleCall() {
    // tel: link triggers phone apps on mobile, dialer on desktops that support it
    window.location.href = `tel:${volunteerNumber}`;
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: 20,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.15)"
        }}
      >
        <h1 style={{ color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: "#ff4d6d",
            padding: "4px 10px",
            borderRadius: 6,
            fontWeight: 700,
            color: "var(--text-primary)"
          }}>SOS</span>
          Help & Support
        </h1>

        <p style={{ marginTop: 10, color: "#ccc" }}>
          Need assistance? Choose an option below:
        </p>

        {/* CALL VOLUNTEER */}
        <div
          onClick={handleCall}
          style={{
            background: "#16a34a",
            padding: 18,
            borderRadius: 12,
            marginTop: 20,
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 600,
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            transition: "all 0.2s"
          }}
        >
          📞 Call Volunteer
        </div>

        {/* WHATSAPP SUPPORT */}
        <div
          onClick={handleWhatsApp}
          style={{
            background: "#2563eb",
            padding: 18,
            borderRadius: 12,
            marginTop: 12,
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 600,
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            transition: "all 0.2s"
          }}
        >
          💬 WhatsApp Support
        </div>

        {/* FAQ */}
        <div
          onClick={() => setShowFAQ(true)}
          style={{
            background: "#ea580c",
            padding: 18,
            borderRadius: 12,
            marginTop: 12,
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 600,
            textAlign: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
            transition: "all 0.2s"
          }}
        >
          ❓ FAQs
        </div>
      </div>

      {/* FAQ MODAL */}
      {showFAQ && (
        <div
          onClick={() => setShowFAQ(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 12,
              maxWidth: 600,
              width: "90%",
              color: "#000"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Frequently Asked Questions</h2>
              <button
                onClick={() => setShowFAQ(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer"
                }}
              >
                ✖
              </button>
            </div>

            {faqs.map((f, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                <strong>{f.q}</strong>
                <p style={{ marginTop: 4 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
