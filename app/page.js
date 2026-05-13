"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LayoutDashboard, Plane, MapPin, ChevronDown, Bell, Settings, ArrowUpRight, ArrowDownRight, Target, Menu, X, Moon, Sun, Download, Mail, Check } from "lucide-react";
import ClientDashboard from "./components/ClientDashboard";

const BRAND       = "#E21A6B";
const BRAND_LIGHT = "#fce7f0";
const BRAND_DARK  = "#b51555";

const CLIENTS = [
  { id:1, name:"Sunset Resorts Co.",  location:"Maldives",     platform:"Google Ads + Meta"    },
  { id:2, name:"Alpine Adventures",   location:"Colorado",     platform:"Google Ads + TikTok"  },
  { id:3, name:"Caribbean Cruises",   location:"Miami, FL",    platform:"Meta + Microsoft"     },
  { id:4, name:"Tokyo Travel Co.",    location:"Tokyo, Japan", platform:"All Platforms"        },
];

const MONTHLY_DATA = [
  { month:"Jan", spend:12400, revenue:52300,  roas:4.2  },
  { month:"Feb", spend:14200, revenue:61800,  roas:4.35 },
  { month:"Mar", spend:18600, revenue:83200,  roas:4.47 },
  { month:"Apr", spend:22100, revenue:98400,  roas:4.45 },
  { month:"May", spend:19800, revenue:89100,  roas:4.5  },
  { month:"Jun", spend:25300, revenue:118600, roas:4.69 },
];

function KpiCard({ icon: Icon, label, value, change, positive, accent, dark }) {
  return (
    <div className={`rounded-2xl border shadow-sm p-5 flex flex-col gap-3 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-100"}`}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent ? BRAND_LIGHT : dark ? "#374151" : "#f1f5f9" }}>
          <Icon size={17} style={{ color: accent ? BRAND : dark ? "#94a3b8" : "#64748b" }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
          {positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}{change}
        </span>
      </div>
      <div>
        <p className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{value}</p>
        <p className={`text-xs mt-0.5 ${dark ? "text-gray-400" : "text-slate-400"}`}>{label}</p>
      </div>
    </div>
  );
}

// ── Alert subscription modal ──────────────────────────────────────
function AlertModal({ client, onClose, dark }) {
  const [email,     setEmail]     = useState("");
  const [alerts,    setAlerts]    = useState({ roas:true, spend:true, conversions:false, cpa:false, weeklyReport:true });
  const [saved,     setSaved]     = useState(false);

  const toggleAlert = k => setAlerts(a => ({ ...a, [k]:!a[k] }));

  const handleSave = () => {
    if (!email) return;
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const alertOptions = [
    { key:"roas",          label:"ROAS drops below target",      desc:"Alert when ROAS falls under your threshold" },
    { key:"spend",         label:"Spend pacing alerts",          desc:"Daily/weekly spend vs budget tracking"      },
    { key:"conversions",   label:"Conversion drop alerts",       desc:"Alert when conversions drop >20% WoW"       },
    { key:"cpa",           label:"CPA spike alerts",             desc:"Alert when CPA rises above target"          },
    { key:"weeklyReport",  label:"Weekly performance digest",    desc:"Every Monday summary email"                 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor:"rgba(0,0,0,0.5)" }}>
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-6 ${dark ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor:BRAND_LIGHT }}>
              <Bell size={15} style={{ color:BRAND }}/>
            </div>
            <div>
              <h2 className={`text-base font-bold ${dark?"text-white":"text-slate-800"}`}>Subscribe to Alerts</h2>
              <p className={`text-xs ${dark?"text-gray-400":"text-slate-400"}`}>{client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className={`${dark?"text-gray-400":"text-slate-400"} hover:text-slate-600`}><X size={18}/></button>
        </div>

        {/* Email input */}
        <div className="mb-5">
          <label className={`text-xs font-semibold uppercase tracking-wide mb-1.5 block ${dark?"text-gray-400":"text-slate-500"}`}>Your email</label>
          <input
            type="email"
            placeholder="you@propellic.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full text-sm px-4 py-2.5 rounded-xl border outline-none transition-all ${dark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-slate-50 border-slate-200 text-slate-800"}`}
            style={{ focusBorderColor: BRAND }}
          />
        </div>

        {/* Alert toggles */}
        <div className="space-y-3 mb-6">
          <p className={`text-xs font-semibold uppercase tracking-wide ${dark?"text-gray-400":"text-slate-500"}`}>Alert types</p>
          {alertOptions.map(a => (
            <div key={a.key} className={`flex items-center justify-between p-3 rounded-xl ${dark?"bg-gray-700":"bg-slate-50"}`}>
              <div>
                <p className={`text-sm font-semibold ${dark?"text-white":"text-slate-700"}`}>{a.label}</p>
                <p className={`text-xs ${dark?"text-gray-400":"text-slate-400"}`}>{a.desc}</p>
              </div>
              <button onClick={() => toggleAlert(a.key)}
                className="w-10 h-6 rounded-full transition-all shrink-0 ml-3 relative"
                style={{ backgroundColor: alerts[a.key] ? BRAND : dark ? "#4b5563" : "#e2e8f0" }}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${alerts[a.key] ? "left-5" : "left-1"}`}/>
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleSave}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: saved ? "#10b981" : BRAND }}>
          {saved ? <><Check size={16}/> Subscribed!</> : <><Bell size={15}/> Subscribe to Alerts</>}
        </button>
      </div>
    </div>
  );
}

// ── PDF export helper ─────────────────────────────────────────────
function triggerPrint() {
  window.print();
}

export default function Dashboard() {
  const [activeClient,  setActiveClient]  = useState(null);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [dark,          setDark]          = useState(false);
  const [alertModal,    setAlertModal]    = useState(false);

  const bg      = dark ? "bg-gray-900"  : "bg-slate-50";
  const surface = dark ? "bg-gray-800"  : "bg-white";
  const border  = dark ? "border-gray-700" : "border-slate-100";
  const text    = dark ? "text-white"   : "text-slate-800";
  const subtext = dark ? "text-gray-400": "text-slate-400";

  return (
    <div className={`flex h-screen ${bg} overflow-hidden`} style={{ fontFamily:"'Nunito Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap');
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Alert modal */}
      {alertModal && activeClient && (
        <AlertModal client={activeClient} onClose={() => setAlertModal(false)} dark={dark}/>
      )}

      {/* Sidebar */}
      <aside className={`no-print ${sidebarOpen ? "w-56" : "w-16"} transition-all duration-300 ${surface} border-r ${border} flex flex-col shrink-0`}>
        {/* Logo */}
        <div className={`h-16 flex items-center px-4 border-b ${border} gap-3`}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor:BRAND }}>
            <Plane size={15} className="text-white"/>
          </div>
          {sidebarOpen && (
            <div>
              <p className={`font-bold text-sm leading-tight ${text}`}>Propellic</p>
              <p className="text-xs leading-tight font-semibold" style={{ color:BRAND }}>Travel Pulse</p>
            </div>
          )}
        </div>

        {/* Overview nav item */}
        <nav className="py-4 px-2">
          <button onClick={() => setActiveClient(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-1"
            style={!activeClient ? { backgroundColor:BRAND_LIGHT, color:BRAND, fontWeight:700 } : { color: dark?"#9ca3af":"#64748b" }}>
            <LayoutDashboard size={17} className="shrink-0"/>
            {sidebarOpen && <span>Overview</span>}
          </button>

          {/* Client list */}
          {sidebarOpen && (
            <div className="mt-3">
              <p className={`text-xs font-semibold uppercase tracking-wider px-3 mb-2 ${subtext}`}>Clients</p>
              {CLIENTS.map(c => (
                <button key={c.id} onClick={() => setActiveClient(c)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
                  style={activeClient?.id===c.id ? { backgroundColor:BRAND_LIGHT, color:BRAND, fontWeight:700 } : { color: dark?"#9ca3af":"#64748b" }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor:BRAND }}>{c.name[0]}</div>
                  <span className="truncate text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom — settings */}
        <div className={`mt-auto p-2 border-t ${border}`}>
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${subtext} hover:bg-opacity-10`}>
            <Settings size={17} className="shrink-0"/>
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`no-print h-16 ${surface} border-b ${border} flex items-center justify-between px-6 shrink-0`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${subtext} hover:text-slate-600`}>
              {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            {/* Client selector */}
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${dark?"bg-gray-700 border-gray-600 text-white":"bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"}`}>
                <MapPin size={14} style={{ color:BRAND }}/>
                {activeClient ? activeClient.name : "All Clients"}
                <ChevronDown size={14} className={subtext}/>
              </button>
              {dropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 w-64 ${surface} rounded-2xl border ${border} shadow-lg z-50 overflow-hidden`}>
                  <button onClick={() => { setActiveClient(null); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 transition-colors ${dark?"hover:bg-gray-700":"hover:bg-slate-50"}`}
                    style={!activeClient ? { backgroundColor:BRAND_LIGHT } : {}}>
                    <p className={`text-sm font-semibold ${text}`}>All Clients — Overview</p>
                    <p className={`text-xs mt-0.5 ${subtext}`}>Aggregate performance</p>
                  </button>
                  {CLIENTS.map(c => (
                    <button key={c.id} onClick={() => { setActiveClient(c); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 transition-colors ${dark?"hover:bg-gray-700":"hover:bg-slate-50"}`}
                      style={activeClient?.id===c.id ? { backgroundColor:BRAND_LIGHT } : {}}>
                      <p className={`text-sm font-semibold ${text}`}>{c.name}</p>
                      <p className={`text-xs mt-0.5 ${subtext}`}>{c.location} · {c.platform}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Alert subscribe */}
            {activeClient && (
              <button onClick={() => setAlertModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all"
                style={{ backgroundColor:BRAND_LIGHT, color:BRAND, borderColor:BRAND_LIGHT }}>
                <Bell size={13}/> Alerts
              </button>
            )}

            {/* PDF export */}
            <button onClick={triggerPrint}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${dark?"bg-gray-700 border-gray-600 text-gray-200":"bg-slate-50 border-slate-200 text-slate-600"}`}>
              <Download size={13}/> Export PDF
            </button>

            {/* Dark mode toggle */}
            <button onClick={() => setDark(!dark)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${dark?"bg-gray-700 border-gray-600 text-yellow-400":"bg-slate-50 border-slate-200 text-slate-500"}`}>
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>

            {/* Notification bell */}
            <button className={`relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${dark?"bg-gray-700 border-gray-600 text-gray-300":"bg-slate-50 border-slate-200 text-slate-400"}`}>
              <Bell size={17}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor:BRAND }}/>
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor:BRAND }}>P</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeClient ? (
            <div>
              <div className="mb-6">
                <button onClick={() => setActiveClient(null)} className="text-xs font-semibold hover:underline mb-1 block" style={{ color:BRAND }}>← All Clients</button>
                <h1 className={`text-xl font-bold ${text}`}>{activeClient.name}</h1>
                <p className={`text-sm mt-0.5 ${subtext}`}>{activeClient.location} · {activeClient.platform} · May 2026</p>
              </div>
              <ClientDashboard client={activeClient} dark={dark}/>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className={`text-xl font-bold ${text}`}>All Clients Overview</h1>
                <p className={`text-sm mt-0.5 ${subtext}`}>Aggregate performance across all travel clients · May 2026</p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard icon={Target}     label="Total Ad Spend"  value="$25,300"  change="12.4%" positive={false} accent={false} dark={dark}/>
                <KpiCard icon={ArrowUpRight} label="Total Revenue" value="$118,600" change="18.7%" positive={true}  accent={true}  dark={dark}/>
                <KpiCard icon={Target}     label="Blended ROAS"    value="4.69x"    change="4.2%"  positive={true}  accent={true}  dark={dark}/>
                <KpiCard icon={Plane}      label="Bookings"        value="312"      change="9.1%"  positive={true}  accent={false} dark={dark}/>
              </div>

              {/* Client cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {CLIENTS.map(c => (
                  <button key={c.id} onClick={() => setActiveClient(c)}
                    className={`${surface} rounded-2xl border ${border} shadow-sm p-5 text-left hover:border-pink-200 transition-all`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor:BRAND }}>{c.name[0]}</div>
                        <div>
                          <p className={`font-semibold text-sm ${text}`}>{c.name}</p>
                          <p className={`text-xs ${subtext}`}>{c.location}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor:BRAND_LIGHT, color:BRAND }}>View →</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[["ROAS","4.69x"],["Bookings","312"],["Spend","$25.3K"]].map(([l,v]) => (
                        <div key={l} className={`rounded-lg p-2 text-center ${dark?"bg-gray-700":"bg-slate-50"}`}>
                          <p className={`text-xs ${subtext}`}>{l}</p>
                          <p className={`text-sm font-bold ${text}`}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`${surface} rounded-2xl border ${border} shadow-sm p-6`}>
                  <h2 className={`text-base font-semibold mb-1 ${text}`}>ROAS Trend</h2>
                  <p className={`text-xs mb-4 ${subtext}`}>All clients combined</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={MONTHLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"}/>
                      <XAxis dataKey="month" tick={{ fontSize:11, fill: dark?"#9ca3af":"#94a3b8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill: dark?"#9ca3af":"#94a3b8" }} axisLine={false} tickLine={false} domain={[3.5,5.5]}/>
                      <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e2e8f0", fontSize:12, backgroundColor: dark?"#1f2937":"#fff" }}/>
                      <Line type="monotone" dataKey="roas" stroke={BRAND} strokeWidth={2.5} dot={{ fill:BRAND, r:3 }}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className={`${surface} rounded-2xl border ${border} shadow-sm p-6`}>
                  <h2 className={`text-base font-semibold mb-1 ${text}`}>Spend vs Revenue</h2>
                  <p className={`text-xs mb-4 ${subtext}`}>Monthly comparison</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={MONTHLY_DATA} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"} vertical={false}/>
                      <XAxis dataKey="month" tick={{ fontSize:11, fill: dark?"#9ca3af":"#94a3b8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize:11, fill: dark?"#9ca3af":"#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                      <Tooltip contentStyle={{ borderRadius:"12px", border:"1px solid #e2e8f0", fontSize:12, backgroundColor: dark?"#1f2937":"#fff" }} formatter={v=>[`$${v.toLocaleString()}`,""]}/>
                      <Bar dataKey="spend"   name="Ad Spend" fill={dark?"#374151":"#e2e8f0"} radius={[4,4,0,0]}/>
                      <Bar dataKey="revenue" name="Revenue"  fill={BRAND} radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
