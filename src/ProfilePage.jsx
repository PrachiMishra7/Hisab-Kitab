import React, { useEffect, useRef, useState } from "react";

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

export default function ProfilePage() {
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
          color: #eaf6ff;
          padding: 20px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 20px;
        }
        .profile-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 14px;
          backdrop-filter: blur(6px);
        }
        .avatar-img {
          width: 110px;
          height: 110px;
          border-radius: 14px;
          object-fit: cover;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .avatar-fallback {
          width: 110px;
          height: 110px;
          border-radius: 14px;
          background: linear-gradient(135deg,#ff007a,#00d4ff);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:42px;
          color:#fff;
          font-weight:900;
        }
        .profile-name { font-size: 20px; font-weight: 900; margin-top: 10px; }
        .profile-sub { color: #bcd4e6; font-size: 14px; margin-top: 2px; }

        .btn {
          padding: 10px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          border: none;
        }
        .btn-edit { background: #4caf50; color:#fff; }
        .btn-save { background: #1b6ed1; color:#fff; }
        .btn-cancel { background:#fff; color:#000; }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-title {
          font-weight: 800;
          color: #cfeff9;
        }
        .field-read {
          background: #fff;
          color:#071227;
          padding: 12px;
          border-radius: 8px;
        }
        .field input, .field select {
          padding: 10px;
          border-radius: 8px;
          border: none;
          background: #fff;
          color:#071227;
        }
        .form-error {
          color: #ff6b6b;
          font-weight: 700;
        }
        .toast {
          position: fixed;
          right: 22px;
          bottom: 22px;
          background: #2ecc71;
          padding: 12px 16px;
          border-radius: 10px;
          font-weight: 800;
          color: white;
          z-index: 9999;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        @media(max-width:900px){
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="profile-wrapper">
        <h2 className="card-title">👤 Profile</h2>

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

            <div className="profile-name">{profile.name}</div>
            <div className="profile-sub">{profile.village}</div>

            {/* Buttons */}
            {!editing ? (
              <button className="btn btn-edit" onClick={startEdit}>✏️ Edit Profile</button>
            ) : (
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-save" onClick={saveProfile}>
                  {loading ? "Saving…" : "💾 Save"}
                </button>
                <button className="btn btn-cancel" onClick={cancelEdit}>Cancel</button>
              </div>
            )}

            {editing && (
              <>
                <label style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
                  Upload Avatar (optional)
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
                <span className="field-title">Name</span>
                {!editing ? (
                  <div className="field-read">{profile.name}</div>
                ) : (
                  <input value={draft.name} onChange={(e) => updateField("name", e.target.value)} />
                )}
              </label>

              {/* Village */}
              <label className="field">
                <span className="field-title">Village</span>
                {!editing ? (
                  <div className="field-read">{profile.village}</div>
                ) : (
                  <input value={draft.village} onChange={(e) => updateField("village", e.target.value)} />
                )}
              </label>

              {/* Language */}
              <label className="field">
                <span className="field-title">Language</span>
                {!editing ? (
                  <div className="field-read">{profile.language}</div>
                ) : (
                  <select value={draft.language} onChange={(e) => updateField("language", e.target.value)}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>Tamil</option>
                    <option>Marathi</option>
                    <option>Bengali</option>
                  </select>
                )}
              </label>

              {/* Group */}
              <label className="field">
                <span className="field-title">Group</span>
                {!editing ? (
                  <div className="field-read">{profile.group}</div>
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
