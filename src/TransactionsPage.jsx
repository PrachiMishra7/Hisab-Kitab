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
    .tx-page { color: var(--text-primary); padding: 18px; }
    .tx-page h2 { font-size: 28px; font-weight: 800; margin-bottom: 16px; color: var(--text-primary); letter-spacing: -0.5px; }

    .tx-hero { display:flex; gap:20px; align-items:center; margin-bottom:20px; flex-wrap:wrap; }
    .tx-summary { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
    .tx-badge { display:flex; align-items:center; gap:10px; background: #ffffff; padding:14px 18px; border-radius:12px; border:1px solid var(--glass-border); min-width:150px; box-shadow: var(--glass-shadow); }
    .tx-badge .emoji { font-size:22px; }
    .tx-badge .amount { font-weight:800; font-size:18px; margin-left:4px; color: var(--text-primary); }

    .tx-chart-wrap { height:160px; width:100%; display:flex; align-items:center; justify-content:center; background: #ffffff; padding:12px; border-radius:12px; border:1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
    .tx-legend { display:flex; gap:16px; align-items:center; justify-content:center; margin-top:8px; color: var(--text-secondary); font-weight:600; }

    .legend-item { display:flex; align-items:center; gap:6px; font-size:13.5px; }
    .swatch { width:18px; height:9px; border-radius:3px; display:inline-block; }

    .tx-list { display:grid; gap:10px; margin-top:14px; margin-bottom:18px; }
    .tx-card { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; background:#ffffff; color: var(--text-primary); border-radius:12px; box-shadow: var(--glass-shadow); border:1px solid var(--glass-border); transition: box-shadow 0.2s; }
    .tx-card:hover { box-shadow: var(--glass-shadow-lg); border-color: #cbd5e1; }
    .tx-card .icon { font-size:24px; width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:10px; background: #f1f5f9; flex-shrink:0; }
    .tx-card .meta .title { font-weight:700; font-size:15.5px; color: var(--text-primary); }
    .tx-card .meta .date { font-size:13px; color: var(--text-secondary); margin-top:3px; }

    .right { display:flex; gap:10px; align-items:center; }
    .tx-amount { font-weight:800; font-size:17px; }
    .tx-amount.income { color: #059669; }
    .tx-amount.expense { color: #dc2626; }
    .tx-amount.saving { color: #2563eb; }

    .del { background:transparent; border:0; cursor:pointer; font-size:16px; opacity:0.5; transition: opacity 0.2s; }
    .del:hover { opacity: 1; }

    .tx-form { margin-top:20px; padding:20px; border-radius:14px; background: #ffffff; border:1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
    .tx-form h3 { margin:0 0 16px 0; font-size:17px; font-weight:700; color: var(--text-primary); }
    .tx-form input, .tx-form select { padding:11px 14px; border-radius:10px; border:1.5px solid var(--glass-border); background:#ffffff; color: var(--text-primary); font-size:14px; }
    .tx-form button { cursor:pointer; }

    .tx-toast { position:fixed; right:20px; bottom:80px; background: #059669; color: #ffffff; padding:12px 18px; border-radius:10px; font-weight:700; font-size:14px; box-shadow: 0 8px 24px rgba(5,150,105,0.35); z-index:9999; }
    .tx-error { color: #dc2626; font-size:14px; font-weight:600; margin-bottom:12px; background:#fff5f5; padding:10px 14px; border-radius:8px; border: 1px solid #fecaca; }

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
            <button type="submit" disabled={loading} className="primary-btn" style={{ flex: 1 }}>
              Add
            </button>
            <button type="button" onClick={() => setNewTx({ type: "expense", label: "", amount: "", date: "" })} className="secondary-btn">
              Reset
            </button>
          </div>
        </form>
      </div>

      {successMsg && <div className="tx-toast">{successMsg}</div>}
    </div>
  );
}
