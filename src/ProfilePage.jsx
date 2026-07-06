import React, { useEffect, useRef, useState } from "react";
import { t } from "./translations";

const STORAGE_KEY = "finsakhi_profile_v1";

const SAMPLE = {
  name: "Arunima",
  village: "Bengaluru Rural",
  language: "English",
  group: "Self Help Group A",
  phone: "",
  email: "",
  avatarUrl: "",
};

export default function ProfilePage({ lang = 'en-IN' }) {
  const [profile, setProfile] = useState(SAMPLE);
  const [draft, setDraft] = useState(SAMPLE);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        setProfile(obj);
        setDraft(obj);
      }
    } catch {}
  }, []);

  function persist(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function startEdit() {
    setDraft(profile);
    setEditing(true);
    setError("");
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(profile);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function updateField(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function onAvatarPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > 2 * 1024 * 1024) {
      setError("Image too large — pick under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => updateField("avatarUrl", ev.target.result);
    reader.readAsDataURL(f);
  }

  function saveProfile(e) {
    e?.preventDefault();
    if (!draft.name.trim() || !draft.village.trim()) {
      setError("Name and Village are required.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      persist(draft);
      setProfile(draft);
      setEditing(false);
      setLoading(false);
      setToast("Profile updated!");
      setTimeout(() => setToast(""), 2000);
    }, 500);
  }

  return (
    <>
      {/* EMBEDDED CSS — NO NEED TO EDIT index.css */}
      <style>{`
        .profile-wrapper {
          color: var(--text-primary);
          padding: 20px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 20px;
        }
        .profile-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: 20px;
          border-radius: 14px;
          backdrop-filter: blur(6px);
        }
        .avatar-img {
          width: 110px;
          height: 110px;
          border-radius: 14px;
          object-fit: cover;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .avatar-fallback {
          width: 110px;
          height: 110px;
          border-radius: 14px;
          background: var(--accent-gradient);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:42px;
          color: #ffffff;
          font-weight:900;
        }
        .profile-name { font-size: 20px; font-weight: 900; margin-top: 10px; }
        .profile-sub { color: var(--text-secondary); font-size: 14px; margin-top: 2px; }

        .btn {
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn-edit { background: var(--accent-primary); color: #ffffff; box-shadow: 0 4px 12px rgba(79,70,229,0.25); }
        .btn-edit:hover { background: #4338ca; }
        .btn-save { background: #059669; color: #ffffff; }
        .btn-save:hover { background: #047857; }
        .btn-cancel { background: #f1f5f9; color: var(--text-primary); border: 1px solid var(--glass-border); }
        .btn-cancel:hover { background: #e2e8f0; }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-title {
          font-weight: 800;
          color: var(--text-secondary);
        }
        .field-read {
          background: #fff;
          color: var(--text-primary);
          padding: 12px;
          border-radius: 8px;
        }
        .field input, .field select {
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: #fff;
          color: var(--text-primary);
        }
        .form-error {
          color: #ff6b6b;
          font-weight: 700;
        }
        .toast {
          position: fixed;
          right: 22px;
          bottom: 80px;
          background: #059669;
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          z-index: 9999;
          box-shadow: 0 6px 20px rgba(5,150,105,0.35);
        }
        @media(max-width:900px){
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="profile-wrapper">
        <h2 className="card-title">👤 {t('Profile', lang)}</h2>

        <div className="profile-grid">
          {/* LEFT SIDE */}
          <div className="profile-card">
            <div style={{ display: "flex", justifyContent: "center" }}>
              {profile.avatarUrl ? (
                <img
                  src={editing ? draft.avatarUrl || profile.avatarUrl : profile.avatarUrl}
                  className="avatar-img"
                  alt="avatar"
                />
              ) : (
                <div className="avatar-fallback">
                  {profile.name[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-name">{t(profile.name, lang)}</div>
            <div className="profile-sub">{t(profile.village, lang)}</div>

            {/* Buttons */}
            {!editing ? (
              <button className="primary-btn" onClick={startEdit}>✏️ {t('EditProfile', lang)}</button>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="primary-btn" onClick={saveProfile}>
                  {loading ? t('SavingText', lang) : `💾 ${t('Save', lang)}`}
                </button>
                <button className="secondary-btn" onClick={cancelEdit}>{t('CancelBtn', lang)}</button>
              </div>
            )}

            {editing && (
              <>
                <label style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
                  {t('UploadAvatar', lang)}
                </label>
                <input ref={fileRef} type="file" accept="image/*" onChange={onAvatarPick} />
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-card">
            <form style={{ display: "grid", gap: 14 }}>
              {/* Name */}
              <label className="field">
                <span className="field-title">{t('NameLabel', lang)}</span>
                {!editing ? (
                  <div className="field-read">{t(profile.name, lang)}</div>
                ) : (
                  <input value={draft.name} onChange={(e) => updateField("name", e.target.value)} />
                )}
              </label>

              {/* Village */}
              <label className="field">
                <span className="field-title">{t('VillageLabel', lang)}</span>
                {!editing ? (
                  <div className="field-read">{t(profile.village, lang)}</div>
                ) : (
                  <input value={draft.village} onChange={(e) => updateField("village", e.target.value)} />
                )}
              </label>

              {/* Language */}
              <label className="field">
                <span className="field-title">{t('LanguageLabel', lang)}</span>
                {!editing ? (
                  <div className="field-read">{t(profile.language, lang)}</div>
                ) : (
                  <select value={draft.language} onChange={(e) => updateField("language", e.target.value)}>
                     <option value="English">{t('English', lang) || "English"}</option>
                    <option value="Hindi">{t('Hindi', lang) || "Hindi"}</option>
                    <option value="Kannada">{t('Kannada', lang) || "Kannada"}</option>
                    <option value="Tamil">{t('Tamil', lang) || "Tamil"}</option>
                    <option value="Marathi">{t('Marathi', lang) || "Marathi"}</option>
                    <option value="Bengali">{t('Bengali', lang) || "Bengali"}</option>
                  </select>
                )}
              </label>

              {/* Group */}
              <label className="field">
                <span className="field-title">{t('GroupLabel', lang)}</span>
                {!editing ? (
                  <div className="field-read">{t(profile.group, lang)}</div>
                ) : (
                  <input value={draft.group} onChange={(e) => updateField("group", e.target.value)} />
                )}
              </label>

              {error && <div className="form-error">{error}</div>}
            </form>
          </div>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
