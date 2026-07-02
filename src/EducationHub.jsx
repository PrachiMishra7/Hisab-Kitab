import React, { useEffect, useState } from "react";
import axios from "axios";

// small Card component
function LessonCard({ lesson, onOpen, bookmarked, onToggleBookmark }) {
  return (
    <div
      onClick={() => onOpen(lesson)}
      style={{
        cursor: "pointer",
        padding: 18,
        borderRadius: 12,
        background: "#fff",
        color: "#000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      aria-label={`Open ${lesson.title}`}
    >
      <div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{lesson.title}</div>
        <div style={{ marginTop: 6, color: "#333" }}>{lesson.summary}</div>
        <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
          <span style={{ marginRight: 12 }}>{lesson.category}</span>
          <span style={{ marginRight: 12 }}>{lesson.difficulty}</span>
          <span>{lesson.readTime}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(lesson.id); }}
          aria-pressed={bookmarked}
          style={{
            border: "none",
            background: bookmarked ? "#4caf50" : "transparent",
            color: bookmarked ? "#fff" : "#666",
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer"
          }}>
          {bookmarked ? "Saved" : "Save"}
        </button>
        <div style={{ color: "#999", fontSize: 12 }}>Tap to read</div>
      </div>
    </div>
  );
}

export default function EducationHub() {
  const [lessons, setLessons] = useState([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null); // lesson opened in modal
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("edu_bookmarks") || "[]");
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_BASE}/education`);
        setLessons(res.data);
      } catch (err) {
        console.error("Failed to load lessons", err);
        // fallback: keep page usable with static items
        setLessons([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // persist bookmarks
  useEffect(() => {
    localStorage.setItem("edu_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  function toggleBookmark(id) {
    setBookmarks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev]);
  }

  const filtered = lessons.filter(l => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (l.title + " " + l.summary + " " + l.category).toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ color: "var(--text-primary)", display: "inline-block" }}>📚 Education Hub</h1>

        <div style={{ float: "right", display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search lessons..."
            className="secondary-btn"
          />
        </div>
      </div>

      {loading ? <div style={{ color: "#ddd" }}>Loading lessons...</div> : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.length === 0 && <div style={{ color: "#ddd" }}>No lessons found.</div>}
          {filtered.map(l => (
            <LessonCard
              key={l.id}
              lesson={l}
              onOpen={(lesson) => setActive(lesson)}
              bookmarked={bookmarks.includes(l.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Bookmarked quick list */}
      {bookmarks.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: "var(--text-primary)" }}>Saved</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {bookmarks.map(id => {
              const item = lessons.find(x => x.id === id);
              if (!item) return null;
              return (
                <div key={id} style={{ padding: 8, background: "#fff", borderRadius: 8, color: "#000" }}>
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", zIndex: 9999, padding: 20
          }}
          onClick={() => setActive(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 820, width: "100%", background: "#fff", color: "#000", borderRadius: 12, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>{active.title}</h2>
              <div>
                <button onClick={() => { toggleBookmark(active.id); }} style={{ marginRight: 8 }}>
                  {bookmarks.includes(active.id) ? "Saved" : "Save"}
                </button>
                <button onClick={() => setActive(null)} style={{ background: "transparent", border: "none", fontSize: 18 }}>✖</button>
              </div>
            </div>

            <div style={{ marginTop: 12, color: "#444" }}>
              <div style={{ marginBottom: 12, fontSize: 15 }}>{active.summary}</div>
              <div style={{ whiteSpace: "pre-line" }}>{active.content}</div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <button onClick={() => {
                // mark as complete (for example)
                alert("Marked complete");
              }} className="primary-btn">
                Mark Complete
              </button>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Open resource"); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", textDecoration: "none", color: "#333" }}>
                Additional resources
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
