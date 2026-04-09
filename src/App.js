import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── Persistence ──────────────────────────────────────────────────────────────
const lsGet = k => { try { const s = localStorage.getItem("mz_" + k); return s ? JSON.parse(s) : null; } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem("mz_" + k, JSON.stringify(v)); } catch {} };

function usePersist(key, init) {
  const [v, set] = useState(() => { const s = lsGet(key); return s !== null ? s : init; });
  const ref = useRef(false);
  useEffect(() => { if (ref.current) lsSet(key, v); else ref.current = true; }, [key, v]);
  return [v, set];
}

// ─── Swipe hook ───────────────────────────────────────────────────────────────
function useSwipe(onSwipeLeft, onSwipeRight) {
  const startX = useRef(null);
  const startY = useRef(null);

  const onTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    // Only fire if horizontal movement dominates (not a scroll) and > 50px
    if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 50) {
      dx < 0 ? onSwipeLeft() : onSwipeRight();
    }
    startX.current = null;
    startY.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}

// ─── Utils ────────────────────────────────────────────────────────────────────
const Rs = n => `Rs ${Math.abs(n).toLocaleString("en-MU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const RsS = n => { const a = Math.abs(n); return a >= 1e6 ? `Rs ${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `Rs ${(a / 1e3).toFixed(1)}K` : `Rs ${a.toFixed(0)}`; };
const today = () => new Date().toISOString().split("T")[0];
const mo = d => d.slice(0, 7);
const curMo = () => today().slice(0, 7);
const moLabel = k => { const [y, m] = k.split("-"); return new Date(+y, +m - 1).toLocaleDateString("en-MU", { month: "short", year: "numeric" }); };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pct = (a, b) => b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0;
const uid = () => Date.now() + Math.random();

// ─── Defaults ─────────────────────────────────────────────────────────────────
const D_EXP = [
  { name: "Food", icon: "🍛", color: "#ef4444" }, { name: "Transport", icon: "🚌", color: "#f97316" },
  { name: "Bills", icon: "💡", color: "#eab308" }, { name: "Health", icon: "💊", color: "#22c55e" },
  { name: "Entertainment", icon: "🎬", color: "#8b5cf6" }, { name: "Shopping", icon: "🛍️", color: "#ec4899" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];
const D_INC = [
  { name: "Salary", icon: "💼", color: "#14b8a6" }, { name: "Freelance", icon: "💻", color: "#06b6d4" },
  { name: "Gift", icon: "🎁", color: "#a78bfa" }, { name: "Investment", icon: "📈", color: "#34d399" },
  { name: "Other", icon: "💰", color: "#eab308" },
];
const D_ACCS = [
  { id: 1, name: "Cash", icon: "💵", color: "#22c55e", balance: 0 },
  { id: 2, name: "Bank", icon: "🏦", color: "#06b6d4", balance: 0 },
];
const PAL = ["#ef4444","#f97316","#eab308","#22c55e","#10b981","#06b6d4","#3b82f6","#8b5cf6","#ec4899","#f43f5e","#14b8a6","#a78bfa","#34d399","#fb923c","#84cc16","#0ea5e9"];
const GCOLS = ["#c9b99a","#22c55e","#06b6d4","#a78bfa","#f97316","#ec4899","#34d399","#eab308","#8b5cf6","#14b8a6"];
const EMOJIS = ["📦","🍕","🍛","🚌","🚗","✈️","💡","💊","🎬","🛍️","💼","💻","🎁","📈","🏠","🎓","🕌","🌍","👔","🏋️","🎯","💰","🧴","📚","🐾","🎵","☕","⚡","🏖️","💳","🧳","🔧","🎮","💍","🏥","📱","🚀","🌙","⭐","🎤","🍺","🌿","🧘","🏄","🎸","🎨","🖥️","🎪","🚴"];
const GICONS = ["🎯","✈️","🏠","🚗","💍","📱","🎓","💰","🕌","🌍","👔","🏋️","🏖️","🎮","💻","🚀","🌙","⭐","🎸","🧘"];
const ACCICONS = ["💵","🏦","💳","📱","🪙","💶","🏧","💎","🏠","🚗","💼","🧾"];
const RFREQ = ["Daily", "Weekly", "Fortnightly", "Monthly", "Yearly"];

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:       "#070707",
  card:     "#0e0e0e",
  cardHi:   "#131313",
  border:   "#1a1a1a",
  border2:  "#212121",
  inputBg:  "#090909",
  text:     "#ede8e0",
  sub:      "#8a8278",
  muted:    "#4a4540",
  faint:    "#1e1c1a",
  gold:     "#d4b896",
  goldSoft: "#b89c7d",
  goldDim:  "#6b5440",
  goldGlow: "rgba(212,184,150,0.07)",
  green:    "#4ade80",
  red:      "#f87171",
  blue:     "#38bdf8",
  serif:    "'Georgia','Times New Roman',serif",
  mono:     "'Courier New',monospace",
};

// ─── Style helpers ────────────────────────────────────────────────────────────
const s = {
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  input: {
    background: T.inputBg,
    border: `1px solid ${T.border2}`,
    borderRadius: 10,
    color: T.text,
    padding: "11px 14px",
    fontSize: 13,
    fontFamily: T.serif,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    letterSpacing: "0.01em",
  },
  btn: (bg = T.gold, fg = "#080808") => ({
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 10,
    padding: "11px 20px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: T.serif,
    fontSize: 12,
    letterSpacing: "0.04em",
    transition: "opacity .2s",
  }),
  ghost: {
    background: "transparent",
    border: `1px solid ${T.border2}`,
    borderRadius: 10,
    color: T.sub,
    cursor: "pointer",
    padding: "8px 14px",
    fontFamily: T.serif,
    fontSize: 12,
    letterSpacing: "0.02em",
  },
  label: {
    fontSize: 9,
    color: T.muted,
    display: "block",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontFamily: T.serif,
  },
  row: { display: "flex", alignItems: "center", gap: 10 },
  between: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  g3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
};

// ─── Micro components ─────────────────────────────────────────────────────────
const Empty = ({ icon, msg }) => (
  <div style={{ textAlign: "center", padding: "44px 0" }}>
    <div style={{ fontSize: 34, marginBottom: 12, opacity: 0.4 }}>{icon}</div>
    <div style={{ fontSize: 12, color: T.muted, letterSpacing: "0.06em" }}>{msg}</div>
  </div>
);

const Tag = ({ label, active, color = T.gold, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px",
    border: `1px solid ${active ? color + "60" : T.border}`,
    borderRadius: 24,
    background: active ? color + "14" : "transparent",
    color: active ? color : T.muted,
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    flexShrink: 0,
    letterSpacing: "0.03em",
    transition: "all .2s",
  }}>{label}</button>
);

// Refined bar: thin with a subtle glow on the filled portion
const Bar = ({ pct: p, color, h = 4, animate = true }) => (
  <div style={{ height: h, background: T.faint, borderRadius: h, overflow: "hidden" }}>
    <div style={{
      height: h,
      borderRadius: h,
      width: `${p}%`,
      background: `linear-gradient(90deg, ${color}cc, ${color})`,
      boxShadow: p > 5 ? `0 0 6px ${color}40` : "none",
      transition: animate ? "width .6s cubic-bezier(.4,0,.2,1)" : "none",
    }} />
  </div>
);

const CatDot = ({ cat }) => (
  <div style={{
    width: 34, height: 34, borderRadius: "50%",
    background: cat.color + "15",
    border: `1px solid ${cat.color}35`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, flexShrink: 0,
  }}>{cat.icon}</div>
);

const Pill = ({ color, icon }) => (
  <div style={{
    width: 38, height: 38, borderRadius: 11,
    background: color + "14",
    border: `1px solid ${color}28`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 19, flexShrink: 0,
  }}>{icon}</div>
);

// Divider line
const Divider = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.border} 30%, ${T.border} 70%, transparent)`, margin: "14px 0" }} />
);

// Section heading
const SectionHead = ({ label, action, onAction }) => (
  <div style={{ ...s.between, marginBottom: 14 }}>
    <span style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: T.serif }}>{label}</span>
    {action && <button onClick={onAction} style={{ fontSize: 10, color: T.goldSoft, background: "none", border: "none", cursor: "pointer", fontFamily: T.serif, letterSpacing: "0.04em" }}>{action}</button>}
  </div>
);

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.88)",
      backdropFilter: "blur(4px)",
      zIndex: 200,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "28px 16px", overflowY: "auto",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        ...s.card,
        width: "100%",
        maxWidth: wide ? 560 : 440,
        marginBottom: 0,
        border: `1px solid ${T.border2}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${T.goldGlow}`,
      }}>
        {/* Modal header */}
        <div style={{ ...s.between, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <div style={{ fontSize: 11, color: T.goldSoft, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: T.serif }}>{title}</div>
          </div>
          <button onClick={onClose} style={{
            background: T.faint, border: `1px solid ${T.border}`, color: T.sub,
            cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "4px 8px",
            borderRadius: 6, fontFamily: T.serif,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      fontSize: 11, color: T.red, marginTop: 10,
      padding: "8px 12px",
      background: T.red + "0d",
      borderRadius: 8,
      border: `1px solid ${T.red}25`,
      letterSpacing: "0.02em",
    }}>{msg}</div>
  );
}

// ─── Inline category adder ────────────────────────────────────────────────────
function CatAdder({ type, expCats, setExpCats, incCats, setIncCats }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [color, setColor] = useState(PAL[0]);
  const [err, setErr] = useState("");
  const list = type === "expense" ? expCats : incCats;
  const setList = type === "expense" ? setExpCats : setIncCats;

  const add = () => {
    if (!name.trim()) { setErr("Enter a name."); return; }
    if (list.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) { setErr("Already exists."); return; }
    setList(p => [...p, { name: name.trim(), icon, color, type }]);
    setName(""); setIcon("📦"); setColor(PAL[0]); setErr(""); setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ ...s.ghost, fontSize: 11, padding: "5px 10px", borderStyle: "dashed", color: T.gold + "99" }}>
      + New {type} category
    </button>
  );
  return (
    <div style={{ background: T.inputBg, border: `1px solid ${T.border2}`, borderRadius: 10, padding: 12, marginTop: 8 }}>
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Quick add {type} category</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
        {EMOJIS.slice(0, 24).map(ic => (
          <button key={ic} onClick={() => setIcon(ic)} style={{ width: 28, height: 28, borderRadius: 6, fontSize: 13, background: icon === ic ? T.faint : "transparent", border: icon === ic ? `1px solid ${T.gold}` : `1px solid ${T.border}`, cursor: "pointer" }}>{ic}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
        {PAL.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ ...s.row, background: T.faint, borderRadius: 8, padding: "6px 10px", fontSize: 18 }}>{icon}</div>
        <input style={{ ...s.input, flex: 1 }} placeholder="Category name" value={name}
          onChange={e => { setName(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && add()} autoFocus />
        <button style={{ ...s.btn(), padding: "0 14px", fontSize: 16 }} onClick={add}>+</button>
        <button style={{ ...s.ghost, padding: "0 10px" }} onClick={() => { setOpen(false); setErr(""); }}>✕</button>
      </div>
      <ErrMsg msg={err} />
    </div>
  );
}

// ─── Icon + Color pickers ─────────────────────────────────────────────────────
function IconPicker({ icons, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {icons.map(ic => (
        <button key={ic} onClick={() => onChange(ic)} style={{ width: 34, height: 34, borderRadius: 8, fontSize: 17, background: value === ic ? T.faint : T.inputBg, border: value === ic ? `1px solid ${T.gold}` : `1px solid ${T.border}`, cursor: "pointer" }}>{ic}</button>
      ))}
    </div>
  );
}
function ColorPicker({ colors, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {colors.map(c => (
        <button key={c} onClick={() => onChange(c)} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: value === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
      ))}
    </div>
  );
}

// ─── TxRow ────────────────────────────────────────────────────────────────────
function TxRow({ t, gc, onEdit, onDelete }) {
  const c = gc(t.category);
  const isIncome = t.type === "income";
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
      borderLeft: `2px solid ${isIncome ? T.green + "50" : T.red + "50"}`,
      transition: "border-color .2s",
    }}>
      <div style={{ ...s.row }}>
        <CatDot cat={c} />
        <div>
          <div style={{ fontSize: 13, color: T.text, letterSpacing: "0.01em" }}>
            {t.category}{t.note ? <span style={{ color: T.muted }}> · {t.note}</span> : ""}
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2, letterSpacing: "0.04em" }}>{t.date}</div>
        </div>
      </div>
      <div style={{ ...s.row }}>
        <span style={{
          fontWeight: "600", fontSize: 13,
          color: isIncome ? T.green : T.red,
          letterSpacing: "0.01em",
        }}>
          {isIncome ? "+" : "−"}{Rs(t.amount)}
        </span>
        <button onClick={onEdit} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, padding: "3px 5px" }}
          onMouseEnter={e => e.currentTarget.style.color = T.gold}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}>✏</button>
        <button onClick={onDelete} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 17, padding: "3px 5px", lineHeight: 1 }}
          onMouseEnter={e => e.currentTarget.style.color = T.red}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}>×</button>
      </div>
    </div>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
function BarChart({ data, h = 80 }) {
  const max = Math.max(...data.flatMap(d => [d.inc, d.exp]), 1);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: h + 20 }}>
      {data.map(m => (
        <div key={m.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: h }}>
            <div style={{ flex: 1, height: `${pct(m.inc, max)}%`, background: T.green + "55", borderRadius: "3px 3px 0 0", minHeight: 2 }} />
            <div style={{ flex: 1, height: `${pct(m.exp, max)}%`, background: T.red + "55", borderRadius: "3px 3px 0 0", minHeight: 2 }} />
          </div>
          <div style={{ fontSize: 9, color: T.muted }}>{m.label}</div>
          {m.net !== 0 && <div style={{ fontSize: 8, color: m.net > 0 ? T.green : T.red }}>{m.net > 0 ? "+" : ""}{RsS(m.net)}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Goal card (extracted component to avoid hook-in-map) ────────────────────
function GoalCard({ g, onEdit, onDelete, onAllocate, onRemoveAlloc, gc }) {
  const [expanded, setExpanded] = useState(false);
  const p = pct(g.saved, g.target);
  return (
    <div style={{ ...s.card, border: `1px solid ${g.color}28` }}>
      <div style={{ ...s.between, marginBottom: 10 }}>
        <div style={s.row}>
          <Pill color={g.color} icon={g.icon} />
          <div>
            <div style={{ fontSize: 13, color: T.text, fontWeight: "bold" }}>{g.name}</div>
            {g.deadline && <div style={{ fontSize: 9, color: T.muted }}>🗓 Due {g.deadline}</div>}
            <div style={{ fontSize: 10, color: T.sub }}>{Rs(g.saved)} saved · {Rs(g.target)} goal</div>
          </div>
        </div>
        <div style={s.row}>
          <button onClick={() => onEdit(g)} style={{ ...s.ghost, padding: "4px 9px", fontSize: 10 }}>Edit</button>
          <button onClick={() => setExpanded(x => !x)} style={{ ...s.ghost, padding: "4px 9px", fontSize: 10 }}>{expanded ? "Hide" : "History"}</button>
          <button onClick={() => onDelete(g.id)} style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 20, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = T.red} onMouseLeave={e => e.currentTarget.style.color = T.faint}>×</button>
        </div>
      </div>
      <Bar pct={p} color={g.color} h={8} />
      <div style={{ ...s.between, fontSize: 9, color: T.muted, marginTop: 4, marginBottom: 12 }}>
        <span>{p}% reached</span>
        {p < 100 ? <span style={{ color: T.sub }}>{Rs(g.target - g.saved)} remaining</span> : <span style={{ color: T.green }}>✓ Goal reached!</span>}
      </div>
      <button onClick={() => onAllocate(g.id)} style={{ ...s.btn(g.color + "18", g.color), border: `1px solid ${g.color}33`, width: "100%", borderRadius: 8 }}>
        + Allocate Money
      </button>
      {expanded && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Allocation History</div>
          {(g.allocs || []).length === 0
            ? <div style={{ fontSize: 11, color: T.faint, textAlign: "center", padding: 8 }}>No allocations yet.</div>
            : (g.allocs || []).map(a => (
              <div key={a.id} style={{ ...s.between, padding: "6px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
                <span style={{ color: T.sub }}>{gc(a.source).icon} {a.source} · {a.date}</span>
                <div style={s.row}>
                  <span style={{ color: T.green }}>+{Rs(a.amount)}</span>
                  <button onClick={() => onRemoveAlloc(g.id, a.id)} style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 15, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = T.red} onMouseLeave={e => e.currentTarget.style.color = T.faint}>×</button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── Setup screen ─────────────────────────────────────────────────────────────
function Setup({ onDone }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const go = () => name.trim() ? onDone(name.trim().toUpperCase()) : setErr("Please enter your name.");
  return (
    <div style={{
      fontFamily: T.serif, background: T.bg, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, color: T.text,
      backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, ${T.goldGlow}, transparent)`,
    }}>
      <div style={{ width: "100%", maxWidth: 340 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 18, color: T.goldSoft, letterSpacing: "0.3em",
            fontFamily: T.mono, marginBottom: 16, opacity: 0.7,
          }}>مِيزَان</div>
          <div style={{
            fontSize: 38, fontWeight: "300", color: T.gold,
            letterSpacing: "0.18em", textTransform: "uppercase",
            fontFamily: T.serif,
          }}>Mizan</div>
          <div style={{
            width: 40, height: 1,
            background: `linear-gradient(90deg, transparent, ${T.goldDim}, transparent)`,
            margin: "14px auto",
          }}/>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em" }}>
            Personal Finance
          </div>
        </div>

        {/* Card */}
        <div style={{
          ...s.card,
          border: `1px solid ${T.border2}`,
          boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px ${T.goldGlow}`,
          padding: 28,
        }}>
          <label style={{ ...s.label, marginBottom: 8 }}>Your name</label>
          <input
            style={{ ...s.input, fontSize: 15, padding: "13px 16px", marginBottom: 16, letterSpacing: "0.06em" }}
            placeholder="e.g. Beanie"
            value={name}
            onChange={e => { setName(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && go()}
            autoFocus
          />
          <ErrMsg msg={err} />
          {err && <div style={{ height: 8 }} />}
          <button
            style={{
              ...s.btn(),
              width: "100%", padding: 14, fontSize: 13,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginTop: 4,
            }}
            onClick={go}
          >
            Enter
          </button>
        </div>
        <div style={{ textAlign: "center", fontSize: 10, color: T.muted, marginTop: 20, letterSpacing: "0.06em" }}>
          Your data stays on this device
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [pname, setPname] = usePersist("profile", null);
  if (!pname) return <Setup onDone={setPname} />;
  return <Mizan pname={pname} setPname={setPname} />;
}

// ─── Main app ─────────────────────────────────────────────────────────────────
function Mizan({ pname, setPname }) {
  // Persisted state
  const [tab, setTab] = usePersist("tab", "dashboard");
  const [expCats, setExpCats] = usePersist("expCats", D_EXP);
  const [incCats, setIncCats] = usePersist("incCats", D_INC);
  const [txs, setTxs] = usePersist("txs", []);
  const [budgets, setBudgets] = usePersist("budgets", {});
  const [goals, setGoals] = usePersist("goals", []);
  const [accs, setAccs] = usePersist("accs", D_ACCS);
  const [debts, setDebts] = usePersist("debts", []);
  const [recurs, setRecurs] = usePersist("recurs", []);

  // Modal state
  const [txModal, setTxModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [goalModal, setGoalModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [accModal, setAccModal] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [debtModal, setDebtModal] = useState(false);
  const [editDebt, setEditDebt] = useState(null);
  const [recModal, setRecModal] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [catModal, setCatModal] = useState(false);
  const [profModal, setProfModal] = useState(false);
  const [allocGoalId, setAllocGoalId] = useState(null);

  // Filter state
  const [fMonth, setFMonth] = useState(curMo());
  const [fType, setFType] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // ── Derived ──
  const catMap = useMemo(() => {
    const m = {}; [...expCats, ...incCats].forEach(c => { m[c.name] = c; }); return m;
  }, [expCats, incCats]);
  const gc = useCallback(n => catMap[n] || { icon: "📦", color: T.muted, name: n }, [catMap]);

  const avMos = useMemo(() => {
    const s = new Set(txs.map(t => mo(t.date))); s.add(curMo());
    return [...s].sort((a, b) => b.localeCompare(a));
  }, [txs]);

  // Month-specific
  const txMo = useMemo(() => txs.filter(t => mo(t.date) === fMonth), [txs, fMonth]);
  const incMo = useMemo(() => txMo.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0), [txMo]);
  const expMo = useMemo(() => txMo.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0), [txMo]);
  const balMo = incMo - expMo;

  // All-time (never resets)
  const allInc = useMemo(() => txs.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0), [txs]);
  const allExp = useMemo(() => txs.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0), [txs]);
  const allBal = allInc - allExp;
  const netWorth = useMemo(() => accs.reduce((a, acc) => a + acc.balance, 0), [accs]);

  const expByCat = useMemo(() => {
    const m = {}; txMo.filter(t => t.type === "expense").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; }); return m;
  }, [txMo]);
  // Monthly income by category (for display only)
  const incByCat = useMemo(() => {
    const m = {}; txMo.filter(t => t.type === "income").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; }); return m;
  }, [txMo]);
  // ALL-TIME income by category — so March salary is still available to allocate in April
  const allTimeIncByCat = useMemo(() => {
    const m = {}; txs.filter(t => t.type === "income").forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; }); return m;
  }, [txs]);
  const allocBySrc = useMemo(() => {
    const m = {}; goals.flatMap(g => g.allocs || []).forEach(a => { m[a.source] = (m[a.source] || 0) + a.amount; }); return m;
  }, [goals]);

  const trend = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const key = d.toISOString().slice(0, 7);
    const inc = txs.filter(t => mo(t.date) === key && t.type === "income").reduce((a, t) => a + t.amount, 0);
    const exp = txs.filter(t => mo(t.date) === key && t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { key, label: MONTHS[d.getMonth()], inc, exp, net: inc - exp };
  }), [txs]);

  const filteredTxs = useMemo(() => {
    let l = [...txs];
    if (fMonth !== "all") l = l.filter(t => mo(t.date) === fMonth);
    if (fType !== "all") l = l.filter(t => t.type === fType);
    if (fCat !== "all") l = l.filter(t => t.category === fCat);
    if (search) l = l.filter(t => (t.note || "").toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    l.sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amt_desc") return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return l;
  }, [txs, fMonth, fType, fCat, search, sortBy]);

  // ── Debt summaries ──
  const totalOwed = debts.filter(d => d.direction === "owe").reduce((a, d) => a + (d.amount - d.paid), 0);
  const totalLent = debts.filter(d => d.direction === "lent").reduce((a, d) => a + (d.amount - d.paid), 0);
  const activeDebts = debts.filter(d => d.amount - d.paid > 0);

  // ── Budget alerts ──
  const budgetAlerts = useMemo(() => expCats.filter(c => {
    const lim = parseFloat(budgets[c.name]?.amount) || 0;
    return lim > 0 && (expByCat[c.name] || 0) >= lim * 0.8;
  }), [expCats, budgets, expByCat]);

  // ── TX handlers ──
  const saveTx = useCallback((data) => {
    if (editTx) {
      // Reverse old account effect
      if (editTx.accountId) {
        const rev = editTx.type === "income" ? -editTx.amount : editTx.amount;
        setAccs(p => p.map(a => a.id === editTx.accountId ? { ...a, balance: a.balance + rev } : a));
      }
      setTxs(p => p.map(t => t.id === editTx.id ? { ...t, ...data } : t));
    } else {
      setTxs(p => [...p, { ...data, id: uid() }]);
    }
    // Apply new account effect
    if (data.accountId) {
      const delta = data.type === "income" ? data.amount : -data.amount;
      setAccs(p => p.map(a => a.id === data.accountId ? { ...a, balance: a.balance + delta } : a));
    }
    setTxModal(false); setEditTx(null);
  }, [editTx, setTxs, setAccs]);

  const deleteTx = useCallback((id) => {
    const t = txs.find(x => x.id === id);
    if (t?.accountId) {
      const rev = t.type === "income" ? -t.amount : t.amount;
      setAccs(p => p.map(a => a.id === t.accountId ? { ...a, balance: a.balance + rev } : a));
    }
    setTxs(p => p.filter(x => x.id !== id));
  }, [txs, setTxs, setAccs]);

  // ── Goal handlers ──
  const saveGoal = useCallback((data) => {
    if (editGoal) setGoals(p => p.map(g => g.id === editGoal.id ? { ...g, ...data } : g));
    else setGoals(p => [...p, { ...data, id: uid(), saved: 0, allocs: [] }]);
    setGoalModal(false); setEditGoal(null);
  }, [editGoal, setGoals]);

  const allocGoal = useCallback((gid, amt, src) => {
    setGoals(p => p.map(g => g.id !== gid ? g : {
      ...g, saved: g.saved + amt,
      allocs: [...(g.allocs || []), { id: uid(), date: today(), amount: amt, source: src }],
    }));
    setAllocGoalId(null);
  }, [setGoals]);

  const removeAlloc = useCallback((gid, aid) => {
    setGoals(p => p.map(g => {
      if (g.id !== gid) return g;
      const a = (g.allocs || []).find(x => x.id === aid);
      return { ...g, saved: Math.max(0, g.saved - (a?.amount || 0)), allocs: (g.allocs || []).filter(x => x.id !== aid) };
    }));
  }, [setGoals]);

  // ── Account handlers ──
  const saveAcc = useCallback((data) => {
    if (editAcc) setAccs(p => p.map(a => a.id === editAcc.id ? { ...a, ...data } : a));
    else setAccs(p => [...p, { ...data, id: uid() }]);
    setAccModal(false); setEditAcc(null);
  }, [editAcc, setAccs]);

  // ── Debt handlers ──
  const saveDebt = useCallback((data) => {
    if (editDebt && !editDebt._pay) setDebts(p => p.map(d => d.id === editDebt.id ? { ...d, ...data } : d));
    else if (!editDebt) setDebts(p => [...p, { ...data, id: uid(), paid: 0, payments: [] }]);
    setDebtModal(false); setEditDebt(null);
  }, [editDebt, setDebts]);

  const payDebt = useCallback((id, amt, accId, note) => {
    const debt = debts.find(d => d.id === id);
    setDebts(p => p.map(d => d.id !== id ? d : {
      ...d, paid: Math.min(d.amount, d.paid + amt),
      payments: [...(d.payments || []), { id: uid(), date: today(), amount: amt, accId, note }],
    }));
    if (accId) setAccs(p => p.map(a => a.id === accId ? { ...a, balance: a.balance - amt } : a));
    if (debt) setTxs(p => [...p, { id: uid(), type: "expense", category: "Bills", amount: amt, note: note || `Payment — ${debt.name}`, date: today(), accountId: accId || null }]);
  }, [debts, setDebts, setAccs, setTxs]);

  // ── Recurring handlers ──
  const saveRec = useCallback((data) => {
    if (editRec) setRecurs(p => p.map(r => r.id === editRec.id ? { ...r, ...data } : r));
    else setRecurs(p => [...p, { ...data, id: uid() }]);
    setRecModal(false); setEditRec(null);
  }, [editRec, setRecurs]);

  const postRec = useCallback((r) => {
    setTxs(p => [...p, { id: uid(), type: r.type, category: r.category, amount: r.amount, note: r.note || r.category, date: today(), accountId: r.accountId || null }]);
    if (r.accountId) {
      const delta = r.type === "income" ? r.amount : -r.amount;
      setAccs(p => p.map(a => a.id === r.accountId ? { ...a, balance: a.balance + delta } : a));
    }
  }, [setTxs, setAccs]);

  const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "transactions", label: "Transactions", icon: "💸" },
    { id: "budget", label: "Budget", icon: "📋" },
    { id: "savings", label: "Savings", icon: "🎯" },
    { id: "accounts", label: "Accounts", icon: "🏦" },
    { id: "debts", label: "Debts", icon: "📛" },
    { id: "recurring", label: "Recurring", icon: "🔄" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const tabIds = TABS.map(t => t.id);

  const goNext = useCallback(() => {
    const i = tabIds.indexOf(tab);
    if (i < tabIds.length - 1) setTab(tabIds[i + 1]);
  }, [tab, tabIds, setTab]);

  const goPrev = useCallback(() => {
    const i = tabIds.indexOf(tab);
    if (i > 0) setTab(tabIds[i - 1]);
  }, [tab, tabIds, setTab]);

  const swipeHandlers = useSwipe(goNext, goPrev);

  return (
    <div style={{
      fontFamily: T.serif,
      background: T.bg,
      minHeight: "100vh",
      color: T.text,
      paddingBottom: 80,
    }} {...swipeHandlers}>

      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(180deg, #0c0c0c 0%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: `0 1px 0 ${T.border}, 0 4px 24px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "14px 16px 0" }}>

          {/* Brand + actions */}
          <div style={{ ...s.between, marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 18, fontWeight: "300", color: T.gold,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                }}>Mizan</span>
                <span style={{
                  width: 1, height: 14,
                  background: T.goldDim, opacity: 0.4,
                  display: "inline-block",
                }}/>
                <span style={{
                  fontSize: 11, fontFamily: T.mono,
                  color: T.goldDim, letterSpacing: "0.06em",
                }}>مِيزَان</span>
              </div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 3, letterSpacing: "0.04em" }}>
                {greet()},{" "}
                <span style={{ color: T.goldSoft, fontWeight: "600", letterSpacing: "0.06em" }}>{pname}</span>
              </div>
            </div>
            <div style={s.row}>
              <button
                onClick={() => { setTxModal(true); setEditTx(null); }}
                style={{
                  ...s.btn(),
                  padding: "8px 18px",
                  letterSpacing: "0.06em",
                  fontSize: 11,
                  borderRadius: 8,
                  boxShadow: `0 2px 12px ${T.gold}22`,
                }}
              >+ Add</button>
              <button onClick={() => setProfModal(true)} style={{ ...s.ghost, padding: "7px 11px", borderRadius: 8 }}>⚙</button>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "7px 11px",
                border: "none",
                cursor: "pointer",
                fontSize: 10,
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: tab === t.id
                  ? `linear-gradient(180deg, ${T.gold}18, ${T.gold}08)`
                  : "transparent",
                color: tab === t.id ? T.gold : T.muted,
                borderRadius: "6px 6px 0 0",
                fontFamily: T.serif,
                fontWeight: tab === t.id ? "600" : "normal",
                letterSpacing: tab === t.id ? "0.03em" : "0",
                borderBottom: tab === t.id ? `1.5px solid ${T.gold}` : "1.5px solid transparent",
                transition: "all .2s",
              }}>{t.icon} {t.label}</button>
            ))}
          </div>

          {/* Swipe position dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "5px 0 0" }}>
            {TABS.map(t => (
              <div key={t.id} style={{
                height: 2, borderRadius: 2,
                width: tab === t.id ? 20 : 4,
                background: tab === t.id
                  ? `linear-gradient(90deg, ${T.goldDim}, ${T.gold})`
                  : T.faint,
                transition: "width .3s cubic-bezier(.4,0,.2,1), background .3s",
              }} />
            ))}
          </div>

        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "18px 14px" }}>

        {/* ════════════════════════════════════
            DASHBOARD
        ════════════════════════════════════ */}
        {tab === "dashboard" && (
          <div>
            {/* Month picker */}
            <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 14, paddingBottom: 2, scrollbarWidth: "none" }}>
              {avMos.map(m => <Tag key={m} label={moLabel(m)} active={fMonth === m} onClick={() => setFMonth(m)} />)}
            </div>

            {/* KPI cards */}
            <div style={{ ...s.g3, marginBottom: 12 }}>
              {[
                { label: "Income", val: incMo, color: T.green },
                { label: "Expenses", val: expMo, color: T.red },
                { label: "Balance", val: balMo, color: balMo >= 0 ? T.gold : T.red },
              ].map(({ label, val, color }) => (
                <div key={label} style={{
                  ...s.card, marginBottom: 0, textAlign: "center",
                  borderColor: color + "18",
                  background: `linear-gradient(160deg, ${color}08, ${T.card})`,
                }}>
                  <div style={{ fontSize: 8, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: "600", color, wordBreak: "break-all", letterSpacing: "-0.01em" }}>{RsS(val)}</div>
                </div>
              ))}
            </div>

            {/* Net worth */}
            <div style={{
              ...s.card,
              background: `linear-gradient(135deg, #111008 0%, #0c0c0a 60%, #0e0c08 100%)`,
              border: `1px solid ${T.goldDim}30`,
              boxShadow: `0 0 40px ${T.gold}06`,
              marginBottom: 12,
            }}>
              <div style={{ ...s.between, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Net Worth</div>
                  <div style={{ fontSize: 26, fontWeight: "bold", color: T.gold, letterSpacing: -1 }}>{Rs(netWorth)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>All-Time Balance</div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: allBal >= 0 ? T.green : T.red }}>{Rs(allBal)}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {accs.map(a => (
                  <div key={a.id} style={{ background: "#0d0d0d", borderRadius: 8, padding: "5px 10px", border: `1px solid ${a.color}25` }}>
                    <span style={{ fontSize: 10, color: T.muted }}>{a.icon} {a.name}: </span>
                    <span style={{ fontSize: 11, fontWeight: "bold", color: a.balance >= 0 ? a.color : T.red }}>{Rs(a.balance)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All-time summary */}
            <div style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ ...s.between, marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>All-Time Summary</div>
                <div style={{ fontSize: 10, color: T.muted }}>{txs.length} transactions</div>
              </div>
              <div style={s.g3}>
                {[
                  { label: "Earned", val: allInc, color: T.green },
                  { label: "Spent", val: allExp, color: T.red },
                  { label: "Saved", val: allBal, color: allBal >= 0 ? T.gold : T.red },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: "bold", color }}>{RsS(val)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6-month trend */}
            <div style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>6-Month Trend</div>
              <BarChart data={trend} />
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, fontSize: 10 }}>
                <span style={{ color: T.green }}>■ Income</span>
                <span style={{ color: T.red }}>■ Expenses</span>
              </div>
            </div>

            {/* Spending breakdown */}
            <div style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ ...s.between, marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Spending — {moLabel(fMonth)}</div>
                {expMo > 0 && <div style={{ fontSize: 10, color: T.muted }}>Total: {Rs(expMo)}</div>}
              </div>
              {Object.keys(expByCat).length === 0
                ? <Empty icon="📊" msg={`No expenses in ${moLabel(fMonth)}.`} />
                : Object.entries(expByCat).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
                  const p = pct(amt, expMo); const c = gc(cat);
                  return (
                    <div key={cat} style={{ marginBottom: 10 }}>
                      <div style={{ ...s.between, fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: T.text }}>{c.icon} {cat}</span>
                        <span style={{ color: T.sub }}>{Rs(amt)} <span style={{ color: T.muted }}>({p}%)</span></span>
                      </div>
                      <Bar pct={p} color={c.color} />
                    </div>
                  );
                })
              }
            </div>

            {/* Budget alerts */}
            {budgetAlerts.length > 0 && (
              <div style={{ ...s.card, border: `1px solid ${T.red}30`, background: "#120808", marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: T.red, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>⚠ Budget Alerts — {moLabel(fMonth)}</div>
                {budgetAlerts.map(c => {
                  const lim = parseFloat(budgets[c.name]?.amount) || 0;
                  const spent = expByCat[c.name] || 0;
                  const over = spent > lim;
                  return (
                    <div key={c.name} style={{ ...s.between, fontSize: 12, marginBottom: 6, color: over ? T.red : "#f97316" }}>
                      <span>{c.icon} {c.name}</span>
                      <span>{over ? `Over by ${Rs(spent - lim)}` : `${Rs(lim - spent)} remaining (${pct(spent, lim)}%)`}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Savings goals preview */}
            {goals.length > 0 && (
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ ...s.between, marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Savings Goals</div>
                  <button onClick={() => setTab("savings")} style={{ fontSize: 10, color: T.gold, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Manage →</button>
                </div>
                {goals.map(g => {
                  const p = pct(g.saved, g.target);
                  return (
                    <div key={g.id} style={{ marginBottom: 10 }}>
                      <div style={{ ...s.between, fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: T.text }}>{g.icon} {g.name}</span>
                        <span style={{ color: T.sub }}>{Rs(g.saved)} / {Rs(g.target)}</span>
                      </div>
                      <Bar pct={p} color={g.color} h={6} />
                      <div style={{ ...s.between, fontSize: 9, color: T.muted, marginTop: 3 }}>
                        <span>{p}%{g.deadline ? ` · Due ${g.deadline}` : ""}</span>
                        <span>{p < 100 ? `${Rs(g.target - g.saved)} to go` : "✓ Reached!"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Debts preview */}
            {debts.length > 0 && (
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ ...s.between, marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Debts & Loans</div>
                  <button onClick={() => setTab("debts")} style={{ fontSize: 10, color: T.gold, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Manage →</button>
                </div>
                <div style={{ ...s.g2, marginBottom: 10 }}>
                  {[
                    { label: "You Owe", val: totalOwed, color: T.red },
                    { label: "Owed to You", val: totalLent, color: T.green },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ background: T.inputBg, borderRadius: 8, padding: "8px 10px", border: `1px solid ${color}18` }}>
                      <div style={{ fontSize: 9, color: T.muted, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 15, fontWeight: "bold", color }}>{Rs(val)}</div>
                    </div>
                  ))}
                </div>
                {activeDebts.slice(0, 3).map(d => {
                  const rem = d.amount - d.paid; const p = pct(d.paid, d.amount);
                  const col = d.direction === "owe" ? T.red : T.green;
                  return (
                    <div key={d.id} style={{ marginBottom: 8 }}>
                      <div style={{ ...s.between, fontSize: 11, marginBottom: 2 }}>
                        <span style={{ color: T.sub }}>{d.direction === "owe" ? "↑" : "↓"} {d.name}{d.dueDate ? ` · ${d.dueDate}` : ""}</span>
                        <span style={{ color: col, fontWeight: "bold" }}>{Rs(rem)}</span>
                      </div>
                      <Bar pct={p} color={col} h={3} />
                    </div>
                  );
                })}
                {activeDebts.length > 3 && <div style={{ fontSize: 10, color: T.muted, marginTop: 4, textAlign: "center" }}>+{activeDebts.length - 3} more</div>}
              </div>
            )}

            {/* Recurring preview */}
            {recurs.length > 0 && (
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ ...s.between, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Recurring</div>
                  <button onClick={() => setTab("recurring")} style={{ fontSize: 10, color: T.gold, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Manage →</button>
                </div>
                <div style={{ ...s.between, fontSize: 11, color: T.muted, marginBottom: 8 }}>
                  <span>{recurs.length} item{recurs.length !== 1 ? "s" : ""}</span>
                  <span>Monthly commitments: <span style={{ color: T.red }}>{Rs(recurs.filter(r => r.type === "expense" && r.frequency === "Monthly").reduce((a, r) => a + r.amount, 0))}</span></span>
                </div>
                {recurs.slice(0, 4).map(r => (
                  <div key={r.id} style={{ ...s.between, fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: T.sub }}>{gc(r.category).icon} {r.note || r.category} <span style={{ color: T.faint, fontSize: 9 }}>· {r.frequency}</span></span>
                    <span style={{ color: r.type === "income" ? T.green : T.red, fontWeight: "bold" }}>{r.type === "income" ? "+" : "−"}{Rs(r.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent transactions */}
            <div style={s.card}>
              <div style={{ ...s.between, marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Recent Transactions</div>
                <button onClick={() => setTab("transactions")} style={{ fontSize: 10, color: T.gold, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>See all →</button>
              </div>
              {txs.length === 0
                ? <Empty icon="📝" msg="No transactions yet. Tap + Add to start." />
                : [...txs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).map(t => (
                  <TxRow key={t.id} t={t} gc={gc} onEdit={() => { setEditTx(t); setTxModal(true); }} onDelete={() => deleteTx(t.id)} />
                ))
              }
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            TRANSACTIONS
        ════════════════════════════════════ */}
        {tab === "transactions" && (
          <div>
            <div style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ ...s.g2, marginBottom: 8 }}>
                <input style={s.input} placeholder="🔍 Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
                <select style={s.input} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="amt_desc">Highest amount</option>
                  <option value="amt_asc">Lowest amount</option>
                </select>
              </div>
              <div style={{ ...s.g3, marginBottom: 10 }}>
                <select style={s.input} value={fMonth} onChange={e => setFMonth(e.target.value)}>
                  <option value="all">All months</option>
                  {avMos.map(m => <option key={m} value={m}>{moLabel(m)}</option>)}
                </select>
                <select style={s.input} value={fType} onChange={e => setFType(e.target.value)}>
                  <option value="all">All types</option>
                  <option value="income">Income only</option>
                  <option value="expense">Expenses only</option>
                </select>
                <select style={s.input} value={fCat} onChange={e => setFCat(e.target.value)}>
                  <option value="all">All categories</option>
                  {[...expCats, ...incCats].map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{ ...s.between, fontSize: 10, color: T.muted }}>
                <span>{filteredTxs.length} transaction{filteredTxs.length !== 1 ? "s" : ""}</span>
                <span>
                  In: <span style={{ color: T.green }}>{Rs(filteredTxs.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0))}</span>{"  "}
                  Out: <span style={{ color: T.red }}>{Rs(filteredTxs.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0))}</span>
                </span>
              </div>
            </div>
            {filteredTxs.length === 0
              ? <div style={s.card}><Empty icon="📝" msg="No transactions match your filters." /></div>
              : filteredTxs.map(t => (
                <TxRow key={t.id} t={t} gc={gc} onEdit={() => { setEditTx(t); setTxModal(true); }} onDelete={() => deleteTx(t.id)} />
              ))
            }
          </div>
        )}

        {/* ════════════════════════════════════
            BUDGET
        ════════════════════════════════════ */}
        {tab === "budget" && (
          <div>
            <div style={{ ...s.between, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Budget — {moLabel(fMonth)}</div>
              <select style={{ ...s.input, width: "auto" }} value={fMonth} onChange={e => setFMonth(e.target.value)}>
                {avMos.map(m => <option key={m} value={m}>{moLabel(m)}</option>)}
              </select>
            </div>
            <div style={{ ...s.g2, marginBottom: 12 }}>
              {[
                { label: "Budgeted", val: Object.values(budgets).reduce((a, b) => a + (parseFloat(b?.amount) || 0), 0), color: T.blue },
                { label: "Spent", val: expMo, color: T.red },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ ...s.card, marginBottom: 0 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: "bold", color }}>{Rs(val)}</div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              {expCats.map(cat => {
                const spent = expByCat[cat.name] || 0;
                const lim = parseFloat(budgets[cat.name]?.amount) || 0;
                const has = lim > 0; const over = has && spent > lim;
                const p = has ? pct(spent, lim) : 0;
                return (
                  <div key={cat.name} style={{ marginBottom: 18 }}>
                    <div style={{ ...s.between, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.text }}>{cat.icon} {cat.name}</span>
                      <div style={s.row}>
                        <span style={{ fontSize: 11, color: over ? T.red : T.muted }}>{Rs(spent)}{has ? ` / ${Rs(lim)}` : ""}</span>
                        <input type="number" placeholder="Set limit" value={budgets[cat.name]?.amount || ""}
                          onChange={e => setBudgets(b => ({ ...b, [cat.name]: { ...b[cat.name], amount: e.target.value } }))}
                          style={{ ...s.input, width: 90, padding: "5px 8px", fontSize: 11 }} min="0" />
                      </div>
                    </div>
                    {has && (
                      <>
                        <Bar pct={p} color={over ? T.red : cat.color} h={6} />
                        <div style={{ ...s.between, marginTop: 3, fontSize: 9 }}>
                          <span style={{ color: over ? T.red : T.muted }}>{over ? `⚠ Over by ${Rs(spent - lim)}` : `${Rs(lim - spent)} remaining`}</span>
                          <span style={{ color: T.faint }}>{p}%</span>
                        </div>
                      </>
                    )}
                    {!has && <div style={{ fontSize: 9, color: T.faint, marginTop: 2 }}>No limit — type a number to set one</div>}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, marginTop: 6 }}>
                <CatAdder type="expense" expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SAVINGS
        ════════════════════════════════════ */}
        {tab === "savings" && (
          <div>
            {/* Income pool */}
            <div style={{ ...s.card, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                Total Income Available to Allocate (All-Time)
              </div>
              {Object.keys(allTimeIncByCat).length === 0
                ? <Empty icon="💸" msg="Add income transactions to see available funds." />
                : incCats.filter(c => allTimeIncByCat[c.name] > 0).map(c => {
                  const total = allTimeIncByCat[c.name] || 0;
                  const alloc = allocBySrc[c.name] || 0;
                  const free = total - alloc;
                  return (
                    <div key={c.name} style={{ marginBottom: 10 }}>
                      <div style={{ ...s.between, fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: T.text }}>{c.icon} {c.name}</span>
                        <span>
                          <span style={{ color: free > 0 ? T.green : T.red }}>{Rs(free)} free</span>
                          <span style={{ color: T.faint }}> / {Rs(total)}</span>
                        </span>
                      </div>
                      <Bar pct={pct(alloc, total)} color={c.color} h={4} />
                    </div>
                  );
                })
              }
            </div>

            {/* Goal cards */}
            {goals.map(g => (
              <GoalCard key={g.id} g={g} gc={gc}
                onEdit={g => { setEditGoal(g); setGoalModal(true); }}
                onDelete={id => setGoals(p => p.filter(x => x.id !== id))}
                onAllocate={id => setAllocGoalId(id)}
                onRemoveAlloc={removeAlloc}
              />
            ))}

            <button onClick={() => { setEditGoal(null); setGoalModal(true); }}
              style={{ width: "100%", padding: 13, background: "transparent", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              + New Savings Goal
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            ACCOUNTS
        ════════════════════════════════════ */}
        {tab === "accounts" && (
          <div>
            <div style={{ ...s.card, background: "linear-gradient(135deg,#141414,#0d1a14)", border: `1px solid #1a2a1a`, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Total Balance</div>
              <div style={{ fontSize: 30, fontWeight: "bold", color: T.green, letterSpacing: -1 }}>{Rs(netWorth)}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{accs.length} account{accs.length !== 1 ? "s" : ""}</div>
            </div>
            {accs.map(a => (
              <div key={a.id} style={{ ...s.card, border: `1px solid ${a.color}1a`, marginBottom: 8 }}>
                <div style={s.between}>
                  <div style={s.row}>
                    <Pill color={a.color} icon={a.icon} />
                    <div>
                      <div style={{ fontSize: 13, color: T.text, fontWeight: "bold" }}>{a.name}</div>
                      <div style={{ fontSize: 20, fontWeight: "bold", color: a.balance >= 0 ? a.color : T.red, marginTop: 2 }}>{Rs(a.balance)}</div>
                    </div>
                  </div>
                  <div style={s.row}>
                    <button onClick={() => { setEditAcc(a); setAccModal(true); }} style={{ ...s.ghost, fontSize: 11 }}>Edit</button>
                    <button onClick={() => { if (window.confirm(`Delete "${a.name}"?`)) setAccs(p => p.filter(x => x.id !== a.id)); }}
                      style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 20, padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color = T.red}
                      onMouseLeave={e => e.currentTarget.style.color = T.faint}>×</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { setEditAcc(null); setAccModal(true); }}
              style={{ width: "100%", padding: 13, background: "transparent", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              + Add Account
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            DEBTS
        ════════════════════════════════════ */}
        {tab === "debts" && (
          <div>
            <div style={{ ...s.g2, marginBottom: 12 }}>
              {[
                { label: "You Owe", val: totalOwed, color: T.red },
                { label: "Owed to You", val: totalLent, color: T.green },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ ...s.card, marginBottom: 0 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color }}>{Rs(val)}</div>
                </div>
              ))}
            </div>
            {debts.length === 0
              ? <div style={s.card}><Empty icon="📛" msg="No debts recorded." /></div>
              : debts.map(d => {
                const rem = d.amount - d.paid;
                const p = pct(d.paid, d.amount);
                const col = d.direction === "owe" ? T.red : T.green;
                return (
                  <div key={d.id} style={{ ...s.card, border: `1px solid ${col}18`, marginBottom: 10 }}>
                    <div style={s.between}>
                      <div>
                        <div style={{ fontSize: 13, color: T.text, fontWeight: "bold" }}>{d.name}</div>
                        <div style={{ fontSize: 10, color: T.muted, marginTop: 1 }}>
                          {d.direction === "owe" ? "You owe" : "They owe you"}{d.dueDate ? ` · Due ${d.dueDate}` : ""}
                        </div>
                        {d.note && <div style={{ fontSize: 10, color: T.faint, marginTop: 1 }}>{d.note}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: "bold", color: col }}>{Rs(rem)}</div>
                        <div style={{ fontSize: 9, color: T.faint }}>of {Rs(d.amount)}</div>
                      </div>
                    </div>
                    <div style={{ margin: "10px 0 3px" }}>
                      <Bar pct={p} color={col} h={5} />
                    </div>
                    <div style={{ ...s.between, fontSize: 9, color: T.muted, marginBottom: 10 }}>
                      <span>{p}% paid</span>
                      {p >= 100 && <span style={{ color: T.green }}>✓ Settled!</span>}
                    </div>
                    {(d.payments || []).length > 0 && (
                      <div style={{ background: T.inputBg, borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
                        <div style={{ fontSize: 9, color: T.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Payment History</div>
                        {(d.payments || []).map(p => (
                          <div key={p.id} style={{ ...s.between, fontSize: 11, marginBottom: 4 }}>
                            <span style={{ color: T.sub }}>{p.date}{p.note ? ` · ${p.note}` : ""}</span>
                            <span style={{ color: T.green }}>−{Rs(p.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={s.row}>
                      {rem > 0 && (
                        <button onClick={() => { setEditDebt({ ...d, _pay: true }); setDebtModal(true); }}
                          style={{ ...s.btn("#0d1a0d", T.green), border: `1px solid ${T.green}30`, fontSize: 11, padding: "6px 10px" }}>
                          Record Payment
                        </button>
                      )}
                      <button onClick={() => { setEditDebt(d); setDebtModal(true); }} style={{ ...s.ghost, fontSize: 11 }}>Edit</button>
                      <button onClick={() => { if (window.confirm(`Delete debt "${d.name}"?`)) setDebts(p => p.filter(x => x.id !== d.id)); }}
                        style={{ ...s.ghost, fontSize: 11, color: T.red, borderColor: T.red + "22" }}>Delete</button>
                    </div>
                  </div>
                );
              })
            }
            <button onClick={() => { setEditDebt(null); setDebtModal(true); }}
              style={{ width: "100%", padding: 13, background: "transparent", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              + Add Debt / Loan
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            RECURRING
        ════════════════════════════════════ */}
        {tab === "recurring" && (
          <div>
            {recurs.length > 0 && (
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Summary</div>
                <div style={{ ...s.g2 }}>
                  {[
                    { label: "Monthly In", val: recurs.filter(r => r.type === "income" && r.frequency === "Monthly").reduce((a, r) => a + r.amount, 0), color: T.green },
                    { label: "Monthly Out", val: recurs.filter(r => r.type === "expense" && r.frequency === "Monthly").reduce((a, r) => a + r.amount, 0), color: T.red },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: 9, color: T.muted, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 15, fontWeight: "bold", color }}>{Rs(val)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {recurs.length === 0
              ? <div style={s.card}><Empty icon="🔄" msg="No recurring transactions. Add bills, subscriptions, salary." /></div>
              : recurs.map(r => {
                const c = gc(r.category);
                return (
                  <div key={r.id} style={{ ...s.card, marginBottom: 8 }}>
                    <div style={s.between}>
                      <div style={s.row}>
                        <Pill color={c.color} icon={c.icon} />
                        <div>
                          <div style={{ fontSize: 13, color: T.text, fontWeight: "bold" }}>{r.note || r.category}</div>
                          <div style={{ fontSize: 10, color: T.muted }}>{r.frequency} · {r.category}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: "bold", color: r.type === "income" ? T.green : T.red, textAlign: "right" }}>
                          {r.type === "income" ? "+" : "−"}{Rs(r.amount)}
                        </div>
                        <div style={{ ...s.row, justifyContent: "flex-end", marginTop: 6 }}>
                          <button onClick={() => postRec(r)} style={{ ...s.btn("#0d0d1a", T.blue), border: `1px solid ${T.blue}30`, fontSize: 10, padding: "4px 9px" }}>Post Now</button>
                          <button onClick={() => { setEditRec(r); setRecModal(true); }} style={{ ...s.ghost, fontSize: 10, padding: "4px 9px" }}>Edit</button>
                          <button onClick={() => setRecurs(p => p.filter(x => x.id !== r.id))}
                            style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 18, padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = T.red}
                            onMouseLeave={e => e.currentTarget.style.color = T.faint}>×</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
            <button onClick={() => { setEditRec(null); setRecModal(true); }}
              style={{ width: "100%", padding: 13, background: "transparent", border: `1px dashed ${T.border}`, borderRadius: 12, color: T.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              + Add Recurring Transaction
            </button>
          </div>
        )}

        {/* ════════════════════════════════════
            REPORTS
        ════════════════════════════════════ */}
        {tab === "reports" && (
          <div>
            <div style={s.card}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Income vs Expenses (6 months)</div>
              <BarChart data={trend} h={110} />
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, fontSize: 10 }}>
                <span style={{ color: T.green }}>■ Income</span>
                <span style={{ color: T.red }}>■ Expenses</span>
              </div>
            </div>

            <div style={s.card}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Monthly Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 8 }}>
                {["Month", "Income", "Expenses", "Balance"].map(h => (
                  <div key={h} style={{ fontSize: 9, color: T.muted, textTransform: "uppercase" }}>{h}</div>
                ))}
              </div>
              {trend.map(m => (
                <div key={m.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 11, color: T.sub }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: T.green }}>{RsS(m.inc)}</div>
                  <div style={{ fontSize: 11, color: T.red }}>{RsS(m.exp)}</div>
                  <div style={{ fontSize: 11, color: m.net >= 0 ? T.gold : T.red }}>{RsS(m.net)}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>All-Time Spending by Category</div>
              {expCats.map(c => {
                const total = txs.filter(t => t.type === "expense" && t.category === c.name).reduce((a, t) => a + t.amount, 0);
                if (!total) return null;
                const allTotal = txs.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
                const p = pct(total, allTotal);
                return (
                  <div key={c.name} style={{ marginBottom: 10 }}>
                    <div style={{ ...s.between, fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: T.text }}>{c.icon} {c.name}</span>
                      <span style={{ color: T.sub }}>{Rs(total)} ({p}%)</span>
                    </div>
                    <Bar pct={p} color={c.color} />
                  </div>
                );
              })}
              {txs.filter(t => t.type === "expense").length === 0 && <Empty icon="📊" msg="No expense data yet." />}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Total Transactions", val: txs.length.toString(), color: T.gold, icon: "📝" },
                { label: "All-Time Income", val: Rs(allInc), color: T.green, icon: "⬆" },
                { label: "All-Time Expenses", val: Rs(allExp), color: T.red, icon: "⬇" },
                { label: "Avg Monthly Expense", val: Rs(trend.reduce((a, m) => a + m.exp, 0) / (trend.filter(m => m.exp > 0).length || 1)), color: "#f97316", icon: "📊" },
                { label: "Savings Goals", val: goals.length.toString(), color: "#a78bfa", icon: "🎯" },
                { label: "Active Debts", val: activeDebts.length.toString(), color: T.red, icon: "📛" },
              ].map(({ label, val, color, icon }) => (
                <div key={label} style={{ ...s.card, marginBottom: 0 }}>
                  <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{icon} {label}</div>
                  <div style={{ fontSize: 15, fontWeight: "bold", color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            SETTINGS
        ════════════════════════════════════ */}
        {tab === "settings" && (
          <div>
            <div style={s.card}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Profile</div>
              <div style={{ ...s.row, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.gold + "18", border: `1px solid ${T.gold}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
                <div style={{ fontSize: 18, color: T.gold, fontWeight: "bold" }}>{pname}</div>
              </div>
              <button onClick={() => setProfModal(true)} style={{ ...s.ghost, width: "100%" }}>Edit Name</button>
            </div>

            <div style={s.card}>
              <div style={{ ...s.between, marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Categories</div>
                <button onClick={() => setCatModal(true)} style={{ ...s.btn(), padding: "6px 12px", fontSize: 11 }}>Manage All</button>
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>{expCats.length} expense · {incCats.length} income categories</div>
            </div>

            <div style={s.card}>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Data Management</div>
              <button onClick={() => {
                const data = JSON.stringify({ txs, budgets, goals, accs, debts, recurs, expCats, incCats, pname }, null, 2);
                const a = document.createElement("a");
                a.href = "data:application/json," + encodeURIComponent(data);
                a.download = `mizan-backup-${today()}.json`; a.click();
              }} style={{ ...s.ghost, width: "100%", marginBottom: 8 }}>📤 Export All Data (JSON)</button>
              <button onClick={() => {
                if (window.confirm("⚠ This will permanently erase ALL your Mizan data. This cannot be undone.\n\nAre you sure?")) {
                  localStorage.clear(); window.location.reload();
                }
              }} style={{ ...s.ghost, width: "100%", color: T.red, borderColor: T.red + "30" }}>🗑 Reset All Data</button>
            </div>

            <div style={{
              ...s.card,
              textAlign: "center",
              background: `linear-gradient(160deg, ${T.gold}08, ${T.card})`,
              border: `1px solid ${T.goldDim}25`,
            }}>
              <div style={{ fontSize: 15, color: T.goldDim, letterSpacing: "0.3em", fontFamily: T.mono, marginBottom: 8, opacity: 0.7 }}>مِيزَان</div>
              <div style={{ fontSize: 22, fontWeight: "300", color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>Mizan</div>
              <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${T.goldDim}, transparent)`, margin: "10px auto" }}/>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>Personal Finance · Data stays on this device</div>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════
          MODALS
      ════════════════════════════════════ */}
      {txModal && (
        <TxModal onClose={() => { setTxModal(false); setEditTx(null); }} onSave={saveTx}
          initial={editTx} expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} accs={accs} />
      )}
      {goalModal && (
        <GoalModal onClose={() => { setGoalModal(false); setEditGoal(null); }} onSave={saveGoal} initial={editGoal} />
      )}
      {allocGoalId && (
        <AllocModal onClose={() => setAllocGoalId(null)} onSave={(amt, src) => allocGoal(allocGoalId, amt, src)}
          incCats={incCats} incByCat={allTimeIncByCat} allocBySrc={allocBySrc} gc={gc} />
      )}
      {accModal && (
        <AccModal onClose={() => { setAccModal(false); setEditAcc(null); }} onSave={saveAcc} initial={editAcc} />
      )}
      {debtModal && (
        <DebtModal onClose={() => { setDebtModal(false); setEditDebt(null); }} onSave={saveDebt}
          initial={editDebt} accs={accs} onPay={payDebt} />
      )}
      {recModal && (
        <RecModal onClose={() => { setRecModal(false); setEditRec(null); }} onSave={saveRec}
          initial={editRec} expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} accs={accs} />
      )}
      {catModal && (
        <CatModal onClose={() => setCatModal(false)} expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} />
      )}
      {profModal && (
        <Modal title="Edit Profile" onClose={() => setProfModal(false)}>
          <ProfForm name={pname} onSave={n => { setPname(n); setProfModal(false); }} onClose={() => setProfModal(false)} />
        </Modal>
      )}
    </div>
  );
}

// ─── Modal forms ──────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return <div style={{ marginBottom: 12 }}><label style={s.label}>{label}</label>{children}</div>;
}

function TxModal({ onClose, onSave, initial, expCats, setExpCats, incCats, setIncCats, accs }) {
  const [type, setType] = useState(initial?.type || "expense");
  const [cat, setCat] = useState(initial?.category || "");
  const [amt, setAmt] = useState(initial?.amount || "");
  const [note, setNote] = useState(initial?.note || "");
  const [date, setDate] = useState(initial?.date || today());
  const [accId, setAccId] = useState(initial?.accountId || "");
  const [err, setErr] = useState("");
  const cats = type === "income" ? incCats : expCats;

  const save = () => {
    if (!cat) { setErr("Select a category."); return; }
    const a = parseFloat(amt); if (!a || a <= 0) { setErr("Enter a valid amount."); return; }
    onSave({ type, category: cat, amount: a, note, date, accountId: accId || null });
  };

  return (
    <Modal title={initial ? "Edit Transaction" : "New Transaction"} onClose={onClose}>
      <div style={s.g2}>
        <Field label="Type">
          <select style={s.input} value={type} onChange={e => { setType(e.target.value); setCat(""); }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </Field>
        <Field label="Category">
          <select style={s.input} value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">— Select —</option>
            {cats.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ marginBottom: 12 }}>
        <CatAdder type={type} expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} />
      </div>
      <div style={s.g2}>
        <Field label="Amount (Rs)">
          <input style={s.input} type="number" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} min="0" />
        </Field>
        <Field label="Date">
          <input style={s.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
        </Field>
      </div>
      <Field label="Note (optional)">
        <input style={s.input} placeholder="e.g. Groceries, Monthly salary" value={note} onChange={e => setNote(e.target.value)} />
      </Field>
      <Field label="Account (optional)">
        <select style={s.input} value={accId} onChange={e => setAccId(e.target.value)}>
          <option value="">— None —</option>
          {accs.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name} (Balance: {Rs(a.balance)})</option>)}
        </select>
      </Field>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={save}>{initial ? "Save Changes" : "Add Transaction"}</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function GoalModal({ onClose, onSave, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [target, setTarget] = useState(initial?.target || "");
  const [icon, setIcon] = useState(initial?.icon || "🎯");
  const [color, setColor] = useState(initial?.color || T.gold);
  const [deadline, setDeadline] = useState(initial?.deadline || "");
  const [err, setErr] = useState("");

  const save = () => {
    if (!name.trim()) { setErr("Enter a goal name."); return; }
    const t = parseFloat(target); if (!t || t <= 0) { setErr("Enter a valid target amount."); return; }
    onSave({ name: name.trim(), target: t, icon, color, deadline });
  };

  return (
    <Modal title={initial ? "Edit Goal" : "New Savings Goal"} onClose={onClose}>
      <Field label="Icon"><IconPicker icons={GICONS} value={icon} onChange={setIcon} /></Field>
      <Field label="Color"><ColorPicker colors={GCOLS} value={color} onChange={setColor} /></Field>
      <Field label="Goal Name">
        <input style={s.input} placeholder="e.g. Hajj fund, New laptop, Travel" value={name} onChange={e => setName(e.target.value)} />
      </Field>
      <div style={s.g2}>
        <Field label="Target (Rs)">
          <input style={s.input} type="number" placeholder="0.00" value={target} onChange={e => setTarget(e.target.value)} min="0" />
        </Field>
        <Field label="Deadline (optional)">
          <input style={s.input} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </Field>
      </div>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={save}>{initial ? "Save" : "Create Goal"}</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function AllocModal({ onClose, onSave, incCats, incByCat, allocBySrc, gc }) {
  const [src, setSrc] = useState("");
  const [amt, setAmt] = useState("");
  const [err, setErr] = useState("");

  const save = () => {
    if (!src) { setErr("Select an income source."); return; }
    const a = parseFloat(amt); if (!a || a <= 0) { setErr("Enter a valid amount."); return; }
    const avail = Math.max(0, (incByCat[src] || 0) - (allocBySrc[src] || 0));
    if (a > avail) { setErr(`Only ${Rs(avail)} available from ${src}.`); return; }
    onSave(a, src);
  };

  return (
    <Modal title="Allocate to Savings Goal" onClose={onClose}>
      <div style={{ background: T.inputBg, borderRadius: 8, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Available Funds (this month)</div>
        {incCats.map(c => {
          const avail = Math.max(0, (incByCat[c.name] || 0) - (allocBySrc[c.name] || 0));
          return (
            <div key={c.name} style={{ ...s.between, fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: T.sub }}>{c.icon} {c.name}</span>
              <span style={{ color: avail > 0 ? T.green : T.faint }}>{Rs(avail)} free</span>
            </div>
          );
        })}
      </div>
      <Field label="Income Source">
        <select style={s.input} value={src} onChange={e => { setSrc(e.target.value); setErr(""); }}>
          <option value="">— Select source —</option>
          {incCats.map(c => {
            const avail = Math.max(0, (incByCat[c.name] || 0) - (allocBySrc[c.name] || 0));
            return <option key={c.name} value={c.name}>{c.icon} {c.name} ({Rs(avail)} free)</option>;
          })}
        </select>
      </Field>
      <Field label="Amount (Rs)">
        <input style={s.input} type="number" placeholder="0.00" value={amt} onChange={e => { setAmt(e.target.value); setErr(""); }} min="0" />
      </Field>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={save}>Allocate</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function AccModal({ onClose, onSave, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [icon, setIcon] = useState(initial?.icon || "💵");
  const [color, setColor] = useState(initial?.color || T.green);
  const [balance, setBalance] = useState(initial?.balance ?? "");
  const [err, setErr] = useState("");

  return (
    <Modal title={initial ? "Edit Account" : "New Account"} onClose={onClose}>
      <Field label="Icon"><IconPicker icons={ACCICONS} value={icon} onChange={setIcon} /></Field>
      <Field label="Color"><ColorPicker colors={PAL.slice(0, 10)} value={color} onChange={setColor} /></Field>
      <Field label="Account Name">
        <input style={s.input} placeholder="e.g. MCB Bank, Cash Wallet, SBI" value={name} onChange={e => setName(e.target.value)} />
      </Field>
      <Field label="Starting Balance (Rs)">
        <input style={s.input} type="number" placeholder="0.00" value={balance} onChange={e => setBalance(e.target.value)} />
      </Field>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={() => {
          if (!name.trim()) { setErr("Enter account name."); return; }
          onSave({ name: name.trim(), icon, color, balance: parseFloat(balance) || 0 });
        }}>{initial ? "Save" : "Add Account"}</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function DebtModal({ onClose, onSave, initial, accs, onPay }) {
  const isPay = initial?._pay;
  const [name, setName] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount || "");
  const [direction, setDirection] = useState(initial?.direction || "owe");
  const [dueDate, setDueDate] = useState(initial?.dueDate || "");
  const [note, setNote] = useState(initial?.note || "");
  const [payAmt, setPayAmt] = useState("");
  const [payAccId, setPayAccId] = useState("");
  const [payNote, setPayNote] = useState("");
  const [err, setErr] = useState("");

  if (isPay) {
    const rem = initial.amount - initial.paid;
    const save = () => {
      const a = parseFloat(payAmt);
      if (!a || a <= 0) { setErr("Enter a valid amount."); return; }
      if (a > rem) { setErr(`Maximum payment is ${Rs(rem)}.`); return; }
      const acc = accs.find(x => x.id === payAccId);
      if (acc && a > acc.balance) { setErr(`Insufficient balance in ${acc.name} (${Rs(acc.balance)}).`); return; }
      onPay(initial.id, a, payAccId || null, payNote);
      onClose();
    };
    return (
      <Modal title={`Record Payment — ${initial.name}`} onClose={onClose}>
        <div style={{ background: T.inputBg, borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ ...s.between, fontSize: 12 }}>
            <span style={{ color: T.sub }}>Remaining debt</span>
            <span style={{ color: T.red, fontWeight: "bold", fontSize: 16 }}>{Rs(rem)}</span>
          </div>
          <div style={{ marginTop: 6 }}><Bar pct={pct(initial.paid, initial.amount)} color={T.green} h={4} /></div>
          <div style={{ fontSize: 9, color: T.muted, marginTop: 3 }}>{pct(initial.paid, initial.amount)}% already paid</div>
        </div>
        <Field label="Payment Amount (Rs)">
          <input style={s.input} type="number" placeholder="0.00" value={payAmt} onChange={e => { setPayAmt(e.target.value); setErr(""); }} min="0" autoFocus />
        </Field>
        <Field label="Pay From Account (optional)">
          <select style={s.input} value={payAccId} onChange={e => { setPayAccId(e.target.value); setErr(""); }}>
            <option value="">— Cash / External —</option>
            {accs.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name} (Balance: {Rs(a.balance)})</option>)}
          </select>
        </Field>
        <Field label="Note (optional)">
          <input style={s.input} placeholder="e.g. Bank transfer, Cash payment" value={payNote} onChange={e => setPayNote(e.target.value)} />
        </Field>
        <ErrMsg msg={err} />
        <div style={{ ...s.g2, marginTop: 14 }}>
          <button style={{ ...s.btn("#0d1a0d", T.green), border: `1px solid ${T.green}30`, width: "100%" }} onClick={save}>Record Payment</button>
          <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
        </div>
      </Modal>
    );
  }

  const save = () => {
    if (!name.trim()) { setErr("Enter a name."); return; }
    const a = parseFloat(amount); if (!a || a <= 0) { setErr("Enter a valid amount."); return; }
    onSave({ name: name.trim(), amount: a, direction, dueDate, note });
  };

  return (
    <Modal title={initial ? "Edit Debt" : "New Debt / Loan"} onClose={onClose}>
      <Field label="Person / Label">
        <input style={s.input} placeholder="e.g. Ali, MCB Loan, Car Loan" value={name} onChange={e => setName(e.target.value)} />
      </Field>
      <div style={s.g2}>
        <Field label="Amount (Rs)">
          <input style={s.input} type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" />
        </Field>
        <Field label="Direction">
          <select style={s.input} value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="owe">I owe them</option>
            <option value="lent">They owe me</option>
          </select>
        </Field>
      </div>
      <div style={s.g2}>
        <Field label="Due Date (optional)">
          <input style={s.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </Field>
        <Field label="Note (optional)">
          <input style={s.input} placeholder="What for?" value={note} onChange={e => setNote(e.target.value)} />
        </Field>
      </div>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={save}>{initial ? "Save Changes" : "Add Debt"}</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function RecModal({ onClose, onSave, initial, expCats, setExpCats, incCats, setIncCats, accs }) {
  const [type, setType] = useState(initial?.type || "expense");
  const [cat, setCat] = useState(initial?.category || "");
  const [amt, setAmt] = useState(initial?.amount || "");
  const [note, setNote] = useState(initial?.note || "");
  const [freq, setFreq] = useState(initial?.frequency || "Monthly");
  const [accId, setAccId] = useState(initial?.accountId || "");
  const [err, setErr] = useState("");
  const cats = type === "income" ? incCats : expCats;

  const save = () => {
    if (!cat) { setErr("Select a category."); return; }
    const a = parseFloat(amt); if (!a || a <= 0) { setErr("Enter a valid amount."); return; }
    onSave({ type, category: cat, amount: a, note, frequency: freq, accountId: accId || null });
  };

  return (
    <Modal title={initial ? "Edit Recurring" : "New Recurring Transaction"} onClose={onClose}>
      <div style={s.g2}>
        <Field label="Type">
          <select style={s.input} value={type} onChange={e => { setType(e.target.value); setCat(""); }}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </Field>
        <Field label="Category">
          <select style={s.input} value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">— Select —</option>
            {cats.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ marginBottom: 12 }}>
        <CatAdder type={type} expCats={expCats} setExpCats={setExpCats} incCats={incCats} setIncCats={setIncCats} />
      </div>
      <div style={s.g2}>
        <Field label="Amount (Rs)">
          <input style={s.input} type="number" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} min="0" />
        </Field>
        <Field label="Frequency">
          <select style={s.input} value={freq} onChange={e => setFreq(e.target.value)}>
            {RFREQ.map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <div style={s.g2}>
        <Field label="Note (optional)">
          <input style={s.input} placeholder="e.g. Netflix, Rent, Salary" value={note} onChange={e => setNote(e.target.value)} />
        </Field>
        <Field label="Account (optional)">
          <select style={s.input} value={accId} onChange={e => setAccId(e.target.value)}>
            <option value="">— None —</option>
            {accs.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
          </select>
        </Field>
      </div>
      <ErrMsg msg={err} />
      <div style={{ ...s.g2, marginTop: 14 }}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={save}>{initial ? "Save" : "Add"}</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

function CatModal({ onClose, expCats, setExpCats, incCats, setIncCats }) {
  const [ct, setCt] = useState("expense");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [color, setColor] = useState(PAL[0]);
  const [err, setErr] = useState("");
  const list = ct === "expense" ? expCats : incCats;
  const setList = ct === "expense" ? setExpCats : setIncCats;

  const add = () => {
    if (!name.trim()) { setErr("Enter a name."); return; }
    if (list.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) { setErr("Already exists."); return; }
    setList(p => [...p, { name: name.trim(), icon, color, type: ct }]);
    setName(""); setIcon("📦"); setColor(PAL[0]); setErr("");
  };

  return (
    <Modal title="Manage Categories" onClose={onClose} wide>
      <div style={{ ...s.g2, marginBottom: 14 }}>
        {["expense", "income"].map(t => (
          <button key={t} onClick={() => setCt(t)} style={{ ...s.btn(ct === t ? T.gold : "transparent", ct === t ? "#0f0f0f" : T.sub), border: `1px solid ${ct === t ? T.gold : T.border2}`, width: "100%", textTransform: "capitalize" }}>
            {t === "expense" ? "💸 Expense" : "💰 Income"}
          </button>
        ))}
      </div>
      <div style={{ background: T.inputBg, borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Add New {ct} Category</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {EMOJIS.slice(0, 32).map(ic => (
            <button key={ic} onClick={() => setIcon(ic)} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 12, background: icon === ic ? T.faint : "transparent", border: icon === ic ? `1px solid ${T.gold}` : `1px solid ${T.border}`, cursor: "pointer" }}>{ic}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          {PAL.map(c => <button key={c} onClick={() => setColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />)}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "25", border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
          <input style={{ ...s.input, flex: 1 }} placeholder="Category name" value={name}
            onChange={e => { setName(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && add()} />
          <button style={{ ...s.btn(), padding: "0 16px", fontSize: 18 }} onClick={add}>+</button>
        </div>
        <ErrMsg msg={err} />
      </div>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 8 }}>{list.length} {ct} categories</div>
      <div style={{ maxHeight: 240, overflowY: "auto" }}>
        {list.map(c => (
          <div key={c.name} style={{ ...s.between, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={s.row}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: c.color + "18", border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{c.icon}</div>
              <span style={{ fontSize: 12, color: T.text }}>{c.name}</span>
            </div>
            <button onClick={() => setList(p => p.filter(x => x.name !== c.name))}
              style={{ background: "none", border: "none", color: T.faint, cursor: "pointer", fontSize: 18, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = T.red}
              onMouseLeave={e => e.currentTarget.style.color = T.faint}>×</button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function ProfForm({ name, onSave, onClose }) {
  const [v, setV] = useState(name);
  return (
    <>
      <Field label="Your Name">
        <input style={s.input} value={v} onChange={e => setV(e.target.value.toUpperCase())} placeholder="Your name" autoFocus />
      </Field>
      <div style={s.g2}>
        <button style={{ ...s.btn(), width: "100%" }} onClick={() => v.trim() && onSave(v.trim())}>Save</button>
        <button style={{ ...s.ghost, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </>
  );
}