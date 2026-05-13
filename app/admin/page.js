"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const BRAND = "#E21A6B";
const BRAND_LIGHT = "#fce7f0";
const CLIENTS = ["Sunset Resorts Co.", "Alpine Adventures", "Caribbean Cruises", "Tokyo Travel Co."];
const ROLE_COLORS = {
  super_admin:     { bg:"#fce7f0", text:"#E21A6B", label:"Super Admin"     },
  account_manager: { bg:"#eff6ff", text:"#2563eb", label:"Account Manager" },
  client:          { bg:"#f0fdf4", text:"#16a34a", label:"Client"          },
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState([
    { id:1, name:"Kerry Ballard",  email:"kerry@propellic.com",      role:"super_admin",     clients:CLIENTS,                                     status:"active" },
    { id:2, name:"Sarah Johnson",  email:"sarah@propellic.com",      role:"account_manager", clients:["Sunset Resorts Co.","Alpine Adventures"],  status:"active" },
    { id:3, name:"Mike Torres",    email:"mike@propellic.com",       role:"account_manager", clients:["Caribbean Cruises"],                        status:"active" },
    { id:4, name:"Sunset Resorts", email:"client@sunsetresorts.com", role:"client",          clients:["Sunset Resorts Co."],                      status:"active" },
  ]);
  const [showModal,  setShowModal]  = useState(false);
  const [editUser,   setEditUser]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [form,       setForm]       = useState({ name:"", email:"", role:"account_manager", clients:[] });
  const [saved,      setSaved]      = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (email !== "kerry@propellic.com") router.push("/");
    }
  }, [isLoaded, user]);

  const openCreate = () => { setEditUser(null); setForm({ name:"", email:"", role:"account_manager", clients:[] }); setShowModal(true); };
  const openEdit   = u  => { setEditUser(u); setForm({ name:u.name, email:u.email, role:u.role, clients:[...u.clients] }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editUser) { setUsers(us => us.map(u => u.id===editUser.id ? {...u,...form} : u)); }
    else { setUsers(us => [...us, { id:Date.now(), ...form, status:"pending" }]); }
    setSaved(true); setTimeout(() => { setSaved(false); setShowModal(false); }, 1200);
  };
  const handleDelete = id => setUsers(us => us.filter(u => u.id!==id));
  const toggleStatus = id => setUsers(us => us.map(u => u.id===id ? {...u,status:u.status==="active"?"suspended":"active"} : u));
  const toggleClient = c  => setForm(f => ({ ...f, clients: f.clients.includes(c) ? f.clients.filter(x=>x!==c) : [...f.clients,c] }));
  const filtered = users.filter(u => (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) && (filterRole==="all" || u.role===filterRole));
  const stats = [
    { label:"Total Users",      value:users.length },
    { label:"Account Managers", value:users.filter(u=>u.role==="account_manager").length },
    { label:"Client Logins",    value:users.filter(u=>u.role==="client").length },
    { label:"Pending Invites",  value:users.filter(u=>u.status==="pending").length },
  ];

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f8fafc", fontFamily:"'Nunito Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap');`}</style>
      <header style={{ backgroundColor:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 24px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"10px", backgroundColor:BRAND, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"white", fontSize:"16px" }}>✈</span>
          </div>
          <div>
            <p style={{ margin:0, fontWeight:800, fontSize:"14px", color:"#1e293b" }}>Propellic Travel Pulse</p>
            <p style={{ margin:0, fontSize:"11px", color:BRAND, fontWeight:600 }}>Admin Panel</p>
          </div>
        </div>
        <a href="/" style={{ fontSize:"13px", color:"#64748b", textDecoration:"none", fontWeight:600 }}>← Back to Dashboard</a>
      </header>
      <main style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ marginBottom:"24px" }}>
          <h1 style={{ margin:"0 0 4px", fontSize:"22px", fontWeight:800, color:"#1e293b" }}>User Management</h1>
          <p style={{ margin:0, fontSize:"13px", color:"#64748b" }}>Manage access, roles and client assignments</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"24px" }}>
          {stats.map(s => (
            <div key={s.label} style={{ backgroundColor:"#fff", borderRadius:"16px", border:"1px solid #e2e8f0", padding:"20px" }}>
              <p style={{ margin:"0 0 4px", fontSize:"24px", fontWeight:800, color:"#1e293b" }}>{s.value}</p>
              <p style={{ margin:0, fontSize:"12px", color:"#64748b" }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
          <input placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ flex:1, padding:"8px 14px", borderRadius:"12px", border:"1px solid #e2e8f0", fontSize:"13px", outline:"none" }}/>
          <select value={filterRole} onChange={e=>setFilterRole(e.target.value)}
            style={{ padding:"8px 14px", borderRadius:"12px", border:"1px solid #e2e8f0", fontSize:"13px", cursor:"pointer" }}>
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="account_manager">Account Manager</option>
            <option value="client">Client</option>
          </select>
          <button onClick={openCreate} style={{ padding:"8px 20px", borderRadius:"12px", backgroundColor:BRAND, color:"#fff", border:"none", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>+ Invite User</button>
        </div>
        <div style={{ backgroundColor:"#fff", borderRadius:"20px", border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ backgroundColor:"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                {["User","Role","Assigned Clients","Status","Actions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u,i) => (
                <tr key={u.id} style={{ borderBottom:i<filtered.length-1?"1px solid #f1f5f9":"none" }}>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ width:"34px", height:"34px", borderRadius:"10px", backgroundColor:BRAND, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"13px", flexShrink:0 }}>{u.name[0]}</div>
                      <div>
                        <p style={{ margin:0, fontWeight:700, color:"#1e293b" }}>{u.name}</p>
                        <p style={{ margin:0, color:"#94a3b8", fontSize:"12px" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:"999px", fontSize:"11px", fontWeight:700, backgroundColor:ROLE_COLORS[u.role].bg, color:ROLE_COLORS[u.role].text }}>{ROLE_COLORS[u.role].label}</span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
                      {u.role==="super_admin" ? <span style={{ fontSize:"11px", color:"#94a3b8", fontStyle:"italic" }}>All clients</span>
                        : u.clients.map(c => <span key={c} style={{ padding:"2px 8px", borderRadius:"6px", fontSize:"11px", fontWeight:600, backgroundColor:"#f1f5f9", color:"#475569" }}>{c}</span>)}
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:"999px", fontSize:"11px", fontWeight:700,
                      backgroundColor:u.status==="active"?"#f0fdf4":u.status==="pending"?"#fff7ed":"#fef2f2",
                      color:u.status==="active"?"#16a34a":u.status==="pending"?"#d97706":"#dc2626" }}>
                      {u.status.charAt(0).toUpperCase()+u.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={()=>openEdit(u)} style={{ padding:"5px 12px", borderRadius:"8px", border:`1px solid ${BRAND}`, backgroundColor:BRAND_LIGHT, color:BRAND, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Edit</button>
                      <button onClick={()=>toggleStatus(u.id)} style={{ padding:"5px 12px", borderRadius:"8px", border:"1px solid #e2e8f0", backgroundColor:"#f8fafc", color:"#64748b", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>{u.status==="active"?"Suspend":"Activate"}</button>
                      {u.role!=="super_admin" && <button onClick={()=>handleDelete(u.id)} style={{ padding:"5px 12px", borderRadius:"8px", border:"1px solid #fee2e2", backgroundColor:"#fef2f2", color:"#dc2626", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>Remove</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      {showModal && (
        <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:"16px" }}>
          <div style={{ backgroundColor:"#fff", borderRadius:"24px", padding:"28px", width:"100%", maxWidth:"480px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h2 style={{ margin:0, fontSize:"18px", fontWeight:800, color:"#1e293b" }}>{editUser?"Edit User":"Invite New User"}</h2>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#94a3b8" }}>×</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {[{label:"Full Name",key:"name",type:"text",ph:"Kerry Ballard"},{label:"Email",key:"email",type:"email",ph:"kerry@propellic.com"}].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"6px" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(fm=>({...fm,[f.key]:e.target.value}))}
                    style={{ width:"100%", padding:"10px 14px", borderRadius:"12px", border:"1px solid #e2e8f0", fontSize:"13px", outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"6px" }}>Role</label>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[["account_manager","Account Manager"],["client","Client"]].map(([val,lbl]) => (
                    <button key={val} onClick={()=>setForm(f=>({...f,role:val}))}
                      style={{ flex:1, padding:"10px", borderRadius:"12px", border:`1px solid ${form.role===val?BRAND:"#e2e8f0"}`, backgroundColor:form.role===val?BRAND_LIGHT:"#f8fafc", color:form.role===val?BRAND:"#64748b", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"6px" }}>Assign Clients</label>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {CLIENTS.map(c => (
                    <label key={c} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", borderRadius:"12px", border:`1px solid ${form.clients.includes(c)?BRAND:"#e2e8f0"}`, backgroundColor:form.clients.includes(c)?BRAND_LIGHT:"#f8fafc", cursor:"pointer" }}>
                      <input type="checkbox" checked={form.clients.includes(c)} onChange={()=>toggleClient(c)} style={{ accentColor:BRAND }}/>
                      <span style={{ fontSize:"13px", fontWeight:600, color:form.clients.includes(c)?BRAND:"#475569" }}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} style={{ padding:"12px", borderRadius:"12px", backgroundColor:saved?"#10b981":BRAND, color:"#fff", border:"none", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
                {saved?"✓ Saved!":editUser?"Save Changes":"Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
