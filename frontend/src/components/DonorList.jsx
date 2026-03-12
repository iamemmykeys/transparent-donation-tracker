import { useState } from "react";

const ALL_DONORS = [
  { id: 1, name: "Amara Osei", email: "a.osei@email.com", amount: 5000, date: "2025-07-10", hash: "0xA3f7...91c2", campaign: "School Building Fund", status: "verified", avatar: "AO" },
  { id: 2, name: "Kwame Mensah", email: "k.mensah@email.com", amount: 2500, date: "2025-07-09", hash: "0xB7d4...44e1", campaign: "Clean Water Initiative", status: "verified", avatar: "KM" },
  { id: 3, name: "Fatima Al-Rashid", email: "f.rashid@email.com", amount: 1800, date: "2025-07-08", hash: "0xC2b9...77a3", campaign: "Medical Outreach", status: "pending", avatar: "FA" },
  { id: 4, name: "James Owusu", email: "j.owusu@email.com", amount: 3200, date: "2025-07-07", hash: "0xD9e1...23f8", campaign: "Food Relief Program", status: "verified", avatar: "JO" },
  { id: 5, name: "Yaa Asantewaa", email: "y.asante@email.com", amount: 900, date: "2025-07-06", hash: "0xE1c5...88b4", campaign: "School Building Fund", status: "verified", avatar: "YA" },
  { id: 6, name: "Anonymous", email: "—", amount: 4100, date: "2025-07-05", hash: "0xF6a2...55d7", campaign: "Clean Water Initiative", status: "flagged", avatar: "??" },
  { id: 7, name: "Chioma Eze", email: "c.eze@email.com", amount: 750, date: "2025-07-04", hash: "0xG3h8...12k9", campaign: "Medical Outreach", status: "verified", avatar: "CE" },
  { id: 8, name: "Kofi Boateng", email: "k.boateng@email.com", amount: 6000, date: "2025-07-03", hash: "0xH5j1...34m2", campaign: "Food Relief Program", status: "verified", avatar: "KB" },
  { id: 9, name: "Ngozi Adeyemi", email: "n.adeyemi@email.com", amount: 1200, date: "2025-07-02", hash: "0xI7k4...56p3", campaign: "School Building Fund", status: "pending", avatar: "NA" },
  { id: 10, name: "Samuel Darko", email: "s.darko@email.com", amount: 3800, date: "2025-07-01", hash: "0xJ9m6...78r4", campaign: "Clean Water Initiative", status: "verified", avatar: "SD" },
  { id: 11, name: "Abena Poku", email: "a.poku@email.com", amount: 2200, date: "2025-06-30", hash: "0xK1n8...90s5", campaign: "Medical Outreach", status: "verified", avatar: "AP" },
  { id: 12, name: "Emeka Okafor", email: "e.okafor@email.com", amount: 500, date: "2025-06-29", hash: "0xL3p0...12t6", campaign: "Food Relief Program", status: "flagged", avatar: "EO" },
];

const STATUS_CONFIG = {
  verified: { color: "#30d158", bg: "rgba(48,209,88,0.1)", border: "rgba(48,209,88,0.25)", label: "Verified" },
  pending: { color: "#ff9f0a", bg: "rgba(255,159,10,0.1)", border: "rgba(255,159,10,0.25)", label: "Pending" },
  flagged: { color: "#ff453a", bg: "rgba(255,69,58,0.1)", border: "rgba(255,69,58,0.25)", label: "Flagged" },
};

const CAMPAIGNS = ["All Campaigns", "School Building Fund", "Clean Water Initiative", "Medical Outreach", "Food Relief Program"];

const Avatar = ({ initials, id }) => {
  const colors = ["#e74c6f", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];
  const bg = colors[id % colors.length];
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}cc, ${bg})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, color: "#fff",
      fontFamily: "'Outfit', sans-serif", flexShrink: 0,
      border: `2px solid ${bg}40`,
    }}>{initials}</div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700,
      fontFamily: "'Outfit', sans-serif", letterSpacing: "0.03em",
    }}>{cfg.label}</span>
  );
};

const MiniStat = ({ label, value, color }) => (
  <div style={{
    background: "#111827", border: "1px solid #1f2937",
    borderRadius: 12, padding: "14px 20px", flex: 1, minWidth: 120,
  }}>
    <p style={{ margin: "0 0 4px", fontSize: 10, color: "#4b5563", fontWeight: 700, letterSpacing: "0.08em" }}>{label}</p>
    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: color || "#f9fafb", fontFamily: "'Outfit', sans-serif" }}>{value}</p>
  </div>
);

export default function DonorList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedHash, setCopiedHash] = useState(null);
  const PER_PAGE = 8;

  let filtered = ALL_DONORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.hash.toLowerCase().includes(search.toLowerCase()) ||
      d.campaign.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchCampaign = campaignFilter === "All Campaigns" || d.campaign === campaignFilter;
    return matchSearch && matchStatus && matchCampaign;
  });

  filtered = [...filtered].sort((a, b) => {
    let valA = a[sortBy], valB = b[sortBy];
    if (sortBy === "date") { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
    setCurrentPage(1);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const totalRaised = ALL_DONORS.reduce((s, d) => s + d.amount, 0);
  const verifiedCount = ALL_DONORS.filter(d => d.status === "verified").length;
  const flaggedCount = ALL_DONORS.filter(d => d.status === "flagged").length;

  const SortIcon = ({ col }) => (
    <span style={{ color: sortBy === col ? "#6366f1" : "#374151", marginLeft: 4, fontSize: 10 }}>
      {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", color: "#f9fafb", fontFamily: "'DM Sans', sans-serif", padding: "0 0 60px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .row-animate { animation: fadeIn 0.3s ease both; }
        input::placeholder { color: #374151; }
        select option { background: #111827; color: #f9fafb; }
      `}</style>

      <header style={{
        padding: "20px 28px", borderBottom: "1px solid #1f2937",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0a0f1aee", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 20, fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Donor List</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#4b5563" }}>All donors · Blockchain verified records</p>
        </div>
        <button style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
          color: "#fff", borderRadius: 10, padding: "9px 18px", fontSize: 13,
          fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
        }}>⬇ Export CSV</button>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ marginBottom: 24, animation: "fadeIn 0.4s ease both" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 28, fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Donor Records</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>Complete list of all donors with blockchain proof of every transaction</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, animation: "fadeIn 0.4s ease 0.1s both" }}>
          <MiniStat label="TOTAL DONORS" value={ALL_DONORS.length} color="#a78bfa" />
          <MiniStat label="TOTAL RAISED" value={`$${totalRaised.toLocaleString()}`} color="#34d399" />
          <MiniStat label="VERIFIED" value={verifiedCount} color="#30d158" />
          <MiniStat label="FLAGGED" value={flaggedCount} color="#ff453a" />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, animation: "fadeIn 0.4s ease 0.15s both" }}>
          <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search donor, campaign, hash..."
              style={{
                width: "100%", background: "#111827", border: "1px solid #1f2937",
                borderRadius: 10, padding: "10px 12px 10px 36px",
                color: "#f9fafb", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none",
              }} />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{
            background: "#111827", border: "1px solid #1f2937", borderRadius: 10,
            padding: "10px 14px", color: "#f9fafb", fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
          }}>
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
          <select value={campaignFilter} onChange={e => { setCampaignFilter(e.target.value); setCurrentPage(1); }} style={{
            background: "#111827", border: "1px solid #1f2937", borderRadius: 10,
            padding: "10px 14px", color: "#f9fafb", fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none", flex: 1, minWidth: 160,
          }}>
            {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 16, overflow: "hidden", animation: "fadeIn 0.4s ease 0.2s both" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
              Showing <span style={{ color: "#a78bfa", fontWeight: 600 }}>{filtered.length}</span> donors
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>Page {currentPage} of {totalPages}</p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {[{ label: "Donor", col: "name" }, { label: "Amount", col: "amount" }, { label: "Campaign", col: "campaign" }, { label: "Date", col: "date" }, { label: "Blockchain Hash", col: null }, { label: "Status", col: "status" }].map(({ label, col }) => (
                    <th key={label} onClick={() => col && handleSort(col)} style={{
                      textAlign: "left", color: "#4b5563", fontWeight: 700,
                      padding: "12px 16px", fontSize: 11, letterSpacing: "0.08em",
                      borderBottom: "1px solid #1f2937", whiteSpace: "nowrap",
                      cursor: col ? "pointer" : "default", userSelect: "none",
                    }}>{label}{col && <SortIcon col={col} />}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#374151", fontSize: 14 }}>No donors found matching your search.</td></tr>
                ) : paginated.map((donor, i) => (
                  <tr key={donor.id} className="row-animate"
                    style={{ borderBottom: "1px solid #1f293780", animationDelay: `${i * 0.04}s`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={donor.avatar} id={donor.id} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: "#f9fafb", fontSize: 13 }}>{donor.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#4b5563" }}>{donor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ color: "#34d399", fontWeight: 700, fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>${donor.amount.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{donor.campaign}</span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>{donor.date}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "monospace", color: "#60a5fa", fontSize: 12 }}>{donor.hash}</span>
                        <button onClick={() => handleCopyHash(donor.hash)} style={{
                          background: copiedHash === donor.hash ? "rgba(48,209,88,0.15)" : "rgba(96,165,250,0.1)",
                          border: `1px solid ${copiedHash === donor.hash ? "rgba(48,209,88,0.3)" : "rgba(96,165,250,0.2)"}`,
                          color: copiedHash === donor.hash ? "#30d158" : "#60a5fa",
                          borderRadius: 6, padding: "3px 8px", fontSize: 10,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                          transition: "all 0.2s", whiteSpace: "nowrap",
                        }}>{copiedHash === donor.hash ? "✓ Copied" : "Copy"}</button>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={donor.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ padding: "14px 20px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{
                background: "#1f2937", border: "1px solid #374151", color: currentPage === 1 ? "#374151" : "#f9fafb",
                borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: currentPage === 1 ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{
                  background: currentPage === p ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#1f2937",
                  border: `1px solid ${currentPage === p ? "#6366f1" : "#374151"}`,
                  color: "#f9fafb", borderRadius: 8, padding: "6px 12px", fontSize: 13,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: currentPage === p ? 700 : 400,
                }}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{
                background: "#1f2937", border: "1px solid #374151",
                color: currentPage === totalPages ? "#374151" : "#f9fafb",
                borderRadius: 8, padding: "6px 14px", fontSize: 13,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Next →</button>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 20, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center",
          gap: 12, fontSize: 13, color: "#4b5563",
        }}>
          <span style={{ fontSize: 16 }}>🔗</span>
          <span>Every donation hash is immutably stored on-chain.
            <span style={{ color: "#a78bfa", cursor: "pointer" }}> View all transactions on blockchain →</span>
          </span>
        </div>
      </main>
    </div>
  );
   }
