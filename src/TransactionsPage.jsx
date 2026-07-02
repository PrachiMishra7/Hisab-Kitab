// src/TransactionsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
} from "./api/transactionsApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    { id: "local-1", type: "income", label: "Self Help Group Loan", amount: 5000, date: "2025-11-01" },
    { id: "local-2", type: "expense", label: "Groceries", amount: 1200, date: "2025-11-05" },
    { id: "local-3", type: "saving", label: "Monthly Savings", amount: 1000, date: "2025-11-10" },
  ]);

  const [newTx, setNewTx] = useState({ type: "expense", label: "", amount: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const totalSaving = transactions.filter((t) => t.type === "saving").reduce((s, t) => s + Number(t.amount), 0);

  // load transactions from backend
  useEffect(() => {
    let mounted = true;
    async function fetchTxns() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactions(); // expects array
        if (!mounted) return;
        const normalized = (data || []).map((d) => ({
          id: d._id || d.id || Date.now().toString(),
          type: d.type || "expense",
          label: d.title || d.label || "Untitled",
          amount: Number(d.amount || 0),
          date: d.date ? String(d.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
          raw: d,
        }));
        // merge: backend items first, then local fallback (avoid duplicates)
        setTransactions((prev) => {
          const localIds = new Set(prev.map((p) => p.id));
          const merged = [...normalized, ...prev.filter((p) => !localIds.has(p.id))];
          return merged;
        });
      } catch (err) {
        console.error("fetch error", err);
        setError("Could not load transactions. Check backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchTxns();
    return () => (mounted = false);
  }, []);

  // draw doughnut chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expenses", "Savings"],
        datasets: [
          {
            data: [totalIncome, totalExpense, totalSaving],
            backgroundColor: ["#4caf50", "#ff944d", "#2196f3"],
            borderColor: "#0b1722",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "48%",
        plugins: {
          legend: { display: false },
          tooltip: { bodyFont: { size: 13 }, titleFont: { size: 13 } },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [totalIncome, totalExpense, totalSaving]);

  // Add transaction (optimistic add)
  async function handleAddTransaction(e) {
    e.preventDefault();
    if (!newTx.label || !newTx.amount || !newTx.date) return alert("Please fill all fields");

    const payload = {
      title: newTx.label,
      amount: Number(newTx.amount),
      type: newTx.type,
      date: newTx.date,
    };

    // optimistic UI: add locally while request is pending
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      type: payload.type,
      label: payload.title,
      amount: payload.amount,
      date: payload.date,
    };
    setTransactions((prev) => [optimistic, ...prev]);
    setNewTx({ type: "expense", label: "", amount: "", date: "" });
    setSuccessMsg(""); // clear old msg
    setError(null);
    setLoading(true);

    try {
      const created = await apiAddTransaction(payload);
      const normalized = {
        id: created._id || created.id || tempId,
        type: created.type || payload.type,
        label: created.title || created.label || payload.title,
        amount: Number(created.amount ?? payload.amount),
        date: created.date ? (created.date.slice ? created.date.slice(0, 10) : created.date) : payload.date,
        raw: created,
      };
      // replace temp item with created
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? normalized : t)));
      setSuccessMsg("Transaction added successfully!");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      console.error("Add txn failed:", err);
      // rollback optimistic
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      const serverMessage = err?.message || "Network error";
      setError(`Failed to add transaction. ${serverMessage}`);
      alert(`Failed to add transaction. ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  }

  // delete handler
  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    setLoading(true);
    setError(null);
    try {
      if (String(id).startsWith("local-") || String(id).startsWith("temp-")) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        await apiDeleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
      setSuccessMsg("Transaction deleted");
      setTimeout(() => setSuccessMsg(""), 1800);
    } catch (err) {
      console.error("delete error", err);
      setError("Failed to delete transaction.");
      alert("Failed to delete transaction.");
    } finally {
      setLoading(false);
    }
  }

  // embedded CSS inside component (no index.css change required)
  const embeddedStyle = `
    /* TransactionsPage embedded styles */
    .tx-page { color: #eaf6ff; padding: 18px; }
    .tx-page h2 { font-size: 28px; margin-bottom: 12px; color: #fff; }

    .tx-hero { display:flex; gap:20px; align-items:center; margin-bottom:18px; flex-wrap:wrap; }
    .tx-summary { display:flex; gap:18px; align-items:center; color:#eaf6ff; }
    .tx-badge { display:flex; align-items:center; gap:8px; background: rgba(255,255,255,0.02); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); min-width:160px; }
    .tx-badge .emoji { font-size:22px; }
    .tx-badge .amount { font-weight:900; font-size:18px; margin-left:6px; color:#fff; }

    .tx-chart-wrap { height:160px; width:100%; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.04); }
    .tx-legend { display:flex; gap:12px; align-items:center; justify-content:center; margin-top:8px; color:#cfeff9; font-weight:700; }

    .legend-item { display:flex; align-items:center; gap:8px; font-size:14px; }
    .swatch { width:20px; height:10px; border-radius:3px; display:inline-block; box-shadow:0 2px 8px rgba(0,0,0,0.25); }

    .tx-list { display:grid; gap:12px; margin-top:12px; margin-bottom:18px; }
    .tx-card { display:flex; justify-content:space-between; align-items:center; padding:14px; background:#fff; color:#071227; border-radius:12px; box-shadow: 0 6px 20px rgba(2,6,23,0.25); border:1px solid rgba(0,0,0,0.06); }
    .tx-card .icon { font-size:26px; width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:10px; background: linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02)); }
    .tx-card .meta .title { font-weight:800; font-size:16px; color:#071227; }
    .tx-card .meta .date { font-size:13px; color: #4b5563; margin-top:4px; }

    .right { display:flex; gap:10px; align-items:center; }
    .tx-amount { font-weight:900; font-size:18px; }
    .tx-amount.income { color:#118f37; }
    .tx-amount.expense { color:#d86f11; }
    .tx-amount.saving { color:#1769c6; }

    .del { background:transparent; border:0; cursor:pointer; font-size:16px; opacity:0.85; }

    .tx-form { margin-top:18px; padding:14px; border-radius:12px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.04); }
    .tx-form h3 { margin:0 0 6px 0; color:#fff; }
    .tx-form input, .tx-form select { padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:#fff; color:#071227; }
    .tx-form button { cursor:pointer; }

    .tx-toast { position:fixed; right:20px; bottom:20px; background:#4caf50; color:#fff; padding:10px 14px; border-radius:10px; font-weight:800; box-shadow:0 8px 24px rgba(0,0,0,0.4); z-index:9999; }

    @media (max-width:900px) {
      .tx-hero { flex-direction:column; align-items:stretch; }
      .tx-chart-wrap { width:100% !important; }
      .tx-badge { min-width: auto; justify-content:flex-start; }
    }
  `;

  return (
    <div className="tx-page">
      <style>{embeddedStyle}</style>

      <h2>Transactions</h2>

      <div className="tx-hero">
        <div style={{ flex: 1 }}>
          <div className="tx-summary" aria-hidden>
            <div className="tx-badge" title="Total income">
              <span className="emoji">💰</span>
              <div>
                <div className="amount">₹{totalIncome.toLocaleString()}</div>
                <div style={{ fontWeight: 600, marginTop: 2, color: "rgba(234,246,255,0.85)" }}>Income</div>
              </div>
            </div>

            <div className="tx-badge" title="Total expenses">
              <span className="emoji">🛒</span>
              <div>
                <div className="amount">₹{totalExpense.toLocaleString()}</div>
                <div style={{ fontWeight: 600, marginTop: 2, color: "rgba(234,246,255,0.85)" }}>Expenses</div>
              </div>
            </div>

            <div className="tx-badge" title="Total savings">
              <span className="emoji">🌱</span>
              <div>
                <div className="amount">₹{totalSaving.toLocaleString()}</div>
                <div style={{ fontWeight: 600, marginTop: 2, color: "rgba(234,246,255,0.85)" }}>Savings</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 360 }}>
          <div className="tx-chart-wrap">
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="tx-legend" aria-hidden>
            <div className="legend-item"><span className="swatch" style={{ background: "#4caf50" }} />Income</div>
            <div className="legend-item"><span className="swatch" style={{ background: "#ff944d" }} />Expenses</div>
            <div className="legend-item"><span className="swatch" style={{ background: "#2196f3" }} />Savings</div>
          </div>
        </div>
      </div>

      {loading && <div style={{ margin: "12px 0", color: "#d1eefe" }}>Working…</div>}
      {error && <div style={{ margin: "12px 0", color: "tomato", fontWeight: 700 }}>{error}</div>}

      <div className="tx-list" aria-live="polite">
        {transactions.map((t) => (
          <div className="tx-card" key={t.id}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="icon">{t.type === "income" ? "💰" : t.type === "expense" ? "🛒" : "🌱"}</div>
              <div className="meta">
                <div className="title">{t.label}</div>
                <div className="date">Date: {t.date}</div>
              </div>
            </div>

            <div className="right">
              <div className={`tx-amount ${t.type === "income" ? "income" : t.type === "expense" ? "expense" : "saving"}`}>
                ₹{Number(t.amount).toLocaleString()}
              </div>
              <button className="del" onClick={() => handleDelete(t.id)} title="Delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="tx-form">
        <h3 style={{ marginTop: 0 }}>➕ Add Transaction</h3>
        <form onSubmit={handleAddTransaction} style={{ display: "grid", gap: 10 }}>
          <select value={newTx.type} onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>

          <input type="text" placeholder="What was this for?" value={newTx.label} onChange={(e) => setNewTx({ ...newTx, label: e.target.value })} />
          <input type="number" placeholder="Amount (₹)" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} />
          <input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, background: "linear-gradient(90deg,#36d07b,#16a86b)", color: "#fff", padding: "10px 12px", borderRadius: 8, border: 0, fontWeight: 800 }}>
              Add
            </button>
            <button type="button" onClick={() => setNewTx({ type: "expense", label: "", amount: "", date: "" })} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: "#fff" }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {successMsg && <div className="tx-toast">{successMsg}</div>}
    </div>
  );
}
