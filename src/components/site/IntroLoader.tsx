// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Boxes, Workflow, Users, Wallet, Truck, FileText, ShieldCheck } from "lucide-react";
import { modulePalette } from "./modulePalette";
import "../../intro.css";

const ease = [0.16, 1, 0.3, 1];
const nodes = [
  ["Sales", BarChart3], ["Inventory", Boxes], ["Marketing", Workflow], ["People", Users],
  ["Finance", Wallet], ["Logistics", Truck], ["Documents", FileText], ["Compliance", ShieldCheck],
];
const word = "themanager".split("");
const MIN_MS = 900;
const MAX_WAIT_MS = 1400; // never hold the visitor longer than this

/** Full-screen intro: modules connect one by one while the page loads, then a curtain opens onto the site. */
export default function IntroLoader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("load"); // load -> ready
  const loaded = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const markLoaded = () => { loaded.current = true; };
    // the page is usable once the HTML is parsed; don't wait for every image or 3D scene
    if (document.readyState !== "loading") markLoaded(); else document.addEventListener("DOMContentLoaded", markLoaded, { once: true });
    const cap = setTimeout(markLoaded, MAX_WAIT_MS);
    // time the page already spent loading counts toward the minimum, with a short floor so the animation still plays
    const realStart = performance.now();
    const total = reduced ? 300 : Math.max(500, MIN_MS - realStart);
    // head start so the intro opens with the logo and first nodes already connected — never an empty circle
    const start = realStart - 250;
    let raf, shown = 0, timer;
    const tick = now => {
      const t = Math.max(0, Math.min(1, (now - start) / total));
      // ease-out curve; hold at 92% until the page has actually finished loading
      let target = Math.round((1 - Math.pow(1 - t, 2.4)) * 100);
      if (!loaded.current) target = Math.min(target, 92);
      if (target !== shown) { shown = target; setPct(target); }
      if (shown >= 100) { setPhase("ready"); timer = setTimeout(onDone, reduced ? 80 : 150); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); clearTimeout(cap); document.removeEventListener("DOMContentLoaded", markLoaded); };
  }, [onDone]);

  const active = Math.max(0, Math.min(nodes.length - 1, Math.floor(pct / (100 / nodes.length))));
  const ready = phase === "ready";

  return (
    <motion.div className="il-root" role="status" aria-live="polite" aria-label="Loading The Manager" exit={{ opacity: 1, transition: { duration: 0.7 } }}>
      {/* curtain halves split open on exit */}
      <motion.div className="il-curtain il-top" exit={{ y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }} />
      <motion.div className="il-curtain il-bottom" exit={{ y: "100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 } }} />
      <motion.div className="il-seam" initial={{ scaleX: 0 }} animate={{ scaleX: ready ? 1 : 0 }} exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.2 } }} transition={{ duration: 0.5, ease }} />

      <motion.div className="il-stage" exit={{ opacity: 0, scale: 0.92, filter: "blur(10px)", transition: { duration: 0.35 } }}>
        <div className="il-beams" aria-hidden="true"><i /><i /><i /></div>

        <div className="il-constellation" aria-hidden="true">
          <svg className="il-links" viewBox="-160 -160 320 320">
            <motion.circle r="132" className="il-track" initial={{ pathLength: 0 }} animate={{ pathLength: pct / 100 }} transition={{ duration: 0.2 }} />
            {nodes.map((_, i) => {
              const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const on = i <= active && pct > 2;
              return <motion.line key={i} x1="0" y1="0" x2={Math.cos(a) * 132} y2={Math.sin(a) * 132} stroke={modulePalette[i].a}
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: on ? 1 : 0, opacity: ready ? 0 : on ? 0.55 : 0 }} transition={{ duration: 0.5, ease }} />;
            })}
          </svg>

          {nodes.map(([name, Icon], i) => {
            const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * 132, y = Math.sin(a) * 132;
            const on = i <= active && pct > 2;
            return (
              <motion.span key={name} className={`il-node ${on ? "on" : ""}`} style={{ "--na": modulePalette[i].a }}
                initial={{ x, y, opacity: 1, rotate: 0, scale: 0.9 }}
                animate={ready ? { x: 0, y: 0, opacity: 0, scale: 0.2, rotate: 90 } : { x, y, opacity: 1, rotate: 0, scale: on ? 1.08 : 0.9 }}
                transition={ready ? { duration: 0.45, ease: [0.7, 0, 0.84, 0], delay: i * 0.02 } : { type: "spring", stiffness: 120, damping: 14, delay: i * 0.03 }}>
                <Icon size={18} strokeWidth={1.7} />
              </motion.span>
            );
          })}

          <motion.div className="il-core" initial={{ scale: 1, rotate: 0 }} animate={{ scale: ready ? 1.18 : 1, rotate: 0 }} transition={{ type: "spring", stiffness: 140, damping: 13 }}>
            <span className="il-core-ring" />
            <span className="il-core-ring il-core-ring-2" />
            <motion.b className="il-mark" animate={ready ? { rotateY: 360, scale: 1.08 } : { rotateY: 0, scale: 1 }} transition={{ duration: 0.5, ease }}>M</motion.b>
          </motion.div>
          {ready && <motion.span className="il-burst" initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 3.2, opacity: 0 }} transition={{ duration: 0.8, ease }} />}
        </div>

        <h1 className="il-word" aria-label="The Manager">
          {word.map((c, i) => (
            <motion.span key={i} className={i >= 3 ? "il-strong" : ""} aria-hidden="true"
              initial={{ y: "110%", opacity: 0, rotateX: -80 }} animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.6, ease }}>{c}</motion.span>
          ))}
        </h1>
        <motion.small className="il-sub" initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.42em" }} transition={{ delay: 0.8, duration: 1.2, ease }}>BUSINESS OPERATING SYSTEM</motion.small>

        <div className="il-status">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={ready ? "ready" : active} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.22 }}>
              {ready ? <><i className="il-dot ok" /> Everything in sync</> : <><i className="il-dot" style={{ background: modulePalette[active].a }} /> Connecting {nodes[active][0]}</>}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="il-bar" aria-hidden="true"><motion.i style={{ scaleX: pct / 100 }} /></div>
      </motion.div>
    </motion.div>
  );
}
