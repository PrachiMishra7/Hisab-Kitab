// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'
import TextFallback from './TextFallback'
import TTSControls from './TTSControls'
import SchemesPage from './SchemesPage'
import TransactionsPage from './TransactionsPage'
import SavingsSimulator from './SavingsSimulator'
import KYCPage from './KYCPage'
import EducationHub from './EducationHub'
import HelpSupport from './HelpSupport'
import ProfilePage from './ProfilePage'
import AppShell from './AppShell'
import Chatbot from './Chatbot' // Chatbot (mock/demo) imported

// inside src/App.jsx (add near top, below imports)
// put this near the top of src/App.jsx (below imports)
// MiniChat component - paste below imports in src/App.jsx
function MiniChat({ lang = 'en-IN', speak = false }) {
  // wrapper
  const outer = {
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
    marginTop: 16,
  };

  // card
  const card = {
    width: 360,
    maxWidth: '92vw',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(2,6,23,0.6)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
    border: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'Inter, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  // header
  const header = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)',
    color: '#fff',
  };

  const avatarWrap = {
    width: 46,
    height: 46,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.12)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    flex: '0 0 46px'
  };

  const title = { fontWeight: 800, fontSize: 15, lineHeight: 1 };
  const subtitle = { fontSize: 11, opacity: 0.92, marginTop: 3 };

  // body: clamp & scroll
  const bodyWrap = {
    padding: 12,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(255,255,255,0.008))',
    minHeight: 160,
    maxHeight: 320,       // adjust as needed
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  // ensure inner chat doesn't overflow horizontally
  const innerChatWrapper = {
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
  };

  const footer = {
    padding: '8px 12px',
    borderTop: '1px solid rgba(255,255,255,0.03)',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.01)'
  };

  return (
    <div style={outer}>
      <div style={card} role="region" aria-label="Mini Chatbot">
        <div style={header}>
          <div style={avatarWrap} aria-hidden>
            <span style={{ fontSize: 20 }}>🤖</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={title}>Mini Assistant</div>
            <div style={subtitle}>Chatbot Demo • {lang}</div>
          </div>

          <div>
            <button
              onClick={() => {
                // placeholder: you can hook this up to reset Chatbot via refs/context
                console.log('MiniChat: reset pressed');
                // optional: dispatch a custom event if Chatbot listens for it:
                // window.dispatchEvent(new CustomEvent('miniChatReset'));
              }}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12
              }}
              title="Reset demo"
            >
              Reset
            </button>
          </div>
        </div>

        <div style={bodyWrap}>
          <div style={innerChatWrapper}>
            {/* Wrap Chatbot to constrain its layout.
                Pass compact=true so Chatbot can render a slim UI (if it supports that prop).
                If Chatbot doesn't support 'compact', it will still render — wrapper prevents overflow.
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Chatbot lang={lang} speak={speak} compact={true} />
            </div>
          </div>
        </div>

        <div style={footer}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Offline demo • safe for showcase</div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigator.clipboard?.writeText("Try: 'balance' or 'send 200 to Sita'")}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 12
              }}
            >
              Copy sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const SAMPLE_COMMANDS = {
  "en-IN": ["balance", "send 200 to Sita", "which schemes are for me"],
  "hi-IN": ["पैसे भेजो", "बैलेंस बताओ", "कौन सा योजना मिल सकती है"],
  "kn-IN": ["ಹಣ ಕಳುಹಿಸಿ", "ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಸಿ", "ಯೋಜನೆಗಳಿವ"],
  "ta-IN": ["பணம் அனுப்பு", "பண விவரம்", "யோஜனைகள் என்ன"],
  "mr-IN": ["पैसे पाठवा", "बॅलन्स सांगा", "कोणती योजना मिळेल"],
  "bn-IN": ["টাকা দাও", "ব্যালেন্স জানাও", "কোনো স্কিম আছে"]
}

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'bn-IN', label: 'Bengali' },
];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function App(){
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const [lang, setLang] = useState('en-IN')
  const [ttsRate, setTtsRate] = useState(1)
  const [route, setRoute] = useState('home')

  const lastBotRef = useRef('')
  const recognitionRef = useRef(null)
  const autoStopTimerRef = useRef(null)

  function addMessage(text, who='bot'){
    setMessages(m => [...m, {who, text}])
    if(who==='bot') lastBotRef.current = text
  }

  function speakText(text){
    if(!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = ttsRate || 1
    window.speechSynthesis.speak(u)
  }

  function handleRepeat(){
    if(lastBotRef.current) speakText(lastBotRef.current)
  }

  function toggleListen(){
    setIsListening(l => {
      const next = !l
      // If starting, start auto-stop timer (safety)
      if(next) {
        if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current)
        autoStopTimerRef.current = setTimeout(() => setIsListening(false), 12000) // auto-stop after 12s
      } else {
        if (autoStopTimerRef.current) { clearTimeout(autoStopTimerRef.current); autoStopTimerRef.current = null }
      }
      return next
    })
  }

  // EFFECT HOOK TO MANAGE SPEECH RECOGNITION LIFECYCLE
  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang; // Recognition language is set by state
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage(transcript, 'user');
      processText(transcript);
      setIsListening(false); 
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
         addMessage("Microphone access denied. Please enable it in your browser settings.", 'bot');
      } else {
         addMessage("I couldn't hear you. Please try again.", 'bot');
      }
    };

    recognition.onend = () => {
      // ensure listening state remains consistent
      if(isListening) {
          setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition; 

    return () => {
      try { recognition.stop(); } catch(e) {}
    };
  }, [lang]); // Re-initialize recognition when language changes

  // EFFECT HOOK TO START/STOP LISTENING BASED ON STATE
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        if (e.message !== 'recognition has already started') {
          console.error("Error starting recognition:", e);
        }
      }
    } else {
      try { recognition.stop(); } catch(e) {}
    }
  }, [isListening]); 


  async function processText(text){
    const t = text.toLowerCase()
    const balanceKeywords = ['balance','बैलेंस','ಬ್ಯಾಲೆನ್ಸ್','பண','ব্যালেন্স','बॅलन्स']
    const sendKeywords = ['send','transfer','pay','पैसे','ಕಳುಹಿಸಿ','पाठवा','টাকা','ಅನುಪ್ಪು']
    const schemeKeywords = ['scheme','योजना','ಯೋಜನೆ','யோஜனை','স্কিম','कोण']
    const kycKeywords = ['kyc','aadhar','id','verify','सत्यापित','ನವೀಕರಣ','உறுতিசெய்']

    if(balanceKeywords.some(k=>t.includes(k))){
      const rep = "Your balance is ₹5000"
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(sendKeywords.some(k=>t.includes(k)) && /\d+/.test(t)){
      const amount = t.match(/(\d+)/)[1]
      const beneficiary = 'saved contact'
      const confirm = `Confirm: send ₹${amount} to ${beneficiary}?`
      addMessage(confirm,'bot'); speakText(confirm); return
    }
    if(schemeKeywords.some(k=>t.includes(k))){
      const rep = "You are eligible for 2 schemes: PMJDY and Sukanya Samriddhi"
      addMessage(rep,'bot'); speakText(rep); return
    }
    if(kycKeywords.some(k=>t.includes(k))){
      const rep = "KYC verification required. Please upload Aadhaar."
      addMessage(rep,'bot'); speakText(rep); return
    }

    const def = {
      "en-IN":"I didn't understand fully. Try 'balance' or 'send 200 to Sita'.",
      "hi-IN":"मैं समझा नहीं। कहें: 'बैलेंस' या 'पैसे भेजो'।",
      "kn-IN":"ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. 'ಬ್ಯಾಲೆನ್ಸ್' ಅಥವಾ 'ಹಣ ಕಳುಹಿಸಿ' ಹೇಳಿ.",
      "ta-IN":"நான் புரிந்துகொள்ளவில்லை. 'பண விவரம்' அல்லது 'பணம் அனுப்பு' என்று சொல்.",
      "mr-IN":"मला समजले नाही। 'बॅलन्स' किंवा 'पैसे पाठवा' म्हणा।",
      "bn-IN":"আমি বুঝতে পারিনি। বলুন: 'ব্যালেন্স' বা 'টাকা দাও'।"
    }
    const reply = def[lang]||def['en-IN']
    addMessage(reply,'bot'); speakText(reply)
  }

  function renderSamples(){
    const list = SAMPLE_COMMANDS[lang] || SAMPLE_COMMANDS['en-IN']
    return list.map((s,i)=> <div key={i} className='sample'>{s}</div>)
  }

  function DiagnosticsPanel({ onTestTranscript }) {
    const [txt, setTxt] = useState('')
    return (
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-title">Diagnostics</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            value={txt}
            onChange={e => setTxt(e.target.value)}
            placeholder="Type test transcript"
            style={{ flex: 1, padding: 8 }}
          />
          <button
            className="icon-btn"
            onClick={() => { if (txt.trim()) { onTestTranscript(txt.trim()); setTxt('') } }}
          >
            Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      
      <AppShell route={route} setRoute={setRoute}>
        
        {/* Render selected page */}
        {route === 'home' ? (
          <main>
            <section className="card">
              <div className="actions-header">
                <div className="avatar">👩🏽‍💼</div>
                <div>
                  <div className="instructions">Ask me anything about your money</div>
                  <div className="samples" aria-hidden="true">
                    {renderSamples()}
                  </div>
                  
                  {/* 👇 Language Selector UI */}
                  <div className="card" style={{ marginTop: 12 }}>
                    <div className="card-title">Select Language</div>
                    <select 
                      value={lang} 
                      onChange={(e) => setLang(e.target.value)}
                      style={{ marginTop: 8, padding: 10, width: '100%', color: '#fff', background: 'rgba(255,255,255,0.06)' }}
                    >
                      {LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* 👆 END Language Selector UI */}

                  <DiagnosticsPanel
                    onTestTranscript={(txt) => { addMessage(txt, 'user'); processText(txt); }}
                  />

                  <TextFallback
                    templates={SAMPLE_COMMANDS[lang]}
                    onSubmit={(txt) => { addMessage(txt, 'user'); processText(txt); }}
                  />

                  <TTSControls
                    rate={ttsRate}
                    onChangeRate={(r) => setTtsRate(r)}
                    onRepeat={handleRepeat}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <h2 className="card-title">Conversation</h2>
              <div className="conversation" aria-live="polite">
                <div className="messages">
                  {messages.map((m, i)=>(<div key={i} className={`msg ${m.who==='user'?'user':'bot'}`}>{m.text}</div>))}
                </div>
              </div>
            </section>

            {/* ----------------- Mini Chatbot (embedded inside Home) ----------------- */}
<section style={{ marginTop: 20 }}>
  <div style={{ display: "flex", justifyContent: "center" }}>
    
    <div
      aria-hidden={false}
      style={{
        width: 360,
        borderRadius: 12,
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
      }}
    >

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "linear-gradient(90deg,#235dff,#8b5cf6)",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 22,
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          🤖
        </div>

        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Mini Assistant</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>Chatbot Demo • {lang}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 12 }}>
        <Chatbot lang={lang} speak={false} />
      </div>
    </div>

  </div>
</section>
{/* ----------------------------------------------------------------------- */}

          </main>
        ) : route === 'transactions' ? (
          <TransactionsPage lang={lang} /> // ✅ lang prop added
        ) : route === 'schemes' ? (
          <SchemesPage lang={lang} />      // ✅ lang prop added
        ) : route === 'savings' ? (
          <SavingsSimulator lang={lang} /> // ✅ lang prop added
        ) : route === 'kyc' ? (
          <KYCPage lang={lang} />          // ✅ lang prop added
        ) : route === 'education' ? (
          <EducationHub lang={lang} />     // ✅ lang prop added
        ) : route === 'help' ? (
          <HelpSupport lang={lang} />      // KEEP HelpSupport intact
        ) : route === 'profile' ? (
          <ProfilePage lang={lang} />      // ✅ lang prop added
        ) : null}

      </AppShell>

      {/* ---------- Centered Mic Button (improved & accessible) ---------- */}
      <div className="mic-float" aria-hidden={false}>
        <button
          role="button"
          title="Toggle voice input"
          aria-pressed={isListening ? "true" : "false"}
          className={`mic-btn ${isListening ? "listening" : ""}`}
          onClick={toggleListen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleListen();
            }
          }}
        >
          {/* animated waves (behind) */}
          <span className="mic-waves" aria-hidden="true" />

          {/* mic icon */}
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM12 17v4" />
          </svg>

          {/* label */}
          <span>{isListening ? "Listening..." : "Speak"}</span>
        </button>
      </div>
    </div>
  )
}
