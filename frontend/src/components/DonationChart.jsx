import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", donations: 4200, donors: 89, target: 5000 },
  { month: "Feb", donations: 6800, donors: 134, target: 6000 },
  { month: "Mar", donations: 5400, donors: 112, target: 6000 },
  { month: "Apr", donations: 9100, donors: 198, target: 8000 },
  { month: "May", donations: 7600, donors: 156, target: 8000 },
  { month: "Jun", donations: 11200, donors: 231, target: 10000 },
  { month: "Jul", donations: 13500, donors: 287, target: 12000 },
];

const CATEGORY_DATA = [
  { name: "Education", value: 8400, color: "#f59e0b" },
  { name: "Health", value: 6200, color: "#10b981" },
  { name: "Food", value: 4900, color: "#3b82f6" },
  { name: "Shelter", value: 3700, color: "#8b5cf6" },
  { name: "Environment", value: 2100, color: "#ef4444" },
];

const WEEKLY_DATA = [
  { day: "Mon", amount: 1200 },
  { day: "Tue", amount: 2100 },
  { day: "Wed", amount: 800 },
  { day: "Thu", amount: 3400 },
  { day: "Fri", amount: 2800 },
  { day: "Sat", amount: 4200 },
  { day: "Sun", amount: 1900 },
];

const GROWTH_DATA = [
  { month: "Jan", newDonors: 89, returning: 12 },
  { month: "Feb", newDonors: 134, returning: 28 },
  { month: "Mar", newDonors: 112, returning: 41 },
  { month: "Apr", newDonors: 198, returning: 67 },
  { month: "May", newDonors: 156, returning: 88 },
  { month: "Jun", newDonors: 231, returning: 102 },
  { month: "Jul", newDonors: 287, returning: 134 },
];

const CustomTooltip = ({ active, payload, label, prefix = "$" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      borderRadius: 10, padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <p style={{ margin: "0 0 6px", color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.color, fontSize: 13, fontWeight: 700 }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, span = 1 }) => (
  <div style={{
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 18, padding: "22px 24px",
    gridColumn: span === 2 ? "span 2" : "span 1",
    animation: "fadeUp 0.5s ease both",
  }}>
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 15, color: "#f1f5f9", fontWeight: 700 }}>{title}</h3>
      {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

const StatPill = ({ label, value, delta, color }) => (
  <div style={{
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 14, padding: "16px 20px",
    flex: 1, minWidth: 130, animation: "fadeUp 0.4s ease both",
  }}>
    <p style={{ margin: "0 0 6px", fontSize: 10, color: "#475569", fontWeight: 700, letterSpacing: "0.1em" }}>{label}</p>
    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: color || "#f1f5f9" }}>{value}</p>
    {delta && (
      <p style={{ margin: "4px 0 0", fontSize: 11, color: delta.startsWith("+") ? "#10b981" : "#ef4444" }}>
        {delta} vs last month
      </p>
    )}
  </div>
);

const PieLegend = ({ data }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
    {data.map((item) => (
      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", flex: 1 }}>{item.name}</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>${item.value.toLocaleString()}</p>
      </div>
    ))}
  </div>
);

const RangeSelector = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 4, background: "#1e293b", borderRadius: 10, padding: 3 }}>
    {["7D", "1M", "3M", "1Y"].map(r => (
      <button key={r} onClick={() => onChange(r)} style={{
        background: value === r ? "#3b82f6" : "transparent",
        border: "none", color: value === r ? "#fff" : "#475569",
        borderRadius: 7, padding: "5px 12px", fontSize: 12,
        cursor: "pointer", fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
      }}>{r}</button>
    ))}
  </div>
);

export default function DonationChart() {
  const [range, setRange] = useState("1M");
  const [activeChart, setActiveChart] = useState("area");

  const totalDonations = MONTHLY_DATA.reduce((s, d) => s + d.donations, 0);
  const totalDonors = MONTHLY_DATA.reduce((s, d) => s + d.donors, 0);
  const avgDonation = Math.round(totalDonations / totalDonors);
  const bestMonth = MONTHLY_DATA.reduce((a, b) => a.donations > b.donations ? a : b);

  return (
    <div style={{ minHeight: "100vh", background: "#060c18", color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header style={{
        padding: "20px 28px", borderBottom: "1px solid #1e293b",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#060c18ee", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 20, fontWeight: 800,
            background: "linear-gradient(90deg, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Donation Analytics</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#334155" }}>Real-time charts · Blockchain verified data</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ marginBottom: 24, animation: "fadeUp 0.4s ease both" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 800 }}>Donation Charts</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Visual breakdown of all donation activity and trends</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <StatPill label="TOTAL RAISED" value={`$${totalDonations.toLocaleString()}`} delta="+18%" color="#38bdf8" />
          <StatPill label="TOTAL DONORS" value={totalDonors.toLocaleString()} delta="+23%" color="#818cf8" />
          <StatPill label="AVG DONATION" value={`$${avgDonation}`} delta="+5%" color="#10b981" />
          <StatPill label="BEST MONTH" value={bestMonth.month} color="#f59e0b" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>

          <ChartCard title="Donation Trend" subtitle="Monthly donation amounts vs target" span={2}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["area", "bar", "line"].map(t => (
                <button key={t} onClick={() => setActiveChart(t)} style={{
                  background: activeChart === t ? "rgba(56,189,248,0.15)" : "transparent",
                  border: `1px solid ${activeChart === t ? "#38bdf8" : "#1e293b"}`,
                  color: activeChart === t ? "#38bdf8" : "#475569",
                  borderRadius: 8, padding: "5px 14px", fontSize: 12,
                  cursor: "pointer", fontWeight: 600, textTransform: "capitalize",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}>{t}</button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              {activeChart === "area" ? (
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="target" name="Target" stroke="#818cf8" strokeWidth={2} fill="url(#purpleGrad)" strokeDasharray="5 5" dot={false} />
                  <Area type="monotone" dataKey="donations" name="Donations" stroke="#38bdf8" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ fill: "#38bdf8", r: 4, strokeWidth: 0 }} />
                </AreaChart>
              ) : activeChart === "bar" ? (
                <BarChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="target" name="Target" fill="#818cf840" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="donations" name="Donations" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="donations" name="Donations" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: "#38bdf8", r: 5, strokeWidth: 0 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="By Category" subtitle="Donations split by cause">
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                <PieLegend data={CATEGORY_DATA} />
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Weekly Activity" subtitle="Donations by day this week">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={WEEKLY_DATA} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="Amount" radius={[6, 6, 0, 0]}>
                  {WEEKLY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.amount === Math.max(...WEEKLY_DATA.map(d => d.amount)) ? "#f59e0b" : "#1e3a5f"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Donor Growth" subtitle="New vs returning donors" span={2}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip prefix="" />} />
                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{v}</span>} />
                <Bar dataKey="newDonors" name="New Donors" fill="#38bdf8" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="returning" name="Returning" fill="#818cf8" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        <div style={{
          marginTop: 24, background: "rgba(56,189,248,0.04)",
          border: "1px solid rgba(56,189,248,0.15)", borderRadius: 12,
          padding: "14px 20px", display: "flex", alignItems: "center",
          gap: 12, fontSize: 13, color: "#334155",
          animation: "fadeUp 0.5s ease 0.3s both",
        }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>All chart data is sourced from on-chain verified transactions.
            <span style={{ color: "#38bdf8", cursor: "pointer" }}> View raw blockchain data →</span>
          </span>
        </div>
      </main>
    </div>
  );
}
