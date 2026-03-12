import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const donationTrend = [
  { month: "Jan", amount: 4200 },
  { month: "Feb", amount: 6800 },
  { month: "Mar", amount: 5400 },
  { month: "Apr", amount: 9100 },
  { month: "May", amount: 7600 },
  { month: "Jun", amount: 11200 },
  { month: "Jul", amount: 13500 },
];

const categoryData = [
  { name: "Education", amount: 8400 },
  { name: "Health", amount: 6200 },
  { name: "Food", amount: 4900 },
  { name: "Shelter", amount: 3700 },
  { name: "Environment", amount: 2100 },
];

const donors = [
  { id: 1, name: "Amara Osei", amount: 5000, date: "2025-07-10", hash: "0xA3f...91c", status: "verified" },
  { id: 2, name: "Kwame Mensah", amount: 2500, date: "2025-07-09", hash: "0xB7d...44e", status: "verified" },
  { id: 3, name: "Fatima Al-Rashid", amount: 1800, date: "2025-07-08", hash: "0xC2b...77a", status: "pending" },
  { id: 4, name: "James Owusu", amount: 3200, date: "2025-07-07", hash: "0xD9e...23f", status: "verified" },
  { id: 5, name: "Yaa Asantewaa", amount: 900, date: "2025-07-06", hash: "0xE1c...88b", status: "verified" },
  { id: 6, name: "Anonymous", amount: 4100, date: "2025-07-05", hash: "0xF6a...55d", status: "flagged" },
];

const GOAL = 75000;
const RAISED = 57800;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0d1117",
        border: "1px solid #30d158",
        borderRadius: "8px",
        padding: "10px 16px",
        color: "#e6edf3",
        fontSize: "13px",
      }}>
        <p style={{ color: "#30d158", marginBottom: 4 }}>{label}</p>
        <p>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const GoalTracker = ({ raised, goal }) => {
  const percent = Math.min((raised / goal) * 100, 100).toFixed(1);
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percent), 300);
    return () => clearTimeout(timer);
  }, [percent]);
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={labelStyle}>CAMPAIGN GOAL</p>
          <h2 style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: "#e6edf3", margin: 0 }}>
            ${raised.toLocaleString()}
            <span style={{ fontSize: 16, color: "#8b949e", fontFamily: "'DM Sans', sans-serif" }}> / ${goal.toLocaleString()}</span>
          </h2>
        </div>
        <div style={{
          background: "rgba(48, 209, 88, 0.1)",
          border: "1px solid rgba(48, 209, 88, 0.3)",
          borderRadius: "20px",
          padding: "6px 14px",
          color: "#30d158",
          fontSize: 13,
          fontWeight: 600,
        }}>{percent}% funded</div>
      </div>
      <div style={{ background: "#161b22", borderRadius: 100, height: 12, overflow: "hidden", border: "1px solid #21262d" }}>
        <div style={{
          height: "100%",
          width: `${animated}%`,
          background: "linear-gradient(90deg, #30d158, #34c759)",
          borderRadius: 100,
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 12px rgba(48, 209, 88, 0.4)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ color: "#8b949e", fontSize: 12 }}>$0</span>
        <span style={{ color: "#8b949e", fontSize: 12 }}>${goal.toLocaleString()}</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ ...cardStyle, flex: 1, minWidth: 140 }}>
    <p style={labelStyle}>{label}</p>
    <h3 style={{ fontSize: 26, fontFamily: "'Playfair Display', serif", color: accent || "#e6edf3", margin: "6px 0 4px" }}>{value}</h3>
    {sub && <p style={{ color: "#8b949e", fontSize: 12, margin: 0 }}>{sub}</p>}
  </div>
);

const DonorList = ({ donors }) => {
  const statusColor = { verified: "#30d158", pending: "#ff9f0a", flagged: "#ff453a" };
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <p style={labelStyle}>RECENT DONORS</p>
        <button style={ghostBtn}>View All</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Donor", "Amount", "Date", "Blockchain Hash", "Status"].map(h => (
                <th key={h} style={{
                  textAlign: "left", color: "#8b949e", fontWeight: 600,
                  padding: "6px 12px 10px", borderBottom: "1px solid #21262d",
                  whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.05em", fontSize: 11,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={d.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(48,209,88,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
              >
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: `hsl(${d.id * 47}, 60%, 35%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#e6edf3", fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>{d.name[0]}</div>
                    {d.name}
                  </div>
                </td>
                <td style={{ ...tdStyle, color: "#30d158", fontWeight: 600 }}>${d.amount.toLocaleString()}</td>
                <td style={{ ...tdStyle, color: "#8b949e" }}>{d.date}</td>
                <td style={{ ...tdStyle, fontFamily: "monospace", color: "#58a6ff", fontSize: 12 }}>{d.hash}</td>
                <td style={tdStyle}>
                  <span style={{
                    background: `rgba(${statusColor[d.status] === "#30d158" ? "48,209,88" : statusColor[d.status] === "#ff9f0a" ? "255,159,10" : "255,69,58"},0.1)`,
                    color: statusColor[d.status],
                    border: `1px solid ${statusColor[d.status]}40`,
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 11, fontWeight: 600, textTransform: "capitalize",
                  }}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "22px 24px",
};
const labelStyle = {
  color: "#8b949e", fontSize: 11, fontFamily: "'DM Sans', sans-serif",
  letterSpacing: "0.1em", fontWeight: 700, margin: 0, textTransform: "uppercase",
};
const tdStyle = { padding: "12px", color: "#e6edf3", borderBottom: "1px solid #21262d" };
const ghostBtn = {
  background: "transparent", border: "1px solid #30d15850", color: "#30d158",
  borderRadius: 8, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [exportMsg, setExportMsg] = useState("");
  const handleExport = () => {
    setExportMsg("Report exported! ✓");
    setTimeout(() => setExportMsg(""), 2500);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>
      <header style={{
        borderBottom: "1px solid #21262d", padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "#0d1117ee", backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #30d158, #34c759)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>💚</div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: 0, color: "#e6edf3" }}>GiveClear</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#8b949e" }}>Transparent Donation Tracker</p>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {["overview", "donors", "reports"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? "rgba(48,209,88,0.1)" : "transparent",
              border: activeTab === tab ? "1px solid rgba(48,209,88,0.3)" : "1px solid transparent",
              color: activeTab === tab ? "#30d158" : "#8b949e",
              borderRadius: 8, padding: "7px 16px", fontSize: 13, cursor: "pointer",
              textTransform: "capitalize", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </nav>
        <button onClick={handleExport} style={{
          background: "#30d158", border: "none", color: "#0d1117",
          borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>{exportMsg || "⬇ Export Report"}</button>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, margin: "0 0 6px" }}>Donation Dashboard</h2>
          <p style={{ color: "#8b949e", margin: 0, fontSize: 14 }}>Live overview · Last updated just now · All donations verified on-chain</p>
        </div>
        <div className="fade-up" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <StatCard label="Total Raised" value="$57,800" sub="+$3,200 this week" accent="#30d158" />
          <StatCard label="Total Donors" value="1,243" sub="86 new this month" />
          <StatCard label="Avg Donation" value="$46.50" sub="↑ 12% vs last month" />
          <StatCard label="Verified Txns" value="1,189" sub="96% on-chain verified" accent="#58a6ff" />
        </div>
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <GoalTracker raised={RAISED} goal={GOAL} />
        </div>
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: 18 }}>DONATION TREND</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={donationTrend}>
                <defs>
                  <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30d158" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#30d158" strokeWidth={2} fill="url(#green)" dot={{ fill: "#30d158", strokeWidth: 0, r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: 18 }}>BY CATEGORY</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#30d158" radius={[0, 6, 6, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="fade-up">
          <DonorList donors={donors} />
        </div>
        <div className="fade-up" style={{
          marginTop: 20, background: "rgba(88, 166, 255, 0.05)",
          border: "1px solid rgba(88, 166, 255, 0.2)", borderRadius: 12,
          padding: "14px 20px", display: "flex", alignItems: "center",
          gap: 12, fontSize: 13, color: "#8b949e",
        }}>
          <span style={{ fontSize: 18 }}>🔗</span>
          <span>All verified donations are recorded on-chain. Each hash links to an immutable blockchain proof of transaction. <span style={{ color: "#58a6ff", cursor: "pointer" }}>Learn more →</span></span>
        </div>
      </main>
    </div>
  );
   }
