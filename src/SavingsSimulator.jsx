import React, { useMemo, useState } from "react";

/**
 * SavingsSimulator — translated page
 * Accepts: lang (string) like 'en-IN', 'hi-IN', etc.
 * Falls back to 'en-IN' when missing.
 *
 * This page:
 *  - shows a hero + summary translated
 *  - renders example savings cards (each card title + desc translated)
 *  - allows quick local language switch (page-level only)
 */

const translations = {
  "en-IN": {
    pageTitle: "Savings Simulator",
    subtitle: "Visualize simple savings plans and monthly goals.",
    examplesTitle: "Example Plans",
    examples: [
      { id: "monthly-goal", title: "Monthly Goal Saver", desc: "Save ₹2,000 every month to build an emergency fund." },
      { id: "child-edu", title: "Child Education", desc: "Put aside a small amount each month for education expenses." },
      { id: "festival-fund", title: "Festival Fund", desc: "Save for festival purchases with a small weekly deposit." }
    ],
    simulateBtn: "Simulate",
    amountLabel: "Monthly amount (₹)",
    monthsLabel: "Months",
    resultTitle: "Projected total",
    backBtn: "Back"
  },
  "hi-IN": {
    pageTitle: "सहेजें सिम्युलेटर",
    subtitle: "सरल बचत योजनाओं और मासिक लक्ष्यों का पूर्वावलोकन करें।",
    examplesTitle: "उदाहरण योजनाएँ",
    examples: [
      { id: "monthly-goal", title: "मासिक लक्ष्य बचत", desc: "आपातकालीन कोष के लिए हर महीने ₹2,000 बचाएँ।" },
      { id: "child-edu", title: "बच्चे की शिक्षा", desc: "शैक्षिक खर्चों के लिए हर महीने थोड़ा सुरक्षित रखें।" },
      { id: "festival-fund", title: "त्योहार फंड", desc: "त्योहारों के लिए साप्ताहिक छोटी जमा से बचत करें।" }
    ],
    simulateBtn: "सिम्युलेट करें",
    amountLabel: "मासिक राशि (₹)",
    monthsLabel: "महीने",
    resultTitle: "अनुमानित कुल",
    backBtn: "वापस"
  },
  "kn-IN": {
    pageTitle: "ಸೇವಿಂಗ್ ಸಿಮ್ಯುಲೇಟರ್",
    subtitle: "ಸರಳ ಉಳಿತಾಯ ಯೋಜನೆಗಳನ್ನು ಮತ್ತು ಮಾಸಿಕ ಗುರಿಗಳನ್ನು ನೋಡಿ.",
    examplesTitle: "ಉದಾಹರಣೆ ಯೋಜನೆಗಳು",
    examples: [
      { id: "monthly-goal", title: "ಮಾಸಿಕ ಗುರಿ ಉಳಿತಾಯ", desc: "ಓ ಅನಾವಣೆಗೆ ₹2,000 ಪ್ರತಿ ತಿಂಗಳು ಉಳಿತಾಯ ಮಾಡಿ." },
      { id: "child-edu", title: "ಮಕ್ಕಳ ಶಿಕ್ಷಣ", desc: "ಶೈಕ್ಷಣಿಕ ಖರ್ಚುಗಳಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ಸ್ವಲ್ಪವೊಂದು ಉಳಿತಾಯ ಮಾಡಿ." },
      { id: "festival-fund", title: " ಹಬ್ಬ ನಿಧಿ", desc: "ಹಬ್ಬಗಳಿಗಾಗಿ ಸಣ್ಣ ವಾರದ ಠೇವಣಿ ಮೂಲಕ ಉಳಿತಾಯ ಮಾಡಿ." }
    ],
    simulateBtn: "ಅನುವ್ಯೆಖ ಮಾಡಿ",
    amountLabel: "ಮಾಸಿಕ ಮೊತ್ತ (₹)",
    monthsLabel: "ತಿಂಗಳು",
    resultTitle: "ಪ್ರಕಟಿತ ಒಟ್ಟು",
    backBtn: "ಹಿಂತಿರುಗಿ"
  },
  "ta-IN": {
    pageTitle: "சேமிப்பு சிமுலேட்டர்",
    subtitle: "எளிய சேமிப்பு திட்டங்கள் மற்றும் மாத இலக்குகளை காட்சி படுத்துங்கள்.",
    examplesTitle: "உதாரண திட்டங்கள்",
    examples: [
      { id: "monthly-goal", title: "மாத இலக்கு சேமிப்பு", desc: "அவசர நிதிக்கு மாதம் ₹2,000 சேமிக்கவும்." },
      { id: "child-edu", title: "குழந்தை கல்வி", desc: "கல்விச்செலவுகளுக்கு மாதத்திற்கு சிறிது சேமிக்கவும்." },
      { id: "festival-fund", title: "பண்டிகை நிதி", desc: "சிறிய வாரந்தோறும் வைப்பு மூலம் பண்டிகைகளுக்கு சேமிக்கவும்." }
    ],
    simulateBtn: "சிமுலேட்",
    amountLabel: "மாத தொகை (₹)",
    monthsLabel: "மாசங்கள்",
    resultTitle: "முன்னறிவு மொத்தம்",
    backBtn: "பின்"
  },
  "mr-IN": {
    pageTitle: "बचत सिम्युलेटर",
    subtitle: "सोपी बचत योजना आणि मासिक लक्ष्यांची कल्पना घ्या.",
    examplesTitle: "उदाहरण योजना",
    examples: [
      { id: "monthly-goal", title: "मासिक लक्ष्य बचत", desc: "आपत्कालीन निधीसाठी दर महिन्याला ₹2,000 बचत करा." },
      { id: "child-edu", title: "मुलांची शैक्षणिक", desc: "शिक्षण खर्चासाठी दर महिन्याला थोडी रक्कम जमा करा." },
      { id: "festival-fund", title: "सण निधी", desc: "सणांसाठी साप्ताहिक लहान ठेवी करून बचत करा." }
    ],
    simulateBtn: "अनुकरण करा",
    amountLabel: "मासिक रक्कम (₹)",
    monthsLabel: "महिने",
    resultTitle: "प्रकल्पित एकूण",
    backBtn: "मागे"
  },
  "bn-IN": {
    pageTitle: "সেভিংস সিম্যুলেটর",
    subtitle: "সরল সঞ্চয়ের পরিকল্পনা এবং মাসিক লক্ষ্যের ভবিষ্যদর্শন করুন।",
    examplesTitle: "উদাহরণ পরিকল্পনা",
    examples: [
      { id: "monthly-goal", title: "মাসিক লক্ষ্য সেভার", desc: "জরুরি তহবিলের জন্য প্রতি মাসে ₹2,000 সঞ্চয় করুন।" },
      { id: "child-edu", title: "শিশুর শিক্ষা", desc: "শিক্ষাগত ব্যয়ের জন্য প্রতি মাসে অল্প অল্প করে সঞ্চয় করুন।" },
      { id: "festival-fund", title: "উৎসব তহবিল", desc: "উৎসবের জন্য সাপ্তাহিক ছোট আমানত করে সঞ্চয় করুন।" }
    ],
    simulateBtn: "সিমুলেট",
    amountLabel: "মাসিক পরিমাণ (₹)",
    monthsLabel: "মাস",
    resultTitle: "প্রজেক্ট মোট",
    backBtn: "ফিরে যান"
  }
};

// helper to read translation safely
function t(lang, path) {
  const data = translations[lang] || translations["en-IN"];
  return data[path];
}

export default function SavingsSimulator({ lang = "en-IN" }) {
  // local page-level language override (optional)
  const [pageLang, setPageLang] = useState(lang || "en-IN");

  // simulator inputs
  const [amount, setAmount] = useState(2000);
  const [months, setMonths] = useState(12);
  const [result, setResult] = useState(null);
  const strings = translations[pageLang] || translations["en-IN"];

  // memoized examples (translated)
  const examples = useMemo(() => {
    return (strings.examples || []).map(ex => ({ ...ex }));
  }, [pageLang]);

  function runSimulation(e) {
    e?.preventDefault?.();
    const monthly = Number(amount) || 0;
    const m = Number(months) || 0;
    const total = monthly * m;
    setResult({ total, monthly, months: m });
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", color: "#fff" }}>
      <div className="card hero-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>{strings.pageTitle}</h1>
          <p style={{ opacity: 0.9, marginTop: 6 }}>{strings.subtitle}</p>
        </div>

        <div style={{ minWidth: 220 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 8 }}>{/* local switch label */}Language</label>
          <select value={pageLang} onChange={e => setPageLang(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8 }}>
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="kn-IN">ಕನ್ನಡ</option>
            <option value="ta-IN">தமிழ்</option>
            <option value="mr-IN">मराठी</option>
            <option value="bn-IN">বাংলা</option>
          </select>
        </div>
      </div>

      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 340px", marginTop: 16 }}>
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{strings.examplesTitle}</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {examples.map(ex => (
                <article key={ex.id} className="card" style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{ex.title}</div>
                      <div style={{ opacity: 0.85, marginTop: 6 }}>{ex.desc}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => { setAmount( ex.id === "monthly-goal" ? 2000 : ex.id === "child-edu" ? 500 : 300 ); setMonths(12); }}
                        style={{ background: "linear-gradient(90deg,#36d07b,#16a86b)", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>{strings.simulateBtn}</h3>
            <form onSubmit={runSimulation} style={{ display: "grid", gap: 10 }}>
              <label>{strings.amountLabel}</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: 10, borderRadius: 8 }} />

              <label>{strings.monthsLabel}</label>
              <input type="number" value={months} onChange={e => setMonths(e.target.value)} style={{ padding: 10, borderRadius: 8 }} />

              <button type="submit" style={{ background: "linear-gradient(90deg,#2fb2ff,#0b82e6)", color: "#fff", padding: "10px 12px", borderRadius: 8, border: 0 }}>
                {strings.simulateBtn}
              </button>
            </form>

            {result && (
              <div style={{ marginTop: 12, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{strings.resultTitle}</div>
                <div style={{ marginTop: 6 }}>₹{result.total.toLocaleString()}</div>
                <div style={{ marginTop: 8, color: "rgba(255,255,255,0.8)" }}>
                  {result.months} × ₹{result.monthly} = ₹{result.total.toLocaleString()}
                </div>
                <button onClick={() => setResult(null)} style={{ marginTop: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.06)", padding: "8px 10px", borderRadius: 8 }}>
                  {strings.backBtn}
                </button>
              </div>
            )}
          </div>

          <div style={{ height: 12 }} />

          <div className="card">
            <div style={{ fontWeight: 800 }}>Tip</div>
            <div style={{ marginTop: 6, opacity: 0.9 }}>
              Use the example plans to quickly prefill values and press <strong>{strings.simulateBtn}</strong>.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
