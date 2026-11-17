// @ts-nocheck
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Search, X, Plus, TrendingUp, Activity, Users, CalendarDays, Mail, Clock3, ChevronDown, Sparkles } from "lucide-react";
import { modulePalette } from "./modulePalette";

const ModuleScene = React.lazy(() => import("./ModuleScenes"));
const ease = [0.16, 1, 0.3, 1];

/* ---------- sample content (clearly labelled as sample data in the UI) ---------- */
const heroes = [
  { kicker: "CUSTOMER RELATIONSHIPS", title: "Sales, with a clearer view.", summary: "Every conversation, opportunity and next step—connected in one place.", metrics: [["Pipeline value", "₹39.1L", "+12.8%"], ["Open opportunities", "24", "+6 this month"], ["Won this month", "08", "+18.4%"], ["Avg. deal size", "₹2.4L", "+4.2%"]], chips: [["Leads flowing", "26 this week"], ["Win rate", "32%"]], scene: "PIPELINE FUNNEL" },
  { kicker: "STOCK INTELLIGENCE", title: "Inventory overview", summary: "A live snapshot of stock across your locations.", metrics: [["Stock value", "₹24.8L", "Across 3 locations"], ["Active SKUs", "8,420", "126 categories"], ["Needs attention", "18", "Low-stock items"]], chips: [["Low stock", "18 items"], ["Fulfilment", "98.6%"]], scene: "SMART WAREHOUSE" },
  { kicker: "CUSTOMER ENGAGEMENT", title: "Campaign studio", summary: "See what is reaching customers and what is gaining momentum.", metrics: [["Campaigns live", "12", "Across 4 channels"], ["People reached", "48.2K", "This month"], ["Engagement", "8.6%", "Up 1.4%"]], chips: [["Reach", "48.2K"], ["Engagement", "8.6%"]], scene: "BROADCAST ENGINE" },
  { kicker: "PEOPLE OPERATIONS", title: "People operations", summary: "A thoughtful overview of your team and people workflows.", metrics: [["Team members", "246", "Across 6 teams"], ["Onboarding", "8", "In progress"], ["Time off", "14", "Requests to review"]], chips: [["Onboarding", "8 people"], ["On track", "92%"]], scene: "TEAM CONSTELLATION" },
  { kicker: "FINANCIAL CONTROL", title: "Finance overview", summary: "Keep cash flow, invoices and upcoming payments in view.", metrics: [["Receivables", "₹8.4L", "24 open invoices"], ["Payables", "₹3.2L", "Due this week"], ["Net cash flow", "₹5.2L", "Up 8.3%"]], chips: [["Net cash flow", "+₹5.2L"], ["Margin", "32.5%"]], scene: "GROWTH VAULT" },
  { kicker: "CONNECTED OPERATIONS", title: "Delivery control room", summary: "Coordinate shipments and keep every delivery moving.", metrics: [["In transit", "38", "Across 5 routes"], ["Delivered today", "124", "On schedule"], ["Needs attention", "3", "Review routes"]], chips: [["In transit", "38 shipments"], ["On time", "97%"]], scene: "ROUTE GLOBE" },
  { kicker: "ONE SOURCE OF TRUTH", title: "Document library", summary: "Find the latest business files and keep work in one place.", metrics: [["Files shared", "1,284", "Across 18 folders"], ["Awaiting review", "7", "3 due today"], ["Storage used", "42%", "Of 500 GB"]], chips: [["Awaiting review", "7 files"], ["Storage", "42% used"]], scene: "LIVING LIBRARY" },
  { kicker: "GOVERNANCE", title: "Compliance center", summary: "A clear view of reviews, controls and upcoming obligations.", metrics: [["Controls active", "42", "Across 8 areas"], ["Reviews complete", "96%", "This quarter"], ["Due this week", "2", "Plan ahead"]], chips: [["Controls", "42 active"], ["Reviews", "96% done"]], scene: "TRUST SHIELD" },
];
const records = [
  null,
  { columns: ["PRODUCT", "LOCATION", "ON HAND", "STATUS"], rows: [["Studio headphones", "Bengaluru · A-12", "124 units", "Healthy"], ["Arc desk lamp", "Mangaluru · B-04", "18 units", "Reorder soon"], ["Everyday backpack", "Mumbai · C-08", "306 units", "Healthy"]] },
  { columns: ["CAMPAIGN", "CHANNEL", "REACH", "STATUS"], rows: [["Autumn launch", "Email · Social", "12.4K", "In progress"], ["Welcome journey", "Email", "8.1K", "Always on"], ["Studio stories", "Social", "5.7K", "Scheduled"]] },
  { columns: ["TEAM MEMBER", "DEPARTMENT", "NEXT STEP", "STATUS"], rows: [["Aarav Mehta", "Sales", "Welcome check-in", "On track"], ["Mira Shah", "Design", "First-week review", "Today"], ["Dev Patel", "Operations", "Equipment setup", "In progress"]] },
  { columns: ["TRANSACTION", "REFERENCE", "AMOUNT", "STATUS"], rows: [["Northstar Studio", "INV-2408", "₹84,000", "Awaiting payment"], ["Fieldwork Supply", "BILL-118", "₹32,500", "Due tomorrow"], ["Orchid Retail", "INV-2403", "₹1,24,000", "Paid"]] },
  { columns: ["SHIPMENT", "DESTINATION", "ETA", "STATUS"], rows: [["TM-2048", "Bengaluru South", "11:40 AM", "In transit"], ["TM-2047", "Mangaluru Central", "12:15 PM", "On schedule"], ["TM-2046", "Mumbai West", "1:05 PM", "Delayed"]] },
  { columns: ["DOCUMENT", "OWNER", "UPDATED", "STATUS"], rows: [["Q3 operating plan", "Aarav Mehta", "Today · 9:42 AM", "In review"], ["Retail partnership", "Mira Shah", "Yesterday", "Approved"], ["Team handbook", "Dev Patel", "Nov 14", "Updated"]] },
  { columns: ["REVIEW", "OWNER", "DUE DATE", "STATUS"], rows: [["Access review", "IT operations", "Nov 20", "In progress"], ["Vendor assessment", "Finance", "Nov 22", "Needs review"], ["Policy acknowledgement", "People team", "Nov 28", "On track"]] },
];
const signals = [
  { label: "Pipeline momentum", value: "+18.4%", note: "More qualified opportunities than last month.", bars: [32, 40, 36, 52, 48, 60, 58, 70, 66, 78, 84, 92], meters: [["Qualified → proposal", 64], ["Proposal → won", 38]], action: "Follow up with 3 warm leads" },
  { label: "Stock movement", value: "+5.3%", note: "Units moving faster across all three locations.", bars: [60, 66, 58, 72, 64, 78, 70, 84, 76, 88, 82, 94], meters: [["Bengaluru warehouse", 82], ["Mumbai warehouse", 64]], action: "Reorder 18 low-stock items" },
  { label: "Weekly reach", value: "48.2K", note: "Social stories are gaining the most momentum.", bars: [28, 34, 42, 38, 50, 56, 52, 64, 70, 66, 80, 88], meters: [["Email", 72], ["Social", 58]], action: "Boost the Autumn launch campaign" },
  { label: "Team pulse", value: "92%", note: "Most of the team is on track this cycle.", bars: [50, 56, 54, 62, 60, 68, 66, 72, 76, 74, 82, 86], meters: [["Onboarding complete", 68], ["Reviews submitted", 84]], action: "Review 14 time-off requests" },
  { label: "Cash inflow", value: "₹5.2L", note: "Net cash flow is up 8.3% on last month.", bars: [36, 42, 48, 46, 56, 54, 62, 68, 64, 74, 80, 90], meters: [["Invoices collected", 76], ["Budget used", 54]], action: "Chase 2 overdue invoices" },
  { label: "Deliveries", value: "124", note: "Delivered today, with 3 routes to review.", bars: [44, 52, 58, 50, 64, 70, 62, 76, 72, 84, 80, 92], meters: [["On-time rate", 97], ["Fleet in use", 71]], action: "Re-route shipment TM-2046" },
  { label: "Files updated", value: "1,284", note: "Shared across 18 folders this quarter.", bars: [30, 38, 34, 46, 52, 48, 60, 58, 68, 72, 70, 82], meters: [["Storage used", 42], ["Reviewed this week", 63]], action: "Approve 3 documents due today" },
  { label: "Controls passing", value: "96%", note: "Quarterly reviews are nearly complete.", bars: [70, 72, 76, 74, 80, 82, 84, 83, 88, 90, 93, 96], meters: [["Quarterly reviews", 96], ["Policy sign-offs", 81]], action: "Finish the vendor assessment" },
];
const startingContacts = [
  { name: "Aarav Mehta", company: "Northstar Studio", email: "aarav@northstar.studio", value: "₹4.8L", status: "Qualified", initials: "AM" },
  { name: "Mira Shah", company: "Fieldwork Supply", email: "mira@fieldwork.co", value: "₹2.2L", status: "Proposal", initials: "MS" },
  { name: "Kabir Rao", company: "Orchid Retail", email: "kabir@orchid.in", value: "₹1.6L", status: "New lead", initials: "KR" },
  { name: "Isha Nair", company: "Good Ground Co.", email: "isha@goodground.co", value: "₹3.4L", status: "Contacted", initials: "IN" },
];
const crmDeals = [
  { stage: "Qualified", amount: "₹18.4L", deals: [["Northstar Studio", "Aarav Mehta", "₹4.8L", "AM"], ["Cedar & Co.", "Tara Bose", "₹3.2L", "TC"]] },
  { stage: "Proposal", amount: "₹12.6L", deals: [["Fieldwork Supply", "Mira Shah", "₹2.2L", "MS"], ["Morrow Living", "Neel Das", "₹6.4L", "NL"]] },
  { stage: "Negotiation", amount: "₹8.1L", deals: [["Orchid Retail", "Kabir Rao", "₹1.6L", "KR"], ["Good Ground Co.", "Isha Nair", "₹3.4L", "IN"]] },
];
const crmActivities = [
  ["09:42 AM", "Proposal shared", "Mira Shah · Fieldwork Supply", "proposal"],
  ["10:18 AM", "Discovery call booked", "Aarav Mehta · Northstar Studio", "calendar"],
  ["11:05 AM", "New lead added", "Kabir Rao · Orchid Retail", "lead"],
  ["12:30 PM", "Follow-up reminder", "Isha Nair · Good Ground Co.", "follow"],
];

const toneOf = (s) => {
  const v = s.toLowerCase();
  if (/(healthy|paid|approved|on track|always on|updated|won|qualified|on schedule)/.test(v)) return "good";
  if (/(reorder|due|needs|delayed|awaiting|today)/.test(v)) return "warn";
  return "info";
};
const matches = (q, ...parts) => parts.join(" ").toLowerCase().includes(q.toLowerCase());

function SceneFallback() {
  return <div className="mw-scene-fallback"><span /></div>;
}

export default function ModuleWorkspace({ modules, moduleIndex, onSelect, onClose }) {
  const mod = modules[moduleIndex];
  const hero = heroes[moduleIndex];
  const signal = signals[moduleIndex];
  const pal = modulePalette[moduleIndex];
  const reduced = !!useReducedMotion();
  const [tab, setTab] = useState("Pipeline");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState(startingContacts);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const shellRef = React.useRef(null);
  const mainRef = React.useRef(null);
  const isCRM = moduleIndex === 0;

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    const onKey = (e) => { if (e.key === "Escape") { e.preventDefault(); if (leadFormOpen) setLeadFormOpen(false); else onClose(); } };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey, true); };
  }, [leadFormOpen, onClose]);
  React.useEffect(() => { shellRef.current?.focus(); }, []);
  React.useEffect(() => { setQuery(""); mainRef.current?.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }, [moduleIndex]);

  const addLead = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const initials = name.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    setContacts((p) => [{ name, company, email, value: "—", status: "New lead", initials }, ...p]);
    setQuery("");
    setTab("Contacts");
    setLeadFormOpen(false);
  };

  const words = hero.title.split(" ");
  const visibleContacts = contacts.filter((c) => matches(query, c.name, c.company, c.email));
  const ops = records[moduleIndex];
  const opsRows = ops ? ops.rows.filter((r) => matches(query, ...r)) : [];

  return createPortal(
    <motion.div className="mw-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        ref={shellRef}
        tabIndex={-1}
        className="mw-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-title"
        style={{ "--mw-accent": pal.a, "--mw-accent-2": pal.b, "--mw-deep": pal.c }}
        initial={{ opacity: 0, y: 40, scale: 0.97, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.6, ease }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mw-bg" aria-hidden="true"><i /><i /><i /><span /></div>

        <header className="mw-top">
          <a href="#home" className="mw-brand" onClick={onClose}><span className="mw-brand-mark">M</span><span><b>themanager</b><small>WORKSPACE</small></span></a>
          <div className="mw-crumb"><span>Platform</span><ChevronDown size={12} className="mw-crumb-sep" /><AnimatePresence mode="wait" initial={false}><motion.b key={moduleIndex} initial={{ y: 10, opacity: 0, rotateX: -70 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: -10, opacity: 0, rotateX: 70 }} transition={{ duration: 0.3, ease }}>{mod.name}</motion.b></AnimatePresence></div>
          <div className="mw-top-actions">
            <label className="mw-search"><Search size={15} /><input aria-label="Search module content" placeholder={isCRM ? "Search deals or contacts" : "Search records"} value={query} onChange={(e) => setQuery(e.target.value)} /></label>
            <button type="button" className="mw-close" aria-label="Return to the main website" onClick={onClose}><span>Back to site</span><X size={16} /></button>
          </div>
        </header>

        <div className="mw-body">
          <nav className="mw-rail" aria-label="Business modules">
            <span className="mw-rail-label">EXPLORE THE PLATFORM</span>
            {modules.map((m, i) => {
              const Icon = m.icon;
              const active = i === moduleIndex;
              return (
                <button type="button" key={m.name} className={`mw-rail-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => onSelect(i)} style={{ "--item-accent": modulePalette[i].a }}>
                  {active && <motion.span layoutId="mw-rail-pill" className="mw-rail-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="mw-rail-num">{m.n}</span>
                  <span className="mw-rail-icon"><Icon size={16} /></span>
                  <span className="mw-rail-text">{m.name}<small>{m.tag}</small></span>
                </button>
              );
            })}
          </nav>

          <main className="mw-main" ref={mainRef}>
            <section className="mw-hero">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={moduleIndex} className="mw-hero-copy" initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } }, exit: { opacity: 0, x: -24, filter: "blur(6px)", transition: { duration: 0.2 } } }}>
                  <motion.span className="mw-kicker" variants={fadeUp}><mod.icon size={13} /> {hero.kicker}<em><i /> Sample data</em></motion.span>
                  <h2 id="workspace-title" className="mw-title" aria-label={hero.title}>
                    {words.map((w, k) => (
                      <motion.span key={k} aria-hidden="true" className={k === words.length - 1 ? "mw-title-glow" : ""} variants={{ hidden: { opacity: 0, y: "0.7em", rotateX: -80 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease } } }}>{w}</motion.span>
                    ))}
                  </h2>
                  <motion.p className="mw-summary" variants={fadeUp}>{hero.summary}</motion.p>
                  <div className={`mw-stats mw-stats-${hero.metrics.length}`}>
                    {hero.metrics.map(([label, value, delta], i) => (
                      <motion.div key={label} className="mw-stat" variants={{ hidden: { opacity: 0, rotateX: -70, y: 16 }, show: { opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", stiffness: 240, damping: 20, delay: 0.1 + i * 0.06 } } }} whileHover={reduced ? undefined : { y: -4, rotateX: 6 }} style={{ transformPerspective: 700 }}>
                        <span>{label}</span><b>{value}</b><small>{isCRM && <TrendingUp size={12} />}{delta}</small>
                      </motion.div>
                    ))}
                  </div>
                  {isCRM && <motion.div variants={fadeUp}><button type="button" className="mw-primary" onClick={() => setLeadFormOpen(true)}><Plus size={16} /> New lead</button></motion.div>}
                </motion.div>
              </AnimatePresence>

              <div className="mw-stage" aria-hidden="true">
                <div className="mw-stage-floor" />
                <React.Suspense fallback={<SceneFallback />}>
                  <ModuleScene index={moduleIndex} paused={reduced} className="mw-canvas" />
                </React.Suspense>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={moduleIndex} className="mw-chips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {hero.chips.map(([k, v], i) => (
                      <motion.span key={k} className={`mw-chip mw-chip-${i}`} initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.35 + i * 0.12, duration: 0.5, ease }}>
                        <i />{k}<b>{v}</b>
                      </motion.span>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <span className="mw-stage-label"><i /> 3D SCENE · {hero.scene}</span>
                <span className="mw-stage-index">{mod.n}<em>/08</em></span>
              </div>
            </section>

            <AnimatePresence mode="wait" initial={false}>
              <motion.section key={moduleIndex} className="mw-grid" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease, delay: 0.1 } }} exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}>
                <div className="mw-panel">
                  {isCRM ? (
                    <>
                      <div className="mw-panel-head">
                        <div><b>{tab === "Pipeline" ? "Deal pipeline" : tab === "Contacts" ? "People & companies" : "Team activity"}</b><small>{tab === "Pipeline" ? "Move opportunities forward with confidence" : tab === "Contacts" ? "Your relationships, all in one place" : "The latest updates across your workspace"}</small></div>
                        <div className="mw-tabs" role="tablist" aria-label="CRM views">
                          {["Pipeline", "Contacts", "Activities"].map((v, i) => (
                            <button type="button" role="tab" aria-selected={tab === v} key={v} className={tab === v ? "active" : ""} onClick={() => setTab(v)}>
                              {tab === v && <motion.span layoutId="mw-tab-pill" className="mw-tab-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                              {i === 0 ? <Activity size={14} /> : i === 1 ? <Users size={14} /> : <CalendarDays size={14} />}<span>{v}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {tab === "Pipeline" && (
                        <div className="mw-pipeline">
                          {crmDeals.map((stage, si) => {
                            const deals = stage.deals.filter((d) => matches(query, ...d));
                            return (
                              <div className="mw-stage-col" key={stage.stage}>
                                <div className="mw-stage-col-head"><span><i className={`dot-${si}`} />{stage.stage}</span><b>{stage.amount}</b></div>
                                {deals.map(([company, owner, value, initials], di) => (
                                  <motion.article key={company} className="mw-deal" initial={{ opacity: 0, y: 16, rotateX: -30 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.15 + si * 0.08 + di * 0.05, duration: 0.5, ease }} whileHover={reduced ? undefined : { y: -5, rotateX: 8, rotateY: -6 }} style={{ transformPerspective: 800 }}>
                                    <div className="mw-deal-top"><b>{company}</b><span>···</span></div>
                                    <span className="mw-owner"><i>{initials}</i>{owner}</span>
                                    <div className="mw-deal-value"><b>{value}</b><span>Potential value</span></div>
                                  </motion.article>
                                ))}
                                {deals.length === 0 && <p className="mw-empty">No matching deals</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {tab === "Contacts" && (
                        <div className="mw-table-wrap">
                          <table className="mw-table"><thead><tr><th>CONTACT</th><th>COMPANY</th><th>DEAL VALUE</th><th>STAGE</th></tr></thead>
                            <tbody>{visibleContacts.map((c) => (
                              <tr key={`${c.email}-${c.name}`}><td><span className="mw-avatar">{c.initials}</span><span className="mw-name">{c.name}<small>{c.email}</small></span></td><td>{c.company}</td><td>{c.value}</td><td><span className={`mw-status tone-${toneOf(c.status)}`}>{c.status}</span></td></tr>
                            ))}</tbody>
                          </table>
                          {visibleContacts.length === 0 && <p className="mw-empty">No contacts match your search.</p>}
                        </div>
                      )}
                      {tab === "Activities" && (
                        <div className="mw-feed">
                          {crmActivities.filter((a) => matches(query, ...a)).map(([time, title, detail, type], i) => (
                            <motion.article key={title} className="mw-feed-row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                              <span className="mw-feed-icon">{type === "calendar" ? <CalendarDays size={15} /> : type === "lead" ? <Users size={15} /> : type === "follow" ? <Clock3 size={15} /> : <Mail size={15} />}</span>
                              <div><b>{title}</b><small>{detail}</small></div><time>{time}</time>
                            </motion.article>
                          ))}
                          {crmActivities.filter((a) => matches(query, ...a)).length === 0 && <p className="mw-empty">No activity matches your search.</p>}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mw-panel-head"><div><b>Recent activity</b><small>Updates from across your {mod.name.toLowerCase()} workspace</small></div><span className="mw-tag"><Activity size={13} /> RECENT RECORDS</span></div>
                      <div className="mw-table-wrap">
                        <table className="mw-table"><thead><tr>{ops.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                          <tbody>{opsRows.map(([a, b, c, s], i) => (
                            <motion.tr key={a} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}>
                              <td><span className="mw-avatar mw-avatar-icon"><mod.icon size={15} /></span><span className="mw-name">{a}</span></td><td>{b}</td><td>{c}</td><td><span className={`mw-status tone-${toneOf(s)}`}>{s}</span></td>
                            </motion.tr>
                          ))}</tbody>
                        </table>
                        {opsRows.length === 0 && <p className="mw-empty">No records match your search.</p>}
                      </div>
                    </>
                  )}
                </div>

                <aside className="mw-signal">
                  <span className="mw-signal-kicker"><Sparkles size={13} /> {signal.label.toUpperCase()}</span>
                  <b className="mw-signal-value">{signal.value}</b>
                  <p>{signal.note}</p>
                  <div className="mw-bars">{signal.bars.map((h, i) => <motion.i key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 + i * 0.035, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} style={{ height: `${h}%` }} />)}</div>
                  <div className="mw-meters">{signal.meters.map(([k, v], i) => (
                    <div key={k} className="mw-meter"><span>{k}<b>{v}%</b></span><div><motion.i initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ delay: 0.35 + i * 0.1, duration: 0.9, ease }} /></div></div>
                  ))}</div>
                  <div className="mw-next"><span>NEXT BEST ACTION</span><b>{signal.action}</b>
                    <button type="button" onClick={() => { if (isCRM) { setTab("Contacts"); setQuery(""); } }}>{isCRM ? "View suggested contacts" : "Open the list"} <ArrowRight size={14} /></button>
                  </div>
                </aside>
              </motion.section>
            </AnimatePresence>

            <footer className="mw-foot"><span className="mw-foot-orb"><i /></span><div><b>Connected by design</b><small>{mod.desc}</small></div><a href="#contact" onClick={onClose} className="mw-foot-link">Book a demo <ArrowUpRight size={15} /></a></footer>
          </main>
        </div>

        <AnimatePresence>
          {leadFormOpen && (
            <motion.div className="mw-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { if (e.target === e.currentTarget) setLeadFormOpen(false); }}>
              <motion.form className="mw-form" onSubmit={addLead} initial={{ opacity: 0, y: 24, rotateX: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.4, ease }}>
                <button type="button" className="mw-form-close" aria-label="Close new lead form" onClick={() => setLeadFormOpen(false)}><X size={18} /></button>
                <span className="mw-kicker">CRM / NEW RELATIONSHIP</span>
                <h3>Add a new lead</h3>
                <p>Capture the essentials and keep the conversation moving.</p>
                <label>Full name<input name="name" required autoFocus placeholder="e.g. Rhea Kapoor" /></label>
                <label>Company<input name="company" required placeholder="e.g. Fieldnotes Studio" /></label>
                <label>Work email<input name="email" type="email" required placeholder="rhea@company.com" /></label>
                <div className="mw-form-actions"><button type="button" className="mw-ghost" onClick={() => setLeadFormOpen(false)}>Cancel</button><button type="submit" className="mw-primary"><Plus size={15} /> Save lead</button></div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>,
    document.body
  );
}

const fadeUp = { hidden: { opacity: 0, y: 18, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } } };
