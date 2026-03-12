      import { useState } from "react";
import Dashboard from "./components/Dashboard";
import GoalTracker from "./components/GoalTracker";
import DonorList from "./components/DonorList";
import DonationChart from "./components/DonationChart";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "goals", label: "Goal Tracker", icon: "🎯" },
  { id: "donors", label: "Donor List", icon: "👥" },
  { id: "charts", label: "Charts", icon: "📊" },
];

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "goals": return <GoalTracker />;
      case "donors": return <DonorList />;
      case "charts": return <DonationChart />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* TOP NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "#0d1117ee", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #21262d",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #30d158, #00c2ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>💚</div>
          <div>
            <p style={{
              fontSize: 15, fontWeight: 800, color: "#e6edf3",
              fontFamily: "'DM Sans', sans-serif",
            }}>GiveClear</p>
            <p style={{ fontSize: 9, color: "#8b949e" }}>Transparent Donation Tracker</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)} style={{
              background: activePage === item.id ? "rgba(48,209,88,0.1)" : "transparent",
              border: activePage === item.id ? "1px solid rgba(48,209,88,0.3)" : "1px solid transparent",
              color: activePage === item.id ? "#30d158" : "#8b949e",
              borderRadius: 8, padding: "7px 14px",
              fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none",
          background: "transparent", border: "1px solid #21262d",
          color: "#e6edf3", borderRadius: 8, padding: "6px 10px",
          fontSize: 18, cursor: "pointer",
        }} className="mobile-menu-btn">☰</button>

        {/* Blockchain Badge */}
        <div style={{
          background: "rgba(88,166,255,0.1)",
          border: "1px solid rgba(88,166,255,0.2)",
          borderRadius: 20, padding: "5px 12px",
          fontSize: 11, color: "#58a6ff", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#30d158",
            display: "inline-block",
            boxShadow: "0 0 6px #30d158",
          }} />
          Chain: Live
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, zIndex: 999,
          background: "#161b22", borderBottom: "1px solid #21262d",
          padding: "12px 16px",
          display: "flex", flexDirection: "column", gap: 4,
          animation: "slideDown 0.2s ease both",
        }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActivePage(item.id); setMenuOpen(false); }} style={{
              background: activePage === item.id ? "rgba(48,209,88,0.1)" : "transparent",
              border: activePage === item.id ? "1px solid rgba(48,209,88,0.2)" : "1px solid transparent",
              color: activePage === item.id ? "#30d158" : "#8b949e",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 14, cursor: "pointer", textAlign: "left",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* PAGE CONTENT */}
      <div style={{ paddingTop: 60 }}>
        {renderPage()}
      </div>

      {/* BOTTOM TAB BAR (Mobile) */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: "#161b22ee", backdropFilter: "blur(12px)",
        borderTop: "1px solid #21262d",
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 12px",
      }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActivePage(item.id)} style={{
            background: "transparent", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, cursor: "pointer", padding: "4px 12px",
            color: activePage === item.id ? "#30d158" : "#8b949e",
            transition: "all 0.2s",
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              color: activePage === item.id ? "#30d158" : "#8b949e",
            }}>{item.label}</span>
            {activePage === item.id && (
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "#30d158",
                boxShadow: "0 0 6px #30d158",
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
  }
