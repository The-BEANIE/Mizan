
import { useState, useMemo } from "react";

const DEFAULT_EXPENSE_CATS = ["Food", "Transport", "Bills", "Health", "Entertainment", "Shopping", "Other"];
const DEFAULT_INCOME_CATS = ["Salary", "Freelance", "Gift", "Investment", "Other"];

const fmt = (n) =>
  `Rs ${Math.abs(n).toLocaleString("en-MU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DEFAULT_COLORS = {
  Food: "#ef4444", Transport: "#f97316", Bills: "#eab308",
  Health: "#22c55e", Entertainment: "#8b5cf6", Shopping: "#ec4899",
  Other: "#6b7280", Salary: "#14b8a6", Freelance: "#06b6d4",
  Gift: "#a78bfa", Investment: "#34d399",
};

const CAT_COLOR_POOL = [
  "#ef4444","#f97316","#eab308","#22c55e","#8b5cf6","#ec4899",
  "#6b7280","#14b8a6","#06b6d4","#a78bfa","#34d399","#f43f5e",
  "#84cc16","#0ea5e9","#d946ef","#fb923c","#4ade80","#38bdf8",
];

const GOAL_COLORS = [
  "#c9b99a","#22c55e","#06b6d4","#a78bfa","#f97316",
  "#ec4899","#34d399","#eab308","#8b5cf6","#14b8a6",
];

const DEFAULT_ICONS = {
  Food:"🍛",Transport:"🚌",Bills:"💡",Health:"💊",
  Entertainment:"🎬",Shopping:"🛍️",Other:"📦",
  Salary:"💼",Freelance:"💻",Gift:"🎁",Investment:"📈",
};

const GOAL_ICONS = ["🎯","✈️","🏠","🚗","💍","📱","🎓","💰","🕌","🌍","👔","🏋️"];
const CAT_ICONS  = ["📦","🍕","🚀","🎮","🧴","📚","🏥","🐾","🎵","🌿","⚡","🏖️","💳","🧳","🎁","🔧","🍺","👟"];

const inputStyle = {
  background:"#111",border:"1px solid #2a2a2a",borderRadius:8,
  color:"#e8e0d0",padding:"10px 12px",fontSize:13,
  fontFamily:"'Georgia', serif",width:"100%",boxSizing:"border-box",outline:"none",
};

const cardStyle = {
  background:"#1a1a1a",border:"1px solid #2a2a2a",
  borderRadius:12,padding:20,marginBottom:16,
};

const EmptyState = ({ icon, message }) => (
  <div style={{textAlign:"center",padding:"36px 20px",color:"#444",fontSize:13}}>
    <div style={{fontSize:30,marginBottom:10}}>{icon}</div>
    <div>{message}</div>
  </div>
);

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onComplete }) {
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr]     = useState("");

  const handleStart = () => {
    if (!name.trim()) { setErr("Please enter your name."); return; }
    onComplete({ name: name.trim().toUpperCase(), phone: phone.trim() });
  };

  return (
    <div style={{
      fontFamily:"'Georgia', serif",background:"#0f0f0f",
      minHeight:"100vh",color:"#e8e0d0",
      display:"flex",alignItems:"center",justifyContent:"center",padding:24,
    }}>
      <div style={{maxWidth:380,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:40,marginBottom:8}}>مِيزَان</div>
          <div style={{fontSize:26,fontWeight:"bold",color:"#c9b99a",letterSpacing:"-0.5px"}}>Mizan</div>
          <div style={{fontSize:13,color:"#444",marginTop:6}}>your personal balance</div>
        </div>

        <div style={cardStyle}>
          <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:20}}>
            Let's personalise your app
          </div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"#666",marginBottom:6}}>Your name <span style={{color:"#ef4444"}}>*</span></div>
            <input
              placeholder="e.g. Beanie"
              value={name}
              onChange={(e) => { setName(e.target.value); setErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              style={inputStyle}
            />
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:"#666",marginBottom:6}}>Phone number <span style={{color:"#444"}}>(optional)</span></div>
            <input
              placeholder="e.g. +230 5XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              style={inputStyle}
              type="tel"
            />
          </div>

          {err && <div style={{fontSize:12,color:"#ef4444",marginBottom:12}}>{err}</div>}

          <button onClick={handleStart} style={{
            width:"100%",background:"#c9b99a",color:"#0f0f0f",border:"none",
            borderRadius:8,padding:"12px",fontWeight:"bold",cursor:"pointer",
            fontFamily:"inherit",fontSize:14,
          }}>Enter Mizan →</button>
        </div>

        <div style={{textAlign:"center",fontSize:11,color:"#333",marginTop:16}}>
          You can update your profile anytime from Settings
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  };
  return [storedValue, setValue];
}
export default function Mizan() {
  // Profile
  const [profile, setProfile] = useLocalStorage("mizan_profile", null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");

  // Tabs
  const [tab, setTab] = useState("dashboard");

  // Categories (custom)
  const [expenseCats, setExpenseCats] = useState(
    DEFAULT_EXPENSE_CATS.map((name, i) => ({
      name, color: DEFAULT_COLORS[name] || CAT_COLOR_POOL[i % CAT_COLOR_POOL.length],
      icon: DEFAULT_ICONS[name] || "📦", type: "expense",
    }))
  );
  const [incomeCats, setIncomeCats] = useState(
    DEFAULT_INCOME_CATS.map((name, i) => ({
      name, color: DEFAULT_COLORS[name] || CAT_COLOR_POOL[i % CAT_COLOR_POOL.length],
      icon: DEFAULT_ICONS[name] || "💰", type: "income",
    }))
  );
  
  const [catTab, setCatTab]   = useState("expense");
  const [newCatName, setNewCatName]   = useState("");
  const [newCatIcon, setNewCatIcon]   = useState("📦");
  const [newCatColor, setNewCatColor] = useState(CAT_COLOR_POOL[0]);
  const [catErr, setCatErr]   = useState("");

  // Transactions
  //
  const [transactions, setTransactions] = useLocalStorage("mizan_transactions", [])
  const [form, setForm] = useState({
    type:"expense", category:"", amount:"", note:"",
    date: new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState("");

  // Budgets — keyed by category name
  const [budgets, setBudgets] = useLocalStorage("mizan_budgets", {});

  // Savings goals
  const [goals, setGoals] = useLocalStorage("mizan_goals", []);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm]         = useState({ name:"", targetAmount:"", icon:"🎯", color:"#c9b99a" });
  const [goalFormErr, setGoalFormErr]   = useState("");
  const [activeGoal, setActiveGoal]     = useState(null);
  const [allocateGoalId, setAllocateGoalId] = useState(null);
  const [allocateAmount, setAllocateAmount] = useState("");
  const [allocateSource, setAllocateSource] = useState("");
  const [allocateErr, setAllocateErr]   = useState("");

  // ── Derived ──
  const allExpenseCatNames = useMemo(() => expenseCats.map((c) => c.name), [expenseCats]);
  const allIncomeCatNames  = useMemo(() => incomeCats.map((c) => c.name), [incomeCats]);

  const catMeta = useMemo(() => {
    const map = {};
    [...expenseCats, ...incomeCats].forEach((c) => { map[c.name] = c; });
    return map;
  }, [expenseCats, incomeCats]);

  const getCatColor = (name) => catMeta[name]?.color || "#6b7280";
  const getCatIcon  = (name) => catMeta[name]?.icon  || "📦";

  const totalIncome   = useMemo(() => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance       = totalIncome - totalExpenses;

  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === "income").forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [transactions]);

  const allocatedBySource = useMemo(() => {
    const map = {};
    goals.flatMap((g) => g.allocations).forEach((a) => { map[a.source] = (map[a.source] || 0) + a.amount; });
    return map;
  }, [goals]);

  // ── Handlers ──
  const addTransaction = () => {
    const amt = parseFloat(form.amount);
    if (!form.category) { setFormError("Select a category."); return; }
    if (!form.amount || isNaN(amt) || amt <= 0) { setFormError("Enter a valid amount."); return; }
    setFormError("");
    setTransactions((prev) => [...prev, { ...form, id: Date.now(), amount: amt }]);
    setForm((f) => ({ ...f, amount: "", note: "" }));
  };

  const deleteTransaction = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const addCategory = () => {
    if (!newCatName.trim()) { setCatErr("Enter a category name."); return; }
    const list = catTab === "expense" ? expenseCats : incomeCats;
    if (list.find((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      setCatErr("Category already exists."); return;
    }
    const newCat = { name: newCatName.trim(), color: newCatColor, icon: newCatIcon, type: catTab };
    if (catTab === "expense") setExpenseCats((prev) => [...prev, newCat]);
    else setIncomeCats((prev) => [...prev, newCat]);
    setCatErr(""); setNewCatName(""); setNewCatIcon("📦"); setNewCatColor(CAT_COLOR_POOL[0]);
  };

  const deleteCategory = (name, type) => {
    if (type === "expense") setExpenseCats((prev) => prev.filter((c) => c.name !== name));
    else setIncomeCats((prev) => prev.filter((c) => c.name !== name));
  };

  const addGoal = () => {
    if (!goalForm.name.trim()) { setGoalFormErr("Give your goal a name."); return; }
    const target = parseFloat(goalForm.targetAmount);
    if (!target || target <= 0) { setGoalFormErr("Enter a valid target amount."); return; }
    setGoalFormErr("");
    setGoals((prev) => [...prev, { id: Date.now(), name: goalForm.name.trim(), target, saved: 0, icon: goalForm.icon, color: goalForm.color, allocations: [] }]);
    setGoalForm({ name:"", targetAmount:"", icon:"🎯", color:"#c9b99a" });
    setShowGoalForm(false);
  };

  const deleteGoal = (id) => { setGoals((prev) => prev.filter((g) => g.id !== id)); if (activeGoal === id) setActiveGoal(null); };

  const allocateToGoal = (goalId) => {
    const amt = parseFloat(allocateAmount);
    if (!allocateSource) { setAllocateErr("Select an income source."); return; }
    if (!amt || amt <= 0) { setAllocateErr("Enter a valid amount."); return; }
    const available = Math.max(0, (incomeByCategory[allocateSource] || 0) - (allocatedBySource[allocateSource] || 0));
    if (amt > available) { setAllocateErr(`Only ${fmt(available)} free from ${allocateSource}.`); return; }
    setAllocateErr("");
    setGoals((prev) => prev.map((g) => g.id !== goalId ? g : {
      ...g, saved: g.saved + amt,
      allocations: [...g.allocations, { id: Date.now(), date: new Date().toISOString().split("T")[0], amount: amt, source: allocateSource }],
    }));
    setAllocateAmount(""); setAllocateGoalId(null);
  };

  const removeAllocation = (goalId, allocId) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g;
      const alloc = g.allocations.find((a) => a.id === allocId);
      return { ...g, saved: Math.max(0, g.saved - (alloc?.amount || 0)), allocations: g.allocations.filter((a) => a.id !== allocId) };
    }));
  };

  // ── Greeting ──
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // ── Setup screen ──
  if (!profile) {
    return <SetupScreen onComplete={(p) => { setProfile(p); setSettingsName(p.name); setSettingsPhone(p.phone); }} />;
  }

  const tabs = ["dashboard","transactions","budget","savings","categories"];

  return (
    <div style={{fontFamily:"'Georgia', serif",background:"#0f0f0f",minHeight:"100vh",color:"#e8e0d0"}}>

      {/* ── Header ── */}
      <div style={{
        background:"linear-gradient(135deg, #1a1a1a, #0d1117)",
        borderBottom:"1px solid #2a2a2a",
        padding:"16px 20px 0",
        position:"sticky",top:0,zIndex:10,
      }}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontSize:20,fontWeight:"bold",color:"#c9b99a",letterSpacing:"-0.5px"}}>Mizan</span>
                <span style={{fontSize:11,color:"#333",fontFamily:"monospace"}}>مِيزَان</span>
              </div>
              <div style={{fontSize:13,color:"#888",marginTop:2}}>
                {getGreeting()}, <span style={{color:"#c9b99a",fontWeight:"bold"}}>{profile.name}</span> 👋
              </div>
              {profile.phone && (
                <div style={{fontSize:11,color:"#444",marginTop:1,fontFamily:"monospace"}}>
                  {profile.phone}
                </div>
              )}
            </div>
            <button
              onClick={() => { setShowSettings(true); setSettingsName(profile.name); setSettingsPhone(profile.phone); }}
              style={{background:"#1e1e1e",border:"1px solid #2a2a2a",borderRadius:8,color:"#666",cursor:"pointer",fontSize:11,padding:"6px 12px",fontFamily:"inherit"}}
            >
              ⚙ Profile
            </button>
          </div>

          <div style={{display:"flex",gap:2,overflowX:"auto",paddingBottom:0}}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:"7px 12px",border:"none",cursor:"pointer",fontSize:11,whiteSpace:"nowrap",
                background: tab === t ? "#c9b99a" : "transparent",
                color: tab === t ? "#0f0f0f" : "#555",
                borderRadius:"6px 6px 0 0",fontFamily:"inherit",
                fontWeight: tab === t ? "bold" : "normal",
                textTransform:"capitalize",letterSpacing:0.5,
                flexShrink:0,
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profile Settings Modal ── */}
      {showSettings && (
        <div style={{
          position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,
          display:"flex",alignItems:"center",justifyContent:"center",padding:20,
        }}>
          <div style={{...cardStyle,width:"100%",maxWidth:360,marginBottom:0}}>
            <div style={{fontSize:13,color:"#888",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Edit Profile</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:12,color:"#555",marginBottom:6}}>Name</div>
              <input value={settingsName} onChange={(e) => setSettingsName(e.target.value.toUpperCase())} style={inputStyle} placeholder="Your name" />
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,color:"#555",marginBottom:6}}>Phone number</div>
              <input value={settingsPhone} onChange={(e) => setSettingsPhone(e.target.value)} style={inputStyle} placeholder="+230 5XXX XXXX" type="tel" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={() => { setProfile({ name: settingsName || profile.name, phone: settingsPhone }); setShowSettings(false); }} style={{
                background:"#c9b99a",color:"#0f0f0f",border:"none",borderRadius:8,
                padding:"10px",fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",fontSize:13,
              }}>Save</button>
              <button onClick={() => setShowSettings(false)} style={{
                background:"#111",color:"#666",border:"1px solid #2a2a2a",borderRadius:8,
                padding:"10px",cursor:"pointer",fontFamily:"inherit",fontSize:13,
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px"}}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[
                {label:"Income",value:totalIncome,color:"#22c55e"},
                {label:"Expenses",value:totalExpenses,color:"#ef4444"},
                {label:"Balance",value:balance,color:balance>=0?"#c9b99a":"#ef4444"},
              ].map(({label,value,color}) => (
                <div key={label} style={{...cardStyle,marginBottom:0}}>
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{label}</div>
                  <div style={{fontSize:14,fontWeight:"bold",color,wordBreak:"break-all"}}>{fmt(value)}</div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Spending by Category</div>
              {Object.keys(expenseByCategory).length === 0
                ? <EmptyState icon="📊" message="No expenses yet." />
                : Object.entries(expenseByCategory).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => {
                    const pct = totalExpenses > 0 ? Math.round((amt/totalExpenses)*100) : 0;
                    return (
                      <div key={cat} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                          <span style={{color:"#ccc"}}>{getCatIcon(cat)} {cat}</span>
                          <span style={{color:"#777"}}>{fmt(amt)} <span style={{color:"#444"}}>({pct}%)</span></span>
                        </div>
                        <div style={{height:5,background:"#222",borderRadius:3}}>
                          <div style={{height:5,borderRadius:3,width:`${pct}%`,background:getCatColor(cat),transition:"width 0.4s"}}/>
                        </div>
                      </div>
                    );
                  })
              }
            </div>

            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Savings Goals</div>
              {goals.length === 0
                ? <EmptyState icon="🎯" message="No savings goals yet." />
                : goals.map((g) => {
                    const pct = g.target > 0 ? Math.min(100,Math.round((g.saved/g.target)*100)) : 0;
                    return (
                      <div key={g.id} style={{marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                          <span style={{color:"#ccc"}}>{g.icon} {g.name}</span>
                          <span style={{color:"#777"}}>{fmt(g.saved)} / {fmt(g.target)}</span>
                        </div>
                        <div style={{height:6,background:"#222",borderRadius:3}}>
                          <div style={{height:6,borderRadius:3,width:`${pct}%`,background:g.color,transition:"width 0.4s"}}/>
                        </div>
                        <div style={{fontSize:11,color:"#444",marginTop:3}}>{pct}% reached</div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        )}

        {/* ══ TRANSACTIONS ══ */}
        {tab === "transactions" && (
          <div>
            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Add Transaction</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <select value={form.type}
                  onChange={(e) => setForm((f) => ({...f,type:e.target.value,category:""}))}
                  style={inputStyle}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={form.category}
                  onChange={(e) => setForm((f) => ({...f,category:e.target.value}))}
                  style={inputStyle}>
                  <option value="">— Category —</option>
                  {(form.type==="income" ? allIncomeCatNames : allExpenseCatNames).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input type="number" placeholder="Amount (Rs)" value={form.amount}
                  onChange={(e) => {setForm((f)=>({...f,amount:e.target.value}));setFormError("");}}
                  style={inputStyle} min="0"/>
                <input type="date" value={form.date}
                  onChange={(e) => setForm((f) => ({...f,date:e.target.value}))} style={inputStyle}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                <input placeholder="Note (optional)" value={form.note}
                  onChange={(e) => setForm((f) => ({...f,note:e.target.value}))} style={inputStyle}/>
                <button onClick={addTransaction} style={{
                  background:"#c9b99a",color:"#0f0f0f",border:"none",
                  borderRadius:8,padding:"0 22px",fontWeight:"bold",
                  cursor:"pointer",fontSize:20,fontFamily:"inherit",
                }}>+</button>
              </div>
              {formError && <div style={{fontSize:12,color:"#ef4444",marginTop:8}}>{formError}</div>}
            </div>

            {transactions.length === 0
              ? <div style={cardStyle}><EmptyState icon="📝" message="No transactions yet."/></div>
              : <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((t) => (
                    <div key={t.id} style={{
                      background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:10,
                      padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{
                          width:34,height:34,borderRadius:"50%",
                          background:`${getCatColor(t.category)}22`,border:`1px solid ${getCatColor(t.category)}44`,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
                        }}>{getCatIcon(t.category)}</div>
                        <div>
                          <div style={{fontSize:13,color:"#ddd"}}>{t.category}{t.note?` · ${t.note}`:""}</div>
                          <div style={{fontSize:11,color:"#444"}}>{t.date}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontWeight:"bold",fontSize:13,color:t.type==="income"?"#22c55e":"#ef4444"}}>
                          {t.type==="income"?"+":"−"}{fmt(t.amount)}
                        </span>
                        <button onClick={() => deleteTransaction(t.id)}
                          style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:18,padding:0}}
                          onMouseEnter={(e)=>(e.target.style.color="#ef4444")}
                          onMouseLeave={(e)=>(e.target.style.color="#333")}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ══ BUDGET ══ */}
        {tab === "budget" && (
          <div style={cardStyle}>
            <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:18}}>Monthly Budget Limits</div>
            {allExpenseCatNames.length === 0
              ? <EmptyState icon="📋" message="Add expense categories first."/>
              : allExpenseCatNames.map((cat) => {
                  const spent = expenseByCategory[cat] || 0;
                  const limit = parseFloat(budgets[cat]) || 0;
                  const hasLimit = limit > 0;
                  const over = hasLimit && spent > limit;
                  const pct = hasLimit ? Math.min(100,Math.round((spent/limit)*100)) : 0;
                  return (
                    <div key={cat} style={{marginBottom:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:13,color:"#ccc"}}>{getCatIcon(cat)} {cat}</span>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:12,color:over?"#ef4444":"#555"}}>
                            {fmt(spent)}{hasLimit?` / ${fmt(limit)}`:""}
                          </span>
                          <input type="number" placeholder="Limit" value={budgets[cat]||""}
                            onChange={(e) => setBudgets((b) => ({...b,[cat]:e.target.value}))}
                            style={{...inputStyle,width:100,padding:"5px 8px",fontSize:12}} min="0"/>
                        </div>
                      </div>
                      {hasLimit && (
                        <>
                          <div style={{height:5,background:"#222",borderRadius:3}}>
                            <div style={{height:5,borderRadius:3,width:`${pct}%`,background:over?"#ef4444":getCatColor(cat),transition:"width 0.4s"}}/>
                          </div>
                          {over && <div style={{fontSize:11,color:"#ef4444",marginTop:3}}>Over by {fmt(spent-limit)}</div>}
                        </>
                      )}
                      {!hasLimit && <div style={{fontSize:11,color:"#333",marginTop:2}}>No limit set</div>}
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ══ SAVINGS ══ */}
        {tab === "savings" && (
          <div>
            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Available to Allocate</div>
              {Object.keys(incomeByCategory).length === 0
                ? <EmptyState icon="💸" message="Add income transactions first."/>
                : allIncomeCatNames.filter((c) => incomeByCategory[c] > 0).map((cat) => {
                    const total = incomeByCategory[cat] || 0;
                    const allocated = allocatedBySource[cat] || 0;
                    const free = total - allocated;
                    const pct = total > 0 ? Math.round((allocated/total)*100) : 0;
                    return (
                      <div key={cat} style={{marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                          <span style={{color:"#ccc"}}>{getCatIcon(cat)} {cat}</span>
                          <span>
                            <span style={{color:free>0?"#22c55e":"#ef4444"}}>{fmt(free)} free</span>
                            <span style={{color:"#444"}}> / {fmt(total)}</span>
                          </span>
                        </div>
                        <div style={{height:4,background:"#222",borderRadius:2}}>
                          <div style={{height:4,borderRadius:2,width:`${pct}%`,background:getCatColor(cat),transition:"width 0.4s"}}/>
                        </div>
                      </div>
                    );
                  })
              }
            </div>

            {goals.map((g) => {
              const pct = g.target > 0 ? Math.min(100,Math.round((g.saved/g.target)*100)) : 0;
              const isExpanded = activeGoal === g.id;
              const isAllocating = allocateGoalId === g.id;
              return (
                <div key={g.id} style={{...cardStyle,border:`1px solid ${g.color}33`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{
                        width:40,height:40,borderRadius:10,
                        background:`${g.color}22`,border:`1px solid ${g.color}44`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                      }}>{g.icon}</div>
                      <div>
                        <div style={{fontSize:14,color:"#e8e0d0",fontWeight:"bold"}}>{g.name}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:2}}>{fmt(g.saved)} saved · {fmt(g.target)} goal</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <button onClick={() => setActiveGoal(isExpanded?null:g.id)}
                        style={{background:"#1e1e1e",border:"1px solid #2a2a2a",borderRadius:6,color:"#666",cursor:"pointer",fontSize:11,padding:"4px 10px",fontFamily:"inherit"}}>
                        {isExpanded?"Hide":"History"}
                      </button>
                      <button onClick={() => deleteGoal(g.id)}
                        style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:20,padding:0,lineHeight:1}}
                        onMouseEnter={(e)=>(e.target.style.color="#ef4444")}
                        onMouseLeave={(e)=>(e.target.style.color="#333")}>×</button>
                    </div>
                  </div>

                  <div style={{height:8,background:"#222",borderRadius:4,marginBottom:5}}>
                    <div style={{height:8,borderRadius:4,width:`${pct}%`,background:g.color,transition:"width 0.4s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#444",marginBottom:14}}>
                    <span>{pct}% reached</span>
                    {pct<100?<span>{fmt(g.target-g.saved)} remaining</span>:<span style={{color:"#22c55e"}}>✓ Goal reached!</span>}
                  </div>

                  {!isAllocating
                    ? <button onClick={() => {setAllocateGoalId(g.id);setAllocateAmount("");setAllocateSource("");setAllocateErr("");}}
                        style={{background:`${g.color}15`,border:`1px solid ${g.color}33`,borderRadius:8,color:g.color,cursor:"pointer",fontSize:12,padding:"9px 16px",fontFamily:"inherit",width:"100%"}}>
                        + Allocate Money to This Goal
                      </button>
                    : <div style={{background:"#111",borderRadius:10,padding:14,border:"1px solid #222"}}>
                        <div style={{fontSize:12,color:"#666",marginBottom:10}}>Where is this money coming from?</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                          <select value={allocateSource}
                            onChange={(e)=>{setAllocateSource(e.target.value);setAllocateErr("");}}
                            style={inputStyle}>
                            <option value="">— Source —</option>
                            {allIncomeCatNames.map((c) => {
                              const avail = Math.max(0,(incomeByCategory[c]||0)-(allocatedBySource[c]||0));
                              return <option key={c} value={c}>{getCatIcon(c)} {c} ({fmt(avail)} free)</option>;
                            })}
                          </select>
                          <input type="number" placeholder="Amount (Rs)" value={allocateAmount}
                            onChange={(e)=>{setAllocateAmount(e.target.value);setAllocateErr("");}}
                            style={inputStyle} min="0"/>
                        </div>
                        {allocateErr && <div style={{fontSize:11,color:"#ef4444",marginBottom:8}}>{allocateErr}</div>}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          <button onClick={()=>allocateToGoal(g.id)} style={{
                            background:g.color,color:"#0f0f0f",border:"none",borderRadius:8,
                            padding:"9px",fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",fontSize:13,
                          }}>Allocate</button>
                          <button onClick={()=>{setAllocateGoalId(null);setAllocateErr("");}} style={{
                            background:"#1a1a1a",color:"#666",border:"1px solid #2a2a2a",borderRadius:8,
                            padding:"9px",cursor:"pointer",fontFamily:"inherit",fontSize:13,
                          }}>Cancel</button>
                        </div>
                      </div>
                  }

                  {isExpanded && (
                    <div style={{marginTop:14,borderTop:"1px solid #1e1e1e",paddingTop:14}}>
                      <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Allocation History</div>
                      {g.allocations.length===0
                        ? <div style={{fontSize:12,color:"#333",textAlign:"center",padding:"10px 0"}}>No allocations yet.</div>
                        : g.allocations.map((a) => (
                            <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a1a",fontSize:12}}>
                              <div>
                                <span style={{color:"#ccc"}}>{getCatIcon(a.source)} {a.source}</span>
                                <span style={{color:"#444",marginLeft:8}}>{a.date}</span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <span style={{color:"#22c55e"}}>+{fmt(a.amount)}</span>
                                <button onClick={()=>removeAllocation(g.id,a.id)}
                                  style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:16,padding:0}}
                                  onMouseEnter={(e)=>(e.target.style.color="#ef4444")}
                                  onMouseLeave={(e)=>(e.target.style.color="#333")}>×</button>
                              </div>
                            </div>
                          ))
                      }
                    </div>
                  )}
                </div>
              );
            })}

            {!showGoalForm
              ? <button onClick={()=>setShowGoalForm(true)} style={{
                  width:"100%",padding:"14px",background:"transparent",
                  border:"1px dashed #2a2a2a",borderRadius:12,color:"#555",
                  cursor:"pointer",fontSize:13,fontFamily:"inherit",letterSpacing:0.5,
                }}>+ Add New Savings Goal</button>
              : <div style={cardStyle}>
                  <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>New Goal</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,color:"#555",marginBottom:8}}>Icon</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {GOAL_ICONS.map((ic) => (
                        <button key={ic} onClick={()=>setGoalForm((f)=>({...f,icon:ic}))} style={{
                          width:36,height:36,borderRadius:8,fontSize:18,
                          background:goalForm.icon===ic?"#2a2a2a":"#111",
                          border:goalForm.icon===ic?"1px solid #c9b99a":"1px solid #1e1e1e",
                          cursor:"pointer",
                        }}>{ic}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:12,color:"#555",marginBottom:8}}>Color</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {GOAL_COLORS.map((col) => (
                        <button key={col} onClick={()=>setGoalForm((f)=>({...f,color:col}))} style={{
                          width:28,height:28,borderRadius:"50%",background:col,border:"none",
                          cursor:"pointer",outline:goalForm.color===col?`2px solid ${col}`:"none",outlineOffset:2,
                        }}/>
                      ))}
                    </div>
                  </div>
                  <input placeholder="Goal name (e.g. Hajj fund, New phone)" value={goalForm.name}
                    onChange={(e)=>{setGoalForm((f)=>({...f,name:e.target.value}));setGoalFormErr("");}}
                    style={{...inputStyle,marginBottom:10}}/>
                  <input type="number" placeholder="Target amount (Rs)" value={goalForm.targetAmount}
                    onChange={(e)=>{setGoalForm((f)=>({...f,targetAmount:e.target.value}));setGoalFormErr("");}}
                    style={{...inputStyle,marginBottom:10}} min="0"/>
                  {goalFormErr && <div style={{fontSize:12,color:"#ef4444",marginBottom:10}}>{goalFormErr}</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <button onClick={addGoal} style={{background:"#c9b99a",color:"#0f0f0f",border:"none",borderRadius:8,padding:"10px",fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Create Goal</button>
                    <button onClick={()=>{setShowGoalForm(false);setGoalFormErr("");}} style={{background:"#111",color:"#666",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Cancel</button>
                  </div>
                </div>
            }

            {balance < 0 && (
              <div style={{background:"#1a1a1a",border:"1px solid #ef4444",borderRadius:10,padding:14,fontSize:13,color:"#ef4444",marginTop:12}}>
                ⚠️ Expenses exceed income. Fix your cash flow before saving.
              </div>
            )}
          </div>
        )}

        {/* ══ CATEGORIES ══ */}
        {tab === "categories" && (
          <div>
            {/* Tab switcher */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {["expense","income"].map((t) => (
                <button key={t} onClick={()=>setCatTab(t)} style={{
                  flex:1,padding:"10px",border:"none",borderRadius:8,cursor:"pointer",
                  background:catTab===t?"#c9b99a":"#1a1a1a",
                  color:catTab===t?"#0f0f0f":"#555",
                  fontFamily:"inherit",fontSize:13,fontWeight:catTab===t?"bold":"normal",
                  textTransform:"capitalize",
                }}>{t} Categories</button>
              ))}
            </div>

            {/* Add new */}
            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>
                Add {catTab} Category
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,color:"#555",marginBottom:8}}>Icon</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {CAT_ICONS.map((ic) => (
                    <button key={ic} onClick={()=>setNewCatIcon(ic)} style={{
                      width:34,height:34,borderRadius:7,fontSize:16,
                      background:newCatIcon===ic?"#2a2a2a":"#111",
                      border:newCatIcon===ic?"1px solid #c9b99a":"1px solid #1e1e1e",
                      cursor:"pointer",
                    }}>{ic}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,color:"#555",marginBottom:8}}>Color</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {CAT_COLOR_POOL.map((col) => (
                    <button key={col} onClick={()=>setNewCatColor(col)} style={{
                      width:26,height:26,borderRadius:"50%",background:col,border:"none",
                      cursor:"pointer",outline:newCatColor===col?`2px solid ${col}`:"none",outlineOffset:2,
                    }}/>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                <input placeholder={`Category name`} value={newCatName}
                  onChange={(e)=>{setNewCatName(e.target.value);setCatErr("");}}
                  onKeyDown={(e)=>e.key==="Enter"&&addCategory()}
                  style={inputStyle}/>
                <button onClick={addCategory} style={{
                  background:"#c9b99a",color:"#0f0f0f",border:"none",
                  borderRadius:8,padding:"0 20px",fontWeight:"bold",
                  cursor:"pointer",fontSize:20,fontFamily:"inherit",
                }}>+</button>
              </div>
              {catErr && <div style={{fontSize:12,color:"#ef4444",marginTop:8}}>{catErr}</div>}
            </div>

            {/* List */}
            <div style={cardStyle}>
              <div style={{fontSize:11,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>
                Your {catTab} Categories
              </div>
              {(catTab==="expense"?expenseCats:incomeCats).length===0
                ? <EmptyState icon="📋" message="No categories yet. Add one above."/>
                : (catTab==="expense"?expenseCats:incomeCats).map((c) => (
                    <div key={c.name} style={{
                      display:"flex",justifyContent:"space-between",alignItems:"center",
                      padding:"10px 0",borderBottom:"1px solid #1e1e1e",
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{
                          width:34,height:34,borderRadius:8,
                          background:`${c.color}22`,border:`1px solid ${c.color}44`,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                        }}>{c.icon}</div>
                        <span style={{fontSize:13,color:"#ccc"}}>{c.name}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:12,height:12,borderRadius:"50%",background:c.color}}/>
                        <button onClick={()=>deleteCategory(c.name,c.type)}
                          style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:18,padding:0}}
                          onMouseEnter={(e)=>(e.target.style.color="#ef4444")}
                          onMouseLeave={(e)=>(e.target.style.color="#333")}>×</button>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}