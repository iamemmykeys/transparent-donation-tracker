import { useState, useEffect, useRef } from "react";

const CAMPAIGNS = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description: "Providing safe drinking water to rural communities",
    raised: 42500,
    goal: 60000,
    donors: 318,
    daysLeft: 14,
    color: "#00c2ff",
    icon: "💧",
  },
  {
    id: 2,
    title: "School Building Fund",
    description: "Constructing classrooms for 500 children",
    raised: 57800,
    goal: 75000,
    donors: 512,
    daysLeft: 8,
    color: "#30d158",
    icon: "🏫",
  },
  {
    id: 3,
    title: "Medical Outreach",
    description: "Free health screenings for underserved areas",
    raised: 18200,
    goal: 40000,
    donors: 204,
    daysLeft: 30,
    color: "#ff6b6b",
    icon: "🏥",
  },
  {
    id: 4,
    title: "Food Relief Program",
    description: "Emergency food support for 1,000 families",
    raised: 33900,
    goal: 35000,
    donors: 891,
    daysLeft: 3,
    color: "#ffd93d",
    icon: "🌾",
  },
];

const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
};

const RingProgress = ({ percent, color, size = 80 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 200);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e2530" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ * (1 - animated / 100)}
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
};

const CampaignCard = ({ campaign, index }) => {
  const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const remaining = campaign.goal - campaign.raised;
  const isNearEnd = campaign.daysLeft <= 7;
  const isAlmostFunded = percent >= 90;
  return (
    <div style={{
      background: "#0f1923", border: `1px solid ${campaign.color}25`,
      borderRadius: 20, padding: 24, position: "relative", overflow: "hidden",
      animation: `slideUp 0.5s ease ${index * 0.1}s both`,
      transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${campaign.color}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{
        position: "absolute", top: -40, right: -40, width: 120, height: 120,
        borderRadius: "50%", background: `radial-gradient(circle, ${campaign.color}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: `${campaign.color}18`,
            border: `1px solid ${campaign.color}40`, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>{campaign.icon}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontFamily: "'Sora', sans-serif", color: "#e8f0fe", fontWeight: 700 }}>{campaign.title}</h3>
            <p style={{ margin: 0, fontSize: 11, color: "#5a6a7e", marginTop: 2 }}>{campaign.description}</p>
          </div>
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <RingProgress percent={percent} color={campaign.color} size={64} />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 11, fontWeight: 700, color: campaign.color,
            fontFamily: "'Sora', sans-serif",
          }}>{Math.floor(percent)}%</div>
        </div>
      </div>
      <div style={{
        background: "#1a2535", borderRadius: 100, height: 8,
        overflow: "hidden", marginBottom: 16, border: "1px solid #1e2d3d",
      }}>
        <div style={{
          height: "100%", width: `${percent}%`,
          background: isAlmostFunded ? `linear-gradient(90deg, ${campaign.color}, #fff)` : `linear-gradient(90deg, ${campaign.color}99, ${campaign.color})`,
          borderRadius: 100, transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 10px ${campaign.color}60`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: "#5a6a7e", marginBottom: 2 }}>RAISED</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: campaign.color, fontFamily: "'Sora', sans-serif" }}>
            <AnimatedNumber value={campaign.raised} prefix="$" />
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#3d4f63" }}>of ${campaign.goal.toLocaleString()} goal</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#5a6a7e", marginBottom: 2 }}>DONORS</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e8f0fe", fontFamily: "'Sora', sans-serif" }}>
            <AnimatedNumber value={campaign.donors} />
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#5a6a7e", marginBottom: 2 }}>REMAINING</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#e8f0fe", fontFamily: "'Sora', sans-serif" }}>${remaining.toLocaleString()}</p>
          <div style={{
            marginTop: 4, background: isNearEnd ? "rgba(255,107,107,0.12)" : "rgba(90,106,126,0.15)",
            border: `1px solid ${isNearEnd ? "#ff6b6b40" : "#3d4f6340"}`,
            borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
            color: isNearEnd ? "#ff6b6b" : "#5a6a7e", display: "inline-block",
          }}>{isNearEnd ? "⚡ " : "🗓 "}{campaign.daysLeft}d left</div>
        </div>
      </div>
      {isAlmostFunded && (
        <div style={{
          marginTop: 16, background: `linear-gradient(90deg, ${campaign.color}15, ${campaign.color}05)`,
          border: `1px solid ${campaign.color}30`, borderRadius: 10, padding: "8px 14px",
          fontSize: 12, color: campaign.color, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>🎯</span> Almost fully funded! Just ${remaining.toLocaleString()} to go!
        </div>
      )}
    </div>
  );
};

const SummaryBar = () => {
  const totalRaised = CAMPAIGNS.reduce((s, c) => s + c.raised, 0);
  const totalGoal = CAMPAIGNS.reduce((s, c) => s + c.goal, 0);
  const totalDonors = CAMPAIGNS.reduce((s, c) => s + c.donors, 0);
  const overallPct = ((totalRaised / totalGoal) * 100).toFixed(1);
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f1923, #131f2e)", border: "1px solid #1e2d3d",
      borderRadius: 16, padding: "20px 28px", display: "flex", gap: 0,
      flexWrap: "wrap", marginBottom: 28,
    }}>
      {[
        { label: "TOTAL RAISED", value: totalRaised, prefix: "$", color: "#30d158" },
        { label: "OVERALL GOAL", value: totalGoal, prefix: "$", color: "#00c2ff" },
        { label: "TOTAL DONORS", value: totalDonors, prefix: "", color: "#ffd93d" },
        { label: "FUNDED", value: parseFloat(overallPct), prefix: "", suffix: "%", color: "#ff6b6b" },
      ].map((stat, i) => (
        <div key={i} style={{
          flex: 1, minWidth: 120, borderRight: i < 3 ? "1px solid #1e2d3d" : "none",
          padding: "0 24px", textAlign: "center",
        }}>
          <p style={{ margin: "0 0 4px", fontSize: 10, color: "#3d4f63", letterSpacing: "0.1em", fontWeight: 700 }}>{stat.label}</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: stat.color, fontFamily: "'Sora', sans-serif" }}>
            <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix || ""} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default function GoalTracker() {
  const [filter, setFilter] = useState("all");
  const filtered = CAMPAIGNS.filter(c => {
    const pct = (c.raised / c.goal) * 100;
    if (filter === "active") return pct < 100 && c.daysLeft > 7;
    if (filter === "urgent") return c.daysLeft <= 7;
    if (filter === "funded") return pct >= 90;
    return true;
  });
  return (
    <div style={{ minHeight: "100vh", background: "#080e17", color: "#e8f0fe", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <header style={{
        padding: "24px 32px", borderBottom: "1px solid #1e2d3d",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#080e17ee", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontFamily: "'Sora', sans-serif", fontWeight: 800,
            background: "linear-gradient(90deg, #00c2ff, #30d158)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Goal Tracker</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#3d4f63" }}>Live campaign progress · Blockchain verified</p>
        </div>
        <div style={{ display: "flex", gap: 6, background: "#0f1923", borderRadius: 12, padding: 4, border: "1px solid #1e2d3d" }}>
          {["all", "urgent", "funded", "active"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "#1a2d45" : "transparent",
              border: filter === f ? "1px solid #00c2ff30" : "1px solid transparent",
              color: filter === f ? "#00c2ff" : "#3d4f63",
              borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              textTransform: "capitalize", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>
      </header>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ marginBottom: 28, animation: "slideUp 0.4s ease both" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 30, fontFamily: "'Sora', sans-serif", fontWeight: 800 }}>Campaign Goals</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#3d4f63" }}>Track progress across all active donation campaigns in real time</p>
        </div>
        <SummaryBar />
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#3d4f63", padding: "60px 0", fontSize: 15 }}>No campaigns match this filter.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 18 }}>
            {filtered.map((c, i) => <CampaignCard key={c.id} campaign={c} index={i} />)}
          </div>
        )}
        <div style={{
          marginTop: 32, background: "rgba(0,194,255,0.04)", border: "1px solid rgba(0,194,255,0.15)",
          borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center",
          gap: 12, fontSize: 13, color: "#3d4f63",
        }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>All campaign goals and donations are transparently recorded on-chain.
            <span style={{ color: "#00c2ff", cursor: "pointer" }}> Verify on blockchain →</span>
          </span>
        </div>
      </main>
    </div>
  );
    }
