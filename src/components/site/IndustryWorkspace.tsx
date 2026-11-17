// @ts-nocheck
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Check, Plus, Minus, GraduationCap, Rocket, ShoppingBag, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import "../../industry.css";

const IndustryScene = React.lazy(() => import("./IndustryScene"));
const ease = [0.16, 1, 0.3, 1];

export const industrySuites = {
  edu: { name: "Education", icon: GraduationCap, colors: ["#f6b98a", "#e58a6b", "#ffd9a8"], kicker: "THE MANAGER FOR EDUCATION", title: "Run your whole campus from one place.", summary: "Admissions, fees, faculty and timetables connected — so staff spend less time on paperwork and more time on students.", stats: [["Applications", "1,284", "+18%"], ["Fees collected", "₹82.4L", "91%"], ["Faculty", "146", "12 depts"]], tabs: ["Admissions", "Fee collection", "Timetable"] },
  startup: { name: "Startups", icon: Rocket, colors: ["#c9a2ff", "#ff8fc7", "#8fd3ff"], kicker: "THE MANAGER FOR STARTUPS", title: "The operating system for growing teams.", summary: "Track revenue, runway, hiring and billing together — one cockpit from first customer to Series A.", stats: [["MRR", "₹14.2L", "+22%"], ["Runway", "19 mo", "Healthy"], ["Open roles", "7", "3 in final"]], tabs: ["Growth", "Hiring", "Billing"] },
  retail: { name: "Retail & E-commerce", icon: ShoppingBag, colors: ["#7fe3c0", "#5fc8e8", "#d8f7a0"], kicker: "THE MANAGER FOR RETAIL", title: "Every store, shelf and shopper in sync.", summary: "Point of sale, stock across locations and customer loyalty — updated the moment something sells.", stats: [["Today's sales", "₹3.8L", "+9%"], ["SKUs tracked", "8,420", "3 stores"], ["Repeat buyers", "42%", "+5 pts"]], tabs: ["Point of sale", "Stock", "Customers"] },
};

/* ---------- Education widgets ---------- */
function Admissions() {
  const stages = ["Enquiry", "Documents", "Offered", "Enrolled"];
  const [cards, setCards] = useState([["Aarav Shah", 0], ["Meera Iyer", 1], ["Rohan Das", 1], ["Sara Khan", 2], ["Dev Patel", 3], ["Anya Rao", 0]]);
  const move = i => setCards(c => c.map((x, k) => k === i ? [x[0], Math.min(3, x[1] + 1)] : x));
  return <div className="iw-kanban">{stages.map((s, si) => <div key={s} className="iw-col"><h5>{s}<b>{cards.filter(c => c[1] === si).length}</b></h5>
    <AnimatePresence>{cards.map((c, i) => c[1] === si && <motion.button layout layoutId={c[0]} key={c[0]} className="iw-chip" onClick={() => move(i)} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
      <span className="iw-av">{c[0][0]}</span>{c[0]}{si < 3 && <small>Advance →</small>}</motion.button>)}</AnimatePresence></div>)}</div>;
}
function Fees() {
  const [rows, setRows] = useState([["Grade 10 · A", 48, 52], ["Grade 11 · B", 39, 44], ["Grade 12 · A", 51, 51], ["Grade 9 · C", 30, 46]]);
  const remind = i => setRows(r => r.map((x, k) => k === i ? [x[0], Math.min(x[2], x[1] + 3), x[2]] : x));
  return <div className="iw-list">{rows.map(([n, p, t], i) => <div key={n} className="iw-row"><span>{n}</span><div className="iw-bar"><motion.i animate={{ width: `${p / t * 100}%` }} transition={{ duration: .8, ease }} /></div><b>{p}/{t}</b>
    {p < t ? <button className="iw-mini" onClick={() => remind(i)}>Send reminder</button> : <span className="iw-ok"><Check size={13} /> Paid</span>}</div>)}</div>;
}
function Timetable() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]; const subj = ["Maths", "Physics", "English", "Chem", "History", "Bio"];
  const [sel, setSel] = useState("2-1");
  return <div className="iw-tt">{days.map((d, di) => <div key={d}><h5>{d}</h5>{[0, 1, 2].map(p => { const id = `${di}-${p}`; return <button key={id} onClick={() => setSel(id)} className={sel === id ? "on" : ""}>{subj[(di + p * 2) % 6]}<small>{9 + p}:00</small></button>; })}</div>)}</div>;
}
/* ---------- Startup widgets ---------- */
function Growth() {
  const [burn, setBurn] = useState(9);
  const cash = 180, runway = Math.round(cash / burn);
  const pts = [4, 5, 6.2, 7, 8.8, 10.1, 11.4, 14.2];
  return <div className="iw-growth"><svg viewBox="0 0 320 120" className="iw-spark"><motion.polyline fill="none" strokeWidth="3" points={pts.map((v, i) => `${i * 45},${115 - v * 7}`).join(" ")} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} /></svg>
    <div className="iw-slider"><label>Monthly spend: <b>₹{burn}L</b></label><input type="range" min="4" max="20" value={burn} onChange={e => setBurn(+e.target.value)} /><p>Runway: <motion.b key={runway} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>{runway} months</motion.b> {runway < 12 && <span className="iw-warn"><AlertTriangle size={13} /> Plan fundraising</span>}</p></div></div>;
}
function Hiring() {
  const [c, setC] = useState([["Product Designer", 3], ["Backend Engineer", 2], ["Sales Lead", 1], ["Growth Marketer", 4]]);
  return <div className="iw-list">{c.map(([r, s], i) => <div key={r} className="iw-row"><span>{r}</span><div className="iw-steps">{["Screen", "Interview", "Task", "Offer", "Hired"].map((x, k) => <i key={x} className={k <= s ? "on" : ""} title={x} />)}</div>
    <button className="iw-mini" disabled={s >= 4} onClick={() => setC(v => v.map((y, k) => k === i ? [y[0], y[1] + 1] : y))}>{s >= 4 ? "Hired 🎉" : "Next step"}</button></div>)}</div>;
}
function Billing() {
  const [plans, setPlans] = useState([["Starter", 120], ["Growth", 64], ["Scale", 18]]);
  const total = plans.reduce((a, [n, v]) => a + v * (n === "Starter" ? 2 : n === "Growth" ? 6 : 18), 0);
  return <div><div className="iw-list">{plans.map(([n, v], i) => <div key={n} className="iw-row"><span>{n}</span><b>{v} customers</b><div className="iw-step"><button onClick={() => setPlans(p => p.map((x, k) => k === i ? [x[0], Math.max(0, x[1] - 1)] : x))}><Minus size={13} /></button><button onClick={() => setPlans(p => p.map((x, k) => k === i ? [x[0], x[1] + 1] : x))}><Plus size={13} /></button></div></div>)}</div><p className="iw-total">Monthly recurring revenue <motion.b key={total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>₹{(total / 100).toFixed(2)}L</motion.b></p></div>;
}
/* ---------- Retail widgets ---------- */
function Pos() {
  const items = [["Linen shirt", 1499], ["Denim jacket", 2999], ["Sneakers", 3499], ["Tote bag", 799]];
  const [cart, setCart] = useState({});
  const [paid, setPaid] = useState(false);
  const total = items.reduce((a, [n, p]) => a + (cart[n] || 0) * p, 0);
  return <div className="iw-pos"><div className="iw-items">{items.map(([n, p]) => <motion.button whileTap={{ scale: .92 }} key={n} onClick={() => { setPaid(false); setCart(c => ({ ...c, [n]: (c[n] || 0) + 1 })); }}>{n}<small>₹{p}</small>{cart[n] > 0 && <em>{cart[n]}</em>}</motion.button>)}</div>
    <div className="iw-receipt"><h5>Receipt</h5>{Object.entries(cart).map(([n, q]) => <p key={n}><span>{q}× {n}</span></p>)}<p className="iw-total">Total <b>₹{total.toLocaleString("en-IN")}</b></p>
      <button className="iw-pay" disabled={!total} onClick={() => { setPaid(true); setCart({}); }}>{paid ? <><Check size={14} /> Paid</> : "Charge"}</button></div></div>;
}
function Stock() {
  const [s, setS] = useState([["Linen shirt", 42, 60], ["Denim jacket", 6, 40], ["Sneakers", 18, 50], ["Tote bag", 3, 30]]);
  return <div className="iw-list">{s.map(([n, q, m], i) => <div key={n} className="iw-row"><span>{n}</span><div className={`iw-bar ${q < 10 ? "low" : ""}`}><motion.i animate={{ width: `${q / m * 100}%` }} transition={{ duration: .8, ease }} /></div><b>{q}</b>
    {q < 10 ? <button className="iw-mini" onClick={() => setS(v => v.map((x, k) => k === i ? [x[0], x[2], x[2]] : x))}>Restock</button> : <span className="iw-ok"><Check size={13} /> OK</span>}</div>)}</div>;
}
function Customers() {
  const [c, setC] = useState([["Priya M.", 2840, "Gold"], ["Kabir S.", 1320, "Silver"], ["Neha R.", 640, "Bronze"]]);
  const tier = p => p >= 2500 ? "Gold" : p >= 1000 ? "Silver" : "Bronze";
  return <div className="iw-list">{c.map(([n, p], i) => <div key={n} className="iw-row"><span className="iw-av">{n[0]}</span><span>{n}</span><b>{p} pts</b><span className={`iw-tier t-${tier(p)}`}>{tier(p)}</span><button className="iw-mini" onClick={() => setC(v => v.map((x, k) => k === i ? [x[0], x[1] + 250] : x))}>+250 pts</button></div>)}</div>;
}
const widgets = { edu: [Admissions, Fees, Timetable], startup: [Growth, Hiring, Billing], retail: [Pos, Stock, Customers] };

export default function IndustryWorkspace({ kind, onSelect, onClose }) {
  const s = industrySuites[kind];
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [kind]);
  useEffect(() => { const k = e => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.removeEventListener("keydown", k); document.body.style.overflow = o; }; }, [onClose]);
  const W = widgets[kind][tab];
  return createPortal(<motion.div className={`iw-overlay iw-${kind}`} style={{ "--a": s.colors[0], "--b": s.colors[1], "--c": s.colors[2] }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`${s.name} solution`}>
    <div className="iw-aurora" aria-hidden="true"><i /><i /><i /></div>
    <motion.div className="iw-shell" initial={{ opacity: 0, y: 40, rotateX: 12, scale: .96 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: .97 }} transition={{ duration: .6, ease }} style={{ transformPerspective: 1400 }}>
      <header className="iw-top"><div className="iw-switch">{Object.entries(industrySuites).map(([k, v]) => { const I = v.icon; return <button key={k} className={k === kind ? "on" : ""} onClick={() => onSelect(k)}>{k === kind && <motion.span layoutId="iw-pill" className="iw-pill" />}<I size={15} /><span>{v.name}</span></button>; })}</div>
        <button className="iw-close" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
      <AnimatePresence mode="wait"><motion.div key={kind} className="iw-body" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4, ease }}>
        <section className="iw-hero"><div className="iw-copy"><span className="iw-kicker"><Sparkles size={13} /> {s.kicker}</span><h2>{s.title}</h2><p>{s.summary}</p>
          <div className="iw-stats">{s.stats.map(([l, v, d], i) => <motion.div key={l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + i * .08 }}><small>{l}</small><b>{v}</b><em><TrendingUp size={11} /> {d}</em></motion.div>)}</div>
          <a className="iw-cta" href="#contact" onClick={onClose}>Book a free demo <ArrowUpRight size={16} /></a></div>
          <div className="iw-scene"><React.Suspense fallback={null}><IndustryScene kind={kind} colors={s.colors} /></React.Suspense></div></section>
        <section className="iw-console"><div className="iw-tabs">{s.tabs.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}><span>{t}</span></button>)}<span className="iw-sample">Sample data · try it</span></div>
          <AnimatePresence mode="wait"><motion.div key={tab} className="iw-panel" initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35, ease }}><W /></motion.div></AnimatePresence></section>
      </motion.div></AnimatePresence>
    </motion.div></motion.div>, document.body);
}
