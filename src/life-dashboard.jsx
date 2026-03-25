import { useState, useEffect } from "react";

const BG = "#0b0d1a";
const CARD = "#111430";
const BORDER = "rgba(255,255,255,0.05)";
const CYAN = "#00e0e0";
const MAGENTA = "#e040a0";
const PURPLE = "#a855c8";
const TEXT = "#e8eaf6";
const MUTED = "#6b70a0";
const DIM = "#4a4e6e";
const SIDEBAR = "#0f1124";
const GREEN = "#00e0e0";

const WEEKLY_PAY = 875;
const FIXED_COSTS = [
  { name: "Rent", amount: 245 },
  { name: "Groceries", amount: 120 },
  { name: "Savings", amount: 150 },
  { name: "Vapes", amount: 35 },
  { name: "Fuel", amount: 32 },
  { name: "Gym", amount: 24 },
  { name: "Haircut", amount: 23 },
  { name: "Phone", amount: 14 },
  { name: "Subscriptions", amount: 12 },
  { name: "Water", amount: 12 },
];
const TOTAL_FIXED = FIXED_COSTS.reduce((s, c) => s + c.amount, 0);
const WEEKLY_SAVINGS = 150;
const FREE_BUDGET = WEEKLY_PAY - TOTAL_FIXED;

const getDayOfWeek = () => { const d = new Date().getDay(); return d === 0 ? 7 : d; };

const QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha" },
  { text: "You will never always be motivated. You have to learn to be disciplined.", author: "Unknown" },
  { text: "The pain of discipline is nothing like the pain of disappointment.", author: "Justin Langer" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Hard times create strong men. Strong men create good times.", author: "G. Michael Hopf" },
  { text: "Be stronger than your strongest excuse.", author: "Unknown" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Suffer the pain of discipline or suffer the pain of regret.", author: "Jim Rohn" },
  { text: "Your future self is watching you right now through memories.", author: "Unknown" },
  { text: "Do not pray for an easy life. Pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", author: "Proverbs 3:5" },
  { text: "I can do all things through Christ who strengthens me.", author: "Philippians 4:13" },
  { text: "The temptation to quit will be greatest just before you are about to succeed.", author: "Chinese Proverb" },
  { text: "Comfort is the enemy of progress.", author: "P.T. Barnum" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "A river cuts through rock not because of its power but because of its persistence.", author: "Jim Watkins" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Prove them wrong. Quietly.", author: "Unknown" },
  { text: "God doesn't give the hardest battles to His toughest soldiers. He creates the toughest soldiers through the hardest battles.", author: "Unknown" },
  { text: "Be watchful, stand firm in the faith, act like men, be strong.", author: "1 Corinthians 16:13" },
  { text: "Winners are not people who never fail but people who never quit.", author: "Unknown" },
  { text: "If you are going through hell, keep going.", author: "Winston Churchill" },
  { text: "The cost of being the old you is greater than the cost of becoming the new you.", author: "Unknown" },
  { text: "Every morning you have two choices: continue to sleep with your dreams or wake up and chase them.", author: "Unknown" },
];
const todaysQuote = QUOTES[Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % QUOTES.length];

const pill = (color, text) => (
  <span style={{ background: `${color}15`, color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{text}</span>
);

export default function LifeDashboard() {
  const [page, setPage] = useState("daily");
  const [loaded, setLoaded] = useState(false);

  const defaultData = {
    dailyChecks: {},
    dailyStreaks: { workout: 0, sleep: 0, read: 0, pray: 0, journal: 0, nophone: 0 },
    weekLog: Array(7).fill(null).map(() => ({ workout: false, sleep: false, read: false, pray: false, journal: false, nophone: false })),
    habitSlips: {},
    habitStreaks: { porn: 0, weed: 0, phone: 0, junkfood: 0, latenight: 0 },
    habitBests: { porn: 0, weed: 0, phone: 0, junkfood: 0, latenight: 0 },
    slipCounts: { porn: 0, weed: 0, phone: 0, junkfood: 0, latenight: 0 },
    shameUntil: null,
    spending: [],
    bankedWeeks: [],
    workouts: [
      { id: "1", name: "Push Day", exercises: [
        { name: "Bench Press", sets: "4", reps: "10", weight: "60" },
        { name: "Shoulder Press", sets: "3", reps: "12", weight: "30" },
        { name: "Tricep Dips", sets: "3", reps: "15", weight: "BW" },
      ]},
      { id: "2", name: "Pull Day", exercises: [
        { name: "Deadlift", sets: "4", reps: "8", weight: "80" },
        { name: "Barbell Row", sets: "3", reps: "10", weight: "50" },
        { name: "Bicep Curls", sets: "3", reps: "12", weight: "14" },
      ]},
    ],
    meals: [],
    goals: [],
    goalChecks: {},
    lastDate: null,
  };

  const [dailyChecks, setDailyChecks] = useState(defaultData.dailyChecks);
  const [dailyStreaks, setDailyStreaks] = useState(defaultData.dailyStreaks);
  const [weekLog, setWeekLog] = useState(defaultData.weekLog);
  const [habitSlips, setHabitSlips] = useState(defaultData.habitSlips);
  const [habitStreaks, setHabitStreaks] = useState(defaultData.habitStreaks);
  const [habitBests, setHabitBests] = useState(defaultData.habitBests);
  const [slipCounts, setSlipCounts] = useState(defaultData.slipCounts);
  const [shameUntil, setShameUntil] = useState(null);
  const [spending, setSpending] = useState(defaultData.spending);
  const [bankedWeeks, setBankedWeeks] = useState(defaultData.bankedWeeks);
  const [workouts, setWorkouts] = useState(defaultData.workouts);
  const [meals, setMeals] = useState(defaultData.meals);
  const [goals, setGoals] = useState(defaultData.goals);
  const [goalChecks, setGoalChecks] = useState(defaultData.goalChecks);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem("life-dashboard-v2");
        if (saved) {
          const d = JSON.parse(saved);
          if (d.dailyChecks) setDailyChecks(d.dailyChecks);
          if (d.dailyStreaks) setDailyStreaks(d.dailyStreaks);
          if (d.weekLog) setWeekLog(d.weekLog);
          if (d.habitSlips) setHabitSlips(d.habitSlips);
          if (d.habitStreaks) setHabitStreaks(d.habitStreaks);
          if (d.habitBests) setHabitBests(d.habitBests);
          if (d.slipCounts) setSlipCounts(d.slipCounts);
          if (d.shameUntil) setShameUntil(d.shameUntil);
          if (d.spending) setSpending(d.spending);
          if (d.bankedWeeks) setBankedWeeks(d.bankedWeeks);
          if (d.workouts) setWorkouts(d.workouts);
          if (d.meals) setMeals(d.meals);
          if (d.goals) setGoals(d.goals);
          if (d.goalChecks) setGoalChecks(d.goalChecks);
          const today = new Date().toDateString();
          if (d.lastDate && d.lastDate !== today) {
            setDailyChecks({});
            setHabitSlips({});
            setMeals([]);
          }
        }
      } catch (e) {
        console.log("Load failed:", e);
      }
      setLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("life-dashboard-v2", JSON.stringify({
        dailyChecks, dailyStreaks, weekLog, habitSlips, habitStreaks, habitBests,
        slipCounts, shameUntil, spending, bankedWeeks, workouts, meals, goals, goalChecks,
        lastDate: new Date().toDateString(),
      }));
    } catch (e) {
      console.log("Save failed:", e);
    }
  }, [loaded, dailyChecks, dailyStreaks, weekLog, habitSlips, habitStreaks, habitBests, slipCounts, shameUntil, spending, bankedWeeks, workouts, meals, goals, goalChecks]);

  const dailyTasks = [
    { id: "workout", name: "Workout" },
    { id: "sleep", name: "Sleep 7+ hrs" },
    { id: "read", name: "Read / learn" },
    { id: "pray", name: "Pray / gratitude" },
    { id: "journal", name: "Journal" },
    { id: "nophone", name: "No phone 1st hour" },
  ];

  const toggleDaily = (id) => {
    const was = dailyChecks[id];
    setDailyChecks(p => ({ ...p, [id]: !p[id] }));
    const today = getDayOfWeek() - 1;
    setWeekLog(p => { const n = [...p]; n[today] = { ...n[today], [id]: !was }; return n; });
    if (!was) setDailyStreaks(p => ({ ...p, [id]: p[id] + 1 }));
    else setDailyStreaks(p => ({ ...p, [id]: Math.max(0, p[id] - 1) }));
  };

  const badHabits = [
    { id: "porn", name: "Porn", label: "days clean", critical: true },
    { id: "weed", name: "Weed", label: "days clean", critical: true },
    { id: "phone", name: "Doomscrolling", label: "days under limit", critical: false },
    { id: "junkfood", name: "Junk food / Uber Eats", label: "days clean", critical: false },
    { id: "latenight", name: "Late nights", label: "days on schedule", critical: false },
  ];
  const totalSlips = Object.values(slipCounts).reduce((s, c) => s + c, 0);
  const slipHabit = (id) => {
    if (habitSlips[id]) return;
    setHabitSlips(p => ({ ...p, [id]: true }));
    setHabitStreaks(p => ({ ...p, [id]: 0 }));
    setSlipCounts(p => ({ ...p, [id]: p[id] + 1 }));
  };
  const undoSlip = (id) => {
    setHabitSlips(p => ({ ...p, [id]: false }));
    setSlipCounts(p => ({ ...p, [id]: Math.max(0, p[id] - 1) }));
    setHabitStreaks(p => { const ns = p[id] + 1; setHabitBests(b => ({ ...b, [id]: Math.max(b[id], ns) })); return { ...p, [id]: ns }; });
  };

  const [addingSpend, setAddingSpend] = useState(false);
  const [spendAmt, setSpendAmt] = useState("");
  const [spendNote, setSpendNote] = useState("");
  const totalSpent = spending.reduce((s, x) => s + x.amount, 0);
  const remaining = FREE_BUDGET - totalSpent;
  const daysLeft = Math.max(1, 7 - getDayOfWeek() + 1);
  const dailyLeft = Math.round(remaining / daysLeft);
  const addSpend = () => { const a = parseFloat(spendAmt); if (isNaN(a) || a <= 0) return; setSpending(p => [...p, { amount: a, note: spendNote || "Spent" }]); setSpendAmt(""); setSpendNote(""); setAddingSpend(false); };
  const removeSpend = (i) => setSpending(p => p.filter((_, idx) => idx !== i));
  const bankRest = () => { if (remaining > 0) { setBankedWeeks(p => [...p, { amount: remaining, week: `Week ${p.length + 1}` }]); setSpending([]); } };
  const totalBanked = bankedWeeks.reduce((s, w) => s + w.amount, 0);

  const [addingWorkout, setAddingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [newWkName, setNewWkName] = useState("");
  const [newExercises, setNewExercises] = useState([{ name: "", reps: "", weights: [""] }]);
  const [viewingWorkout, setViewingWorkout] = useState(null);
  const addExRow = () => setNewExercises(p => [...p, { name: "", reps: "", weights: [""] }]);
  const removeExRow = (i) => setNewExercises(p => p.filter((_, idx) => idx !== i));
  const updateEx = (i, field, val) => setNewExercises(p => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });
  const updateExWeight = (i, si, val) => setNewExercises(p => { const n = [...p]; const w = [...n[i].weights]; w[si] = val; n[i] = { ...n[i], weights: w }; return n; });
  const addSet = (i) => setNewExercises(p => { const n = [...p]; n[i] = { ...n[i], weights: [...n[i].weights, ""] }; return n; });
  const removeSet = (i) => setNewExercises(p => { const n = [...p]; if (n[i].weights.length > 1) n[i] = { ...n[i], weights: n[i].weights.slice(0, -1) }; return n; });
  const saveWorkout = () => {
    if (!newWkName.trim()) return;
    const exs = newExercises.filter(e => e.name.trim()).map(e => ({ name: e.name, reps: e.reps, weights: e.weights }));
    if (exs.length === 0) return;
    if (editingWorkout !== null) {
      setWorkouts(p => { const n = [...p]; n[editingWorkout] = { ...n[editingWorkout], name: newWkName.trim(), exercises: exs }; return n; });
      setEditingWorkout(null); setViewingWorkout(editingWorkout);
    } else {
      setWorkouts(p => [...p, { id: Date.now().toString(), name: newWkName.trim(), exercises: exs }]);
    }
    setNewWkName(""); setNewExercises([{ name: "", reps: "", weights: [""] }]); setAddingWorkout(false);
  };
  const startEdit = (i) => {
    const w = workouts[i];
    setNewWkName(w.name);
    setNewExercises(w.exercises.map(e => ({
      name: e.name, reps: e.reps,
      weights: e.weights || (e.weight ? Array(parseInt(e.sets) || 1).fill(e.weight) : [""])
    })));
    setEditingWorkout(i); setAddingWorkout(true); setViewingWorkout(null);
  };
  const deleteWorkout = (i) => { setWorkouts(p => p.filter((_, idx) => idx !== i)); setViewingWorkout(null); };

  const [addingMeal, setAddingMeal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCals, setMealCals] = useState("");
  const addMealTyped = (type) => { if (!mealName.trim()) return; setMeals(p => [...p, { name: mealName.trim(), cals: parseInt(mealCals) || 0, type }]); setMealName(""); setMealCals(""); setAddingMeal(false); };
  const removeMeal = (i) => setMeals(p => p.filter((_, idx) => idx !== i));
  const totalCals = meals.reduce((s, m) => s + m.cals, 0);

  const [addingGoal, setAddingGoal] = useState(false);
  const [goalText, setGoalText] = useState("");
  const addGoal = () => { if (!goalText.trim() || goals.length >= 5) return; setGoals(p => [...p, goalText.trim()]); setGoalText(""); setAddingGoal(false); };
  const removeGoal = (i) => { setGoals(p => p.filter((_, idx) => idx !== i)); setGoalChecks(p => { const n = { ...p }; delete n[i]; return n; }); };
  const toggleGoal = (i) => setGoalChecks(p => ({ ...p, [i]: !p[i] }));

  const completedDaily = Object.values(dailyChecks).filter(Boolean).length;
  const gymSplit = ["Push", "Pull", "Legs"];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const todaysTraining = gymSplit[dayOfYear % gymSplit.length];

  const card = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 };
  const inp = { background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontFamily: "'Outfit', sans-serif", fontSize: 14, padding: "10px 14px", width: "100%", outline: "none", marginBottom: 8, boxSizing: "border-box" };
  const btn = (color) => ({ background: `${color}12`, border: `1px solid ${color}30`, color, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, padding: "8px 16px", borderRadius: 8, cursor: "pointer", textAlign: "center", letterSpacing: 1 });

  const sideLink = (id, label) => (
    <div key={id} onClick={() => { setPage(id); setViewingWorkout(null); }} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
      background: page === id ? `${CYAN}0a` : "transparent",
      borderLeft: page === id ? `3px solid ${CYAN}` : "3px solid transparent",
      borderRadius: 8, marginBottom: 2, cursor: "pointer",
    }}>
      <div style={{ width: 4, height: 4, background: page === id ? CYAN : DIM, borderRadius: "50%" }} />
      <div style={{ fontSize: 13, color: page === id ? CYAN : MUTED, fontWeight: page === id ? 500 : 400 }}>{label}</div>
    </div>
  );

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 700, background: BG, fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ color: CYAN, fontSize: 14, letterSpacing: 2 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.hov:hover{background:rgba(255,255,255,0.02)!important}
@media(max-width:700px){.sidebar{display:none!important}.bottom-nav{display:flex!important}.main-content{padding:16px 14px 80px!important}}
@media(min-width:701px){.bottom-nav{display:none!important}}`}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "'Outfit', sans-serif", color: TEXT, position: "relative" }}>

        <div className="sidebar" style={{ width: 175, background: SIDEBAR, padding: "24px 0", flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 20px 24px", fontSize: 15, fontWeight: 600 }}>Life Dashboard</div>
          <div style={{ padding: "0 12px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: DIM, letterSpacing: 2, fontWeight: 500, padding: "0 8px", marginBottom: 6 }}>TRACK</div>
            {sideLink("daily", "Daily")}
            {sideLink("habits", "Habits")}
            {sideLink("money", "Money")}
          </div>
          <div style={{ padding: "0 12px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: DIM, letterSpacing: 2, fontWeight: 500, padding: "0 8px", marginBottom: 6 }}>HEALTH</div>
            {sideLink("gym", "Gym")}
            {sideLink("meals", "Meals")}
          </div>
          <div style={{ padding: "0 12px" }}>
            <div style={{ fontSize: 10, color: DIM, letterSpacing: 2, fontWeight: 500, padding: "0 8px", marginBottom: 6 }}>PLAN</div>
            {sideLink("planner", "Tomorrow")}
          </div>
          <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Ben</div>
            <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>Week {Math.ceil((new Date().getDate()) / 7)}, Mar 2026</div>
          </div>
        </div>

        <div className="main-content" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>

          <div className="bottom-nav" style={{ display: "none" }}>
            <div style={{ padding: "0 0 16px", marginBottom: 16, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: TEXT, marginBottom: 4 }}>Life Dashboard</div>
              <div style={{ fontSize: 11, color: DIM }}>Ben — Week {Math.ceil((new Date().getDate()) / 7)}, Mar 2026</div>
            </div>
          </div>

          {page === "daily" && <>
            <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", minWidth: 180, background: "linear-gradient(135deg, #6c3fa0, #a855c8)", borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Free Spending Left</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 }}>${Math.round(remaining)}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>${dailyLeft}/day for {daysLeft} days</div>
              </div>
              <div style={{ flex: "1 1 200px", minWidth: 180, background: "linear-gradient(135deg, #1a6b8a, #00b8b8)", borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Savings This Week</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 }}>${WEEKLY_SAVINGS}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>+${Math.round(totalBanked)} bonus banked</div>
              </div>
              <div style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ ...card, padding: "14px 16px", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13 }}>Today's Training</span>
                  <span style={{ fontSize: 13, color: CYAN, fontWeight: 600 }}>{todaysTraining} Day</span>
                </div>
                <div style={{ ...card, padding: "14px 16px", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13 }}>Today's Cals</span>
                  <span style={{ fontSize: 13, color: PURPLE, fontWeight: 600 }}>{totalCals}</span>
                </div>
              </div>
            </div>

            <div style={{ ...card, marginBottom: 24, borderLeft: `3px solid ${PURPLE}`, borderRadius: "0 12px 12px 0" }}>
              <div style={{ fontSize: 15, color: TEXT, fontStyle: "italic", fontWeight: 300, lineHeight: 1.5 }}>"{todaysQuote.text}"</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 8 }}>{todaysQuote.author}</div>
            </div>

            <div style={{ ...card, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Today's Check-in</div>
                <div style={{ fontSize: 12, color: DIM }}>{completedDaily} of {dailyTasks.length} complete</div>
              </div>
              {dailyTasks.map(t => {
                const done = dailyChecks[t.id];
                return (
                  <div key={t.id} className="hov" onClick={() => toggleDaily(t.id)} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `1px solid rgba(255,255,255,0.03)`, cursor: "pointer" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: done ? `${CYAN}12` : `${MAGENTA}08`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                      {done ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: CYAN }} /> : <div style={{ width: 10, height: 2, background: MAGENTA, borderRadius: 1 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: done ? TEXT : DIM }}>{t.name}</div>
                    </div>
                    <div style={{ fontSize: 13, color: done ? CYAN : MAGENTA, fontWeight: 500, marginRight: 12 }}>
                      {done ? `${dailyStreaks[t.id]} day streak` : "missed"}
                    </div>
                    {pill(done ? CYAN : MAGENTA, done ? "Done" : "Tap to log")}
                  </div>
                );
              })}
            </div>

            <div style={{ ...card }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>This Week</div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 140 }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                    {dailyTasks.map((t, ti) => (
                      <div key={t.id} style={{ width: "100%", height: 18, borderRadius: ti === 0 ? "4px 4px 0 0" : ti === dailyTasks.length - 1 ? "0 0 4px 4px" : 0, background: i < getDayOfWeek() ? (weekLog[i][t.id] ? CYAN : MAGENTA) : "#1a1e3a", opacity: i < getDayOfWeek() ? (weekLog[i][t.id] ? 0.7 : 0.35) : 1 }} />
                    ))}
                    <div style={{ fontSize: 11, color: i === getDayOfWeek() - 1 ? CYAN : DIM, marginTop: 4 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {page === "habits" && <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Habits</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Track what you're building and what you're leaving behind</div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: CYAN, marginBottom: 16 }}>Good Habits</div>
              {dailyTasks.map(t => {
                const done = dailyChecks[t.id];
                return (
                  <div key={t.id} className="hov" onClick={() => toggleDaily(t.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid rgba(255,255,255,0.03)`, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: done ? `${CYAN}15` : "rgba(255,255,255,0.03)", border: `1px solid ${done ? CYAN : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done && <div style={{ width: 8, height: 8, borderRadius: 2, background: CYAN }} />}
                      </div>
                      <div style={{ fontSize: 14 }}>{t.name}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 600, color: done ? CYAN : DIM }}>{dailyStreaks[t.id]}</span>
                      <span style={{ fontSize: 11, color: DIM }}>day streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...card }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: MAGENTA }}>Breaking Free</div>
                <div style={{ fontSize: 13, color: totalSlips > 0 ? "#ff4444" : DIM }}>{totalSlips} slips this month</div>
              </div>
              {badHabits.map(h => {
                const sl = habitSlips[h.id]; const sk = habitStreaks[h.id]; const best = habitBests[h.id];
                return (
                  <div key={h.id} style={{ padding: "14px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 14 }}>{h.name}</div>
                        {h.critical && <span style={{ fontSize: 9, color: "#ff4444", letterSpacing: 1, opacity: 0.6 }}>CRITICAL</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {slipCounts[h.id] > 0 && <span style={{ fontSize: 12, color: "#ff4444" }}>{slipCounts[h.id]} slips</span>}
                        <span style={{ fontSize: 22, fontWeight: 600, color: sk > 7 ? CYAN : sk > 0 ? PURPLE : MAGENTA }}>{sk}</span>
                        <span style={{ fontSize: 11, color: DIM }}>{h.label}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {!sl && <div className="hov" onClick={() => slipHabit(h.id)} style={{ ...btn(MAGENTA), padding: "6px 12px" }}>I slipped</div>}
                        {sl && <><div style={{ fontSize: 12, color: MAGENTA }}>Streak reset</div><div className="hov" onClick={() => undoSlip(h.id)} style={{ ...btn(DIM), padding: "6px 12px" }}>Undo</div></>}
                      </div>
                      <div style={{ fontSize: 12, color: DIM }}>Best: {best} days</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>}

          {page === "money" && <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Money</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>$875/week income, ${TOTAL_FIXED} fixed, ${FREE_BUDGET} free</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
              <div style={{ flex: 1, background: "linear-gradient(135deg, #6c3fa0, #a855c8)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Free Spending Left</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 }}>${Math.round(remaining)}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>${dailyLeft}/day for {daysLeft} days</div>
              </div>
              <div style={{ flex: 1, background: "linear-gradient(135deg, #1a6b8a, #00b8b8)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Total Saved</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 }}>${bankedWeeks.length * WEEKLY_SAVINGS + Math.round(totalBanked)}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>${WEEKLY_SAVINGS}/wk base + ${Math.round(totalBanked)} bonus</div>
              </div>
            </div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Spending Log</div>
              {spending.length === 0 && <div style={{ fontSize: 13, color: DIM, padding: "12px 0" }}>Nothing logged yet this week</div>}
              {spending.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <div style={{ fontSize: 13 }}>{s.note}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: MAGENTA }}>-${s.amount.toFixed(2)}</span>
                    <span onClick={() => removeSpend(i)} style={{ fontSize: 12, color: DIM, cursor: "pointer" }}>x</span>
                  </div>
                </div>
              ))}
              {addingSpend ? (
                <div style={{ marginTop: 12 }}>
                  <input type="number" placeholder="Amount" value={spendAmt} onChange={e => setSpendAmt(e.target.value)} style={inp} autoFocus />
                  <input placeholder="What was it? (optional)" value={spendNote} onChange={e => setSpendNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addSpend()} style={inp} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div onClick={addSpend} style={{ ...btn(CYAN), flex: 1 }}>Add</div>
                    <div onClick={() => setAddingSpend(false)} style={{ ...btn(DIM), flex: 1 }}>Cancel</div>
                  </div>
                </div>
              ) : <div onClick={() => setAddingSpend(true)} style={{ ...btn(CYAN), marginTop: 12, width: "100%" }}>+ Log Spending</div>}
              {remaining > 0 && spending.length > 0 && <div onClick={bankRest} style={{ ...btn(GREEN), marginTop: 8, width: "100%" }}>Bank the rest (+${Math.round(remaining)})</div>}
            </div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Fixed Costs (Weekly)</div>
              {FIXED_COSTS.map(c => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <span style={{ fontSize: 13, color: MUTED }}>{c.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>${c.amount}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: CYAN }}>${TOTAL_FIXED}</span>
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 32, marginBottom: 16 }}>Spending Insights</div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Monthly Spending (excl rent & one-offs)</div>
              {[
                { month: "Jul 25", total: 3200, weeks: 4.4 },
                { month: "Aug 25", total: 3800, weeks: 4.4 },
                { month: "Sep 25", total: 3400, weeks: 4.3 },
                { month: "Oct 25", total: 4100, weeks: 4.4 },
                { month: "Nov 25", total: 3600, weeks: 4.3 },
                { month: "Dec 25", total: 3670, weeks: 4.4 },
                { month: "Jan 26", total: 3415, weeks: 4.4 },
                { month: "Feb 26", total: 2197, weeks: 4 },
                { month: "Mar 26", total: 1740, weeks: 2.6 },
              ].map((m, i) => {
                const maxVal = 4100;
                const weekly = Math.round(m.total / m.weeks);
                const isRecent = i >= 6;
                const improving = i >= 7;
                return (
                  <div key={m.month} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: DIM, width: 48, flexShrink: 0 }}>{m.month}</div>
                    <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(m.total / maxVal) * 100}%`, background: improving ? CYAN : isRecent ? PURPLE : "rgba(255,255,255,0.08)", borderRadius: 4, opacity: 0.6 }} />
                    </div>
                    <div style={{ fontSize: 12, color: isRecent ? TEXT : MUTED, width: 55, textAlign: "right", fontWeight: isRecent ? 500 : 400 }}>${m.total.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: DIM, width: 45, textAlign: "right" }}>${weekly}/w</div>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: DIM, marginTop: 8 }}>Mar is partial (2.6 weeks). Cyan = improving trend.</div>
            </div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Then vs Now (weekly avg)</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: DIM }}>Jul-Dec 2025</div>
                <div style={{ fontSize: 12, color: CYAN }}>Jan-Mar 2026</div>
              </div>
              {[
                { cat: "Groceries", old: 165, now: 147 },
                { cat: "Eating Out", old: 78, now: 45 },
                { cat: "Coffee / Snacks", old: 80, now: 39 },
                { cat: "Uber Eats", old: 39, now: 33 },
                { cat: "Alcohol", old: 41, now: 44 },
                { cat: "Fuel", old: 48, now: 51 },
                { cat: "Vapes / Tobacco", old: 34, now: 43 },
                { cat: "Shopping", old: 51, now: 64 },
              ].map(c => {
                const better = c.now <= c.old;
                const diff = c.now - c.old;
                const pct = c.old > 0 ? Math.round((diff / c.old) * 100) : 0;
                return (
                  <div key={c.cat} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                    <div style={{ flex: 1, fontSize: 13 }}>{c.cat}</div>
                    <div style={{ fontSize: 13, color: MUTED, width: 60, textAlign: "right" }}>${c.old}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: better ? CYAN : MAGENTA, width: 60, textAlign: "right" }}>${c.now}</div>
                    <div style={{ fontSize: 11, width: 55, textAlign: "right", color: better ? CYAN : MAGENTA }}>{pct > 0 ? `+${pct}%` : `${pct}%`}</div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", marginTop: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Total leaks</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>$308/wk</span>
                  <span style={{ fontSize: 13, color: CYAN, fontWeight: 600 }}>$203/wk</span>
                  <span style={{ fontSize: 11, color: CYAN }}>-34%</span>
                </div>
              </div>
            </div>
            <div style={{ ...card, marginBottom: 20, borderLeft: `3px solid ${MAGENTA}`, borderRadius: "0 12px 12px 0" }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Money Leaks</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Eating out + Uber Eats + Coffee + Alcohol + Vapes</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: MAGENTA, lineHeight: 1 }}>$203</div>
                  <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>per week (avg Jan-Mar)</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: CYAN }}>Down from $308/wk</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: CYAN, lineHeight: 1, marginTop: 4 }}>-$105/wk</div>
                </div>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.03)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: `${(203 / 308) * 100}%`, background: MAGENTA, borderRadius: 3, opacity: 0.5 }} />
                <div style={{ position: "absolute", left: `${(150 / 308) * 100}%`, top: -2, bottom: -2, width: 2, background: CYAN, borderRadius: 1 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: DIM }}>$0</span>
                <span style={{ fontSize: 11, color: CYAN }}>Target $150</span>
                <span style={{ fontSize: 11, color: MUTED }}>Old $308</span>
              </div>
            </div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Month by Month</div>
              {[
                { month: "January", cats: [
                  { name: "Groceries", amt: 694 }, { name: "Eating Out", amt: 319 }, { name: "Uber Eats", amt: 156 },
                  { name: "Alcohol", amt: 222 }, { name: "Coffee/Boost", amt: 112 }, { name: "Fuel", amt: 345 },
                  { name: "Vapes", amt: 222 }, { name: "Shopping", amt: 214 }, { name: "Transport*", amt: 588 },
                ], total: 3415, note: "Includes $507 transport fine" },
                { month: "February", cats: [
                  { name: "Groceries", amt: 524 }, { name: "Eating Out", amt: 57 }, { name: "Uber Eats", amt: 155 },
                  { name: "Alcohol", amt: 185 }, { name: "Coffee/Boost", amt: 247 }, { name: "Fuel", amt: 159 },
                  { name: "Vapes", amt: 101 }, { name: "Shopping", amt: 297 },
                ], total: 2197, note: "Big night out Feb 7 ($90+ on booze)" },
                { month: "March (partial)", cats: [
                  { name: "Groceries", amt: 402 }, { name: "Eating Out", amt: 120 }, { name: "Uber Eats", amt: 49 },
                  { name: "Alcohol", amt: 73 }, { name: "Coffee/Boost", amt: 72 }, { name: "Fuel", amt: 62 },
                  { name: "Vapes", amt: 145 }, { name: "Shopping", amt: 195 },
                ], total: 1740, note: "2.6 weeks. Trending well." },
              ].map(m => (
                <div key={m.month} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.month}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: CYAN }}>${m.total.toLocaleString()}</div>
                  </div>
                  {m.cats.map(c => (
                    <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                      <span style={{ fontSize: 12, color: MUTED }}>{c.name}</span>
                      <span style={{ fontSize: 12 }}>${c.amt}</span>
                    </div>
                  ))}
                  {m.note && <div style={{ fontSize: 11, color: DIM, marginTop: 6, fontStyle: "italic" }}>{m.note}</div>}
                </div>
              ))}
            </div>
          </>}

          {page === "gym" && <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Gym</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Your workout plans — Today: {todaysTraining} Day</div>
            {viewingWorkout !== null && !addingWorkout ? (
              <div>
                <div onClick={() => setViewingWorkout(null)} style={{ fontSize: 13, color: CYAN, cursor: "pointer", marginBottom: 16 }}>Back to plans</div>
                <div style={{ ...card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{workouts[viewingWorkout].name}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div onClick={() => startEdit(viewingWorkout)} style={{ ...btn(CYAN), padding: "6px 12px" }}>Edit</div>
                      <div onClick={() => deleteWorkout(viewingWorkout)} style={{ ...btn(MAGENTA), padding: "6px 12px" }}>Delete</div>
                    </div>
                  </div>
                  {workouts[viewingWorkout].exercises.map((ex, i) => {
                    const weights = ex.weights || (ex.weight ? [ex.weight] : []);
                    return (
                      <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</div>
                          <div style={{ fontSize: 12, color: MUTED }}>{weights.length} sets x {ex.reps} reps</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {weights.map((w, si) => (
                            <div key={si} style={{ background: `${CYAN}10`, border: `1px solid ${CYAN}25`, borderRadius: 6, padding: "4px 10px", fontSize: 12 }}>
                              <span style={{ color: DIM }}>Set {si + 1}: </span>
                              <span style={{ color: CYAN, fontWeight: 500 }}>{w}kg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : addingWorkout ? (
              <div style={{ ...card }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{editingWorkout !== null ? "Edit Workout" : "New Workout"}</div>
                <input placeholder="Workout name (e.g. Leg Day)" value={newWkName} onChange={e => setNewWkName(e.target.value)} style={inp} autoFocus />
                <div style={{ fontSize: 11, color: DIM, letterSpacing: 1, margin: "12px 0 8px" }}>EXERCISES</div>
                {newExercises.map((ex, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <input placeholder="Exercise name" value={ex.name} onChange={e => updateEx(i, "name", e.target.value)} style={{ ...inp, marginBottom: 0, flex: 2 }} />
                      <input placeholder="Reps" value={ex.reps} onChange={e => updateEx(i, "reps", e.target.value)} style={{ ...inp, marginBottom: 0, flex: 1 }} />
                      {newExercises.length > 1 && <div onClick={() => removeExRow(i)} style={{ color: MAGENTA, fontSize: 12, cursor: "pointer", padding: "10px 6px" }}>x</div>}
                    </div>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 6 }}>Weight per set (kg)</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {ex.weights.map((w, si) => (
                        <div key={si} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11, color: DIM }}>S{si + 1}</span>
                          <input value={w} onChange={e => updateExWeight(i, si, e.target.value)} placeholder="kg" style={{ ...inp, marginBottom: 0, width: 55, textAlign: "center", padding: "6px 4px" }} />
                        </div>
                      ))}
                      <div onClick={() => addSet(i)} style={{ fontSize: 11, color: CYAN, cursor: "pointer", padding: "6px 8px" }}>+ set</div>
                      {ex.weights.length > 1 && <div onClick={() => removeSet(i)} style={{ fontSize: 11, color: MAGENTA, cursor: "pointer", padding: "6px 8px" }}>- set</div>}
                    </div>
                  </div>
                ))}
                <div onClick={addExRow} style={{ ...btn(DIM), marginBottom: 12, width: "100%" }}>+ Add exercise</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div onClick={saveWorkout} style={{ ...btn(CYAN), flex: 1 }}>{editingWorkout !== null ? "Save Changes" : "Save Workout"}</div>
                  <div onClick={() => { setAddingWorkout(false); setEditingWorkout(null); setNewWkName(""); setNewExercises([{ name: "", reps: "", weights: [""] }]); }} style={{ ...btn(DIM), flex: 1 }}>Cancel</div>
                </div>
              </div>
            ) : (
              <>
                {workouts.map((w, i) => (
                  <div key={w.id} className="hov" onClick={() => setViewingWorkout(i)} style={{ ...card, marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{w.name}</div>
                      <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>{w.exercises.length} exercises</div>
                    </div>
                    <div style={{ fontSize: 13, color: CYAN }}>View</div>
                  </div>
                ))}
                <div onClick={() => { setAddingWorkout(true); setEditingWorkout(null); }} style={{ ...btn(CYAN), marginTop: 12, width: "100%" }}>+ New Workout Plan</div>
              </>
            )}
          </>}

          {page === "meals" && <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Meals</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Today's food diary</div>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: DIM }}>Calories Today</div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: totalCals > 3000 ? MAGENTA : CYAN, lineHeight: 1, marginTop: 6 }}>{totalCals}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: DIM }}>Goal</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: TEXT, lineHeight: 1, marginTop: 6 }}>3,000</div>
                </div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${Math.min((totalCals / 3000) * 100, 100)}%`, background: totalCals > 3000 ? MAGENTA : CYAN, borderRadius: 2, opacity: 0.7 }} />
              </div>
              <div style={{ fontSize: 12, color: DIM, textAlign: "right" }}>{Math.max(0, 3000 - totalCals)} remaining</div>
            </div>
            {["Breakfast", "Lunch", "Dinner", "Snacks"].map(mealType => {
              const typeMeals = meals.filter(m => m.type === mealType);
              const typeCals = typeMeals.reduce((s, m) => s + m.cals, 0);
              return (
                <div key={mealType} style={{ ...card, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: typeMeals.length > 0 ? 12 : 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{mealType}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: typeCals > 0 ? CYAN : DIM }}>{typeCals} cal</div>
                  </div>
                  {typeMeals.map((m, i) => {
                    const realIdx = meals.indexOf(m);
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                        <div style={{ fontSize: 13, color: MUTED }}>{m.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 13, color: TEXT }}>{m.cals}</span>
                          <span onClick={() => removeMeal(realIdx)} style={{ fontSize: 12, color: DIM, cursor: "pointer" }}>x</span>
                        </div>
                      </div>
                    );
                  })}
                  {addingMeal === mealType ? (
                    <div style={{ marginTop: 10 }}>
                      <input placeholder="What did you eat?" value={mealName} onChange={e => setMealName(e.target.value)} style={inp} autoFocus />
                      <input type="number" placeholder="Calories" value={mealCals} onChange={e => setMealCals(e.target.value)} onKeyDown={e => e.key === "Enter" && addMealTyped(mealType)} style={inp} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <div onClick={() => addMealTyped(mealType)} style={{ ...btn(CYAN), flex: 1 }}>Add</div>
                        <div onClick={() => setAddingMeal(false)} style={{ ...btn(DIM), flex: 1 }}>Cancel</div>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => setAddingMeal(mealType)} style={{ fontSize: 12, color: CYAN, cursor: "pointer", marginTop: typeMeals.length > 0 ? 8 : 0, padding: "6px 0" }}>+ Add food</div>
                  )}
                </div>
              );
            })}
          </>}

          {page === "planner" && <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Tomorrow's Plan</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Set your top goals for tomorrow (max 5)</div>
            <div style={{ ...card }}>
              {goals.length === 0 && <div style={{ fontSize: 13, color: DIM, padding: "12px 0" }}>No goals set yet. What are you going to crush tomorrow?</div>}
              {goals.map((g, i) => (
                <div key={i} className="hov" style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `1px solid rgba(255,255,255,0.03)`, cursor: "pointer" }} onClick={() => toggleGoal(i)}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${goalChecks[i] ? CYAN : DIM}`, background: goalChecks[i] ? `${CYAN}15` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0 }}>
                    {goalChecks[i] && <div style={{ width: 8, height: 8, borderRadius: 2, background: CYAN }} />}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, color: goalChecks[i] ? DIM : TEXT, textDecoration: goalChecks[i] ? "line-through" : "none" }}>{g}</div>
                  <div onClick={(e) => { e.stopPropagation(); removeGoal(i); }} style={{ fontSize: 12, color: DIM, cursor: "pointer", padding: "4px 8px" }}>x</div>
                </div>
              ))}
              {addingGoal ? (
                <div style={{ marginTop: 12 }}>
                  <input placeholder="What's the goal?" value={goalText} onChange={e => setGoalText(e.target.value)} onKeyDown={e => e.key === "Enter" && addGoal()} style={inp} autoFocus />
                  <div style={{ display: "flex", gap: 8 }}>
                    <div onClick={addGoal} style={{ ...btn(CYAN), flex: 1 }}>Add</div>
                    <div onClick={() => setAddingGoal(false)} style={{ ...btn(DIM), flex: 1 }}>Cancel</div>
                  </div>
                </div>
              ) : goals.length < 5 && <div onClick={() => setAddingGoal(true)} style={{ ...btn(CYAN), marginTop: 12, width: "100%" }}>+ Add Goal</div>}
              {goals.length >= 5 && <div style={{ fontSize: 12, color: DIM, marginTop: 12, textAlign: "center" }}>Max 5 goals. Keep it focused.</div>}
            </div>
          </>}

        </div>

        <div className="bottom-nav" style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: SIDEBAR, borderTop: `1px solid ${BORDER}`, padding: "8px 0 12px", justifyContent: "space-around", zIndex: 100 }}>
          {[
            { id: "daily", label: "Daily" },
            { id: "habits", label: "Habits" },
            { id: "money", label: "Money" },
            { id: "gym", label: "Gym" },
            { id: "meals", label: "Meals" },
            { id: "planner", label: "Plan" },
          ].map(t => (
            <div key={t.id} onClick={() => { setPage(t.id); setViewingWorkout(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 8px" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: page === t.id ? CYAN : "transparent" }} />
              <div style={{ fontSize: 10, color: page === t.id ? CYAN : MUTED, fontWeight: page === t.id ? 500 : 400, letterSpacing: 0.5 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
