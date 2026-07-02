import React, { useEffect, useRef, useState } from "react";

/**
 * Chatbot (Mock Demo)
 * - Frontend-only (no network). Safe for demos/hackathons.
 * - Rule-based replies + friendly fallback.
 * - Simulated typing delay and optional speech synthesis.
 * - Persists chat to localStorage (key: "finsakhi_demo_chat")
 *
 * Usage: import Chatbot from './Chatbot' and render <Chatbot lang="en-IN" speak={true} />
 */

const STORAGE = "finsakhi_demo_chat_v1";

function mockResponder(message, lang = "en-IN", verbosity = "short") {
  // normalize
  const t = String(message || "").toLowerCase().trim();

  // greetings
  if (/(hi|hello|hey|namaste|नमस्ते|hola)/i.test(t)) {
    return verbosity === "short"
      ? "Hello! How can I help you today?"
      : "Hi — I'm your assistant. I can help with balance info, transactions, KYC steps or basic finance tips.";
  }

  // balance
  if (t.includes("balance") || t.includes("बैलेंस") || t.includes("balance?")) {
    return verbosity === "short"
      ? "Your balance: ₹5,000 (demo)."
      : "Demo balance: ₹5,000. This is a mock value for the demo app — real balances come from the bank backend.";
  }

  // send money (e.g., "send 200 to sita")
  if (/send|transfer|pay|पे(श)?|पैसे/.test(t) && /\d+/.test(t)) {
    const amtMatch = t.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
    const amt = amtMatch ? amtMatch[1] : "the amount";
    return `Confirming: send ₹${amt} — (demo only, will not actually transfer).`;
  }

  // KYC
  if (/kyc|aadhar|upload|verify|सत्यापित/.test(t)) {
    return verbosity === "short"
      ? "To complete KYC, upload Aadhaar under KYC page. You'll get a receipt (demo)."
      : "KYC demo steps: 1) Go to KYC page. 2) Upload Aadhaar image. 3) Click 'Submit'. The app will show a receipt (demo mode only).";
  }

  // help / how to
  if (/how|help|किया|क्या|what can you do|support/.test(t)) {
    return "I can show demo balances, explain how to upload KYC, and simulate sending money. Try: 'balance', 'send 200 to Sita', or 'how to upload KYC'.";
  }

  // thanks / bye
  if (/(thanks|thank you|thanks!|धन्यवाद|bye|goodbye)/i.test(t)) {
    return "You're welcome — glad to help!";
  }

  // language-based small talk (demo)
  if (/kaise|कैसे|kya/.test(t)) {
    return "Main theek hoon — aap bataiye. (Demo reply)";
  }

  // fallback: echo + suggestion
  if (t.length < 40) {
    return `I didn't quite get that. Try 'balance' or 'send 200 to Sita'.`;
  }
  return `Sorry, I couldn't understand fully. Try simple commands like 'balance', 'send 100', or 'how to upload KYC'.`;
}

export default function Chatbot({ lang = "en-IN", speak = true }) {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      return raw ? JSON.parse(raw) : [{ who: "bot", text: "Hi — I'm your demo assistant. Try 'balance' or 'send 200 to Sita'." }];
    } catch {
      return [{ who: "bot", text: "Hi — I'm your demo assistant. Try 'balance' or 'send 200 to Sita'." }];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // bot typing
  const [verbosity, setVerbosity] = useState("short"); // 'short' or 'long'
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // persist messages
    try {
      localStorage.setItem(STORAGE, JSON.stringify(messages));
    } catch {}
    // scroll to bottom
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight + 200;
  }, [messages]);

  function pushMessage(who, text) {
    setMessages((m) => [...m, { who, text, ts: Date.now() }]);
  }

  function speakText(text) {
    if (!speak) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || "en-IN";
      u.rate = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // ignore
    }
  }

  async function handleSend(text) {
    if (!text || loading) return;
    const userText = text.trim();
    pushMessage("user", userText);
    setInput("");
    setLoading(true);

    // simulate "thinking" with variable delay
    const delay = 500 + Math.min(1600, Math.max(300, userText.length * 30));
    await new Promise((res) => setTimeout(res, delay));

    // get mock reply
    const reply = mockResponder(userText, lang, verbosity);

    pushMessage("bot", reply);
    speakText(reply);
    setLoading(false);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
  }

  function clearConversation() {
    setMessages([{ who: "bot", text: "Demo assistant reset. Try 'balance' or 'send 200 to Sita'." }]);
    localStorage.removeItem(STORAGE);
  }

  // embedded CSS (self-contained)
  const css = `
    .demo-chat { max-width:880px; margin:10px auto; color: var(--text-primary); }
    .chat-card { background: #ffffff; padding:16px; border-radius:12px; border:1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
    .chat-header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; }
    .chat-header strong { font-size:16px; color: var(--text-primary); }
    .muted { color: var(--text-secondary); font-weight:500; font-size:13px; margin-top:2px; }
    .chat-window { min-height:220px; max-height:360px; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:10px; border-radius:10px; background: #f8fafc; border: 1px solid var(--glass-border); }
    .msg { max-width:78%; padding:10px 14px; border-radius:14px; font-size:14.5px; line-height:1.5; font-weight:500; }
    .msg.user { align-self:flex-end; background: var(--accent-gradient); color: #ffffff; border-bottom-right-radius:4px; box-shadow: 0 4px 12px var(--accent-glow); }
    .msg.bot { align-self:flex-start; background: #ffffff; border: 1px solid var(--glass-border); color: var(--text-primary); border-bottom-left-radius:4px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
    .typing { font-style:italic; color: var(--text-muted); }
    .input-row { display:flex; gap:8px; margin-top:10px; }
    .input-row input { flex:1; padding:10px 14px; border-radius:10px; border:1.5px solid var(--glass-border); background: #ffffff; color: var(--text-primary); font-size:14px; }
    .input-row input::placeholder { color: var(--text-muted); }
    .input-row input:focus { outline:none; border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    .btn { padding:10px 16px; border-radius:10px; border:0; cursor:pointer; font-weight:700; font-size:14px; transition: all 0.2s; }
    .btn.send { background: var(--accent-primary); color: #ffffff; }
    .btn.send:hover { background: #4338ca; transform: translateY(-1px); }
    .btn.clear { background: #ffffff; color: var(--text-primary); border: 1.5px solid var(--glass-border); }
    .btn.clear:hover { background: #f1f5f9; border-color: #94a3b8; }
    .toolbar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .small { font-size:12.5px; color: var(--text-secondary); }
    .controls { display:flex; gap:8px; align-items:center; }
    .controls select { width:auto; padding:6px 10px; font-size:13px; border-radius:8px; border:1.5px solid var(--glass-border); background:#ffffff; color: var(--text-primary); }
    @media (max-width:720px){ .chat-window{ max-height:280px; } }
  `;

  return (
    <div className="demo-chat">
      <style>{css}</style>

      <div className="chat-card">
        <div className="chat-header">
          <div>
            <strong style={{ fontSize: 18 }}>Demo Assistant (Mock)</strong>
            <div className="muted">For hackathon showcase — offline demo. Language: {lang}</div>
          </div>

          <div className="toolbar">
            <div className="controls small" style={{ gap: 8 }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="checkbox" checked={speak} readOnly style={{ transform: "scale(1.05)" }} />
                <span className="small">TTS</span>
              </label>
              <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <select value={verbosity} onChange={(e) => setVerbosity(e.target.value)} style={{ borderRadius: 8, padding: "6px 8px" }}>
                  <option value="short">Short replies</option>
                  <option value="long">Verbose replies</option>
                </select>
              </label>
              <button className="btn clear" onClick={() => setShowSettings((s) => !s)}>{showSettings ? "Hide" : "Settings"}</button>
              <button className="btn clear" onClick={clearConversation}>Reset</button>
            </div>
          </div>
        </div>

        <div className="chat-window" ref={containerRef} aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.who === "user" ? "user" : "bot"}`}>
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="msg bot typing">Assistant is typing…</div>
          )}
        </div>

        <form className="input-row" onSubmit={(e) => { e.preventDefault(); handleSubmitInput(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: 'balance' or 'send 200 to Sita' — demo only"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitInput();
              }
            }}
          />
          <button
            type="button"
            className="btn send"
            onClick={() => handleSubmitInput()}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "…" : "Send"}
          </button>
        </form>

        {showSettings && (
          <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 13 }}>
            <div style={{ marginBottom: 6 }}><strong>Demo settings</strong></div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn clear" onClick={() => { pushMessage("bot", "Here are example prompts: 'balance', 'send 100 to Sita', 'how to upload KYC'"); }}>
                What can I ask?
              </button>
              <button className="btn clear" onClick={() => { pushMessage("bot", "Tip: This is a mock assistant for demo only — it won't reach any bank or KYC system."); }}>
                Show tip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // local helper to avoid inline re-creation
  function handleSubmitInput() {
    if (!input.trim()) return;
    handleSend(input.trim());
  }
}
