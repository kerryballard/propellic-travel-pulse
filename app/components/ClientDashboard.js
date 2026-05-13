"use client";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Target, ArrowUpRight, ArrowDownRight, Link2, CheckCircle, Eye, EyeOff, MapPin, Search, TrendingUp, TrendingDown, Info } from "lucide-react";

const BRAND       = "#E21A6B";
const BRAND_LIGHT = "#fce7f0";
const BRAND_DARK  = "#b51555";

// ── Per-platform campaign historical data ─────────────────────────
const PLATFORM_CAMPAIGNS = {
  "Google Ads": {
    color:"#4285F4", icon:"G",
    campaigns: {
      "Search":   { monthly:[
        { month:"Jan", spend:3100, clicks:2500, bookings:52, revenue:18200 },
        { month:"Feb", spend:3600, clicks:3000, bookings:61, revenue:21400 },
        { month:"Mar", spend:4600, clicks:3833, bookings:78, revenue:27300 },
        { month:"Apr", spend:5400, clicks:4500, bookings:91, revenue:31900 },
        { month:"May", spend:4900, clicks:4083, bookings:82, revenue:28700 },
        { month:"Jun", spend:5200, clicks:4333, bookings:88, revenue:30800 },
      ]},
      "Shopping": { monthly:[
        { month:"Jan", spend:1200, clicks:960,  bookings:16, revenue:5600  },
        { month:"Feb", spend:1400, clicks:1120, bookings:19, revenue:6700  },
        { month:"Mar", spend:1800, clicks:1440, bookings:24, revenue:8400  },
        { month:"Apr", spend:2100, clicks:1680, bookings:28, revenue:9800  },
        { month:"May", spend:1900, clicks:1520, bookings:25, revenue:8800  },
        { month:"Jun", spend:2800, clicks:2240, bookings:31, revenue:10900 },
      ]},
      "Display":  { monthly:[
        { month:"Jan", spend:600,  clicks:480,  bookings:7,  revenue:2450  },
        { month:"Feb", spend:700,  clicks:560,  bookings:8,  revenue:2800  },
        { month:"Mar", spend:900,  clicks:720,  bookings:10, revenue:3500  },
        { month:"Apr", spend:1100, clicks:880,  bookings:12, revenue:4200  },
        { month:"May", spend:1000, clicks:800,  bookings:11, revenue:3850  },
        { month:"Jun", spend:1200, clicks:960,  bookings:12, revenue:4200  },
      ]},
      "Video":    { monthly:[
        { month:"Jan", spend:300,  clicks:240,  bookings:3,  revenue:1050  },
        { month:"Feb", spend:400,  clicks:320,  bookings:3,  revenue:1050  },
        { month:"Mar", spend:500,  clicks:400,  bookings:6,  revenue:2100  },
        { month:"Apr", spend:600,  clicks:480,  bookings:7,  revenue:2450  },
        { month:"May", spend:600,  clicks:480,  bookings:5,  revenue:1750  },
        { month:"Jun", spend:600,  clicks:480,  bookings:7,  revenue:2450  },
      ]},
    },
  },
  "Meta": {
    color:"#1877F2", icon:"f",
    campaigns: {
      "Feed / Display": { monthly:[
        { month:"Jan", spend:2200, clicks:1833, bookings:29, revenue:10150 },
        { month:"Feb", spend:2500, clicks:2083, bookings:33, revenue:11550 },
        { month:"Mar", spend:3200, clicks:2667, bookings:42, revenue:14700 },
        { month:"Apr", spend:3800, clicks:3167, bookings:50, revenue:17500 },
        { month:"May", spend:3400, clicks:2833, bookings:45, revenue:15750 },
        { month:"Jun", spend:3900, clicks:3250, bookings:51, revenue:17850 },
      ]},
      "Video / Reels":  { monthly:[
        { month:"Jan", spend:1000, clicks:833,  bookings:11, revenue:3850  },
        { month:"Feb", spend:1100, clicks:917,  bookings:12, revenue:4200  },
        { month:"Mar", spend:1500, clicks:1250, bookings:16, revenue:5600  },
        { month:"Apr", spend:1800, clicks:1500, bookings:19, revenue:6650  },
        { month:"May", spend:1600, clicks:1333, bookings:17, revenue:5950  },
        { month:"Jun", spend:2200, clicks:1833, bookings:25, revenue:8750  },
      ]},
      "Shopping":       { monthly:[
        { month:"Jan", spend:600,  clicks:500,  bookings:7,  revenue:2450  },
        { month:"Feb", spend:600,  clicks:500,  bookings:6,  revenue:2100  },
        { month:"Mar", spend:900,  clicks:750,  bookings:10, revenue:3500  },
        { month:"Apr", spend:1100, clicks:917,  bookings:12, revenue:4200  },
        { month:"May", spend:800,  clicks:667,  bookings:9,  revenue:3150  },
        { month:"Jun", spend:1100, clicks:917,  bookings:18, revenue:6300  },
      ]},
    },
  },
  "TikTok": {
    color:"#010101", icon:"T",
    campaigns: {
      "In-Feed Video": { monthly:[
        { month:"Jan", spend:1100, clicks:917,  bookings:10, revenue:3500  },
        { month:"Feb", spend:1200, clicks:1000, bookings:11, revenue:3850  },
        { month:"Mar", spend:1500, clicks:1250, bookings:14, revenue:4900  },
        { month:"Apr", spend:1800, clicks:1500, bookings:16, revenue:5600  },
        { month:"May", spend:1600, clicks:1333, bookings:15, revenue:5250  },
        { month:"Jun", spend:1800, clicks:1500, bookings:18, revenue:6300  },
      ]},
      "TopView":       { monthly:[
        { month:"Jan", spend:700,  clicks:583,  bookings:6,  revenue:2100  },
        { month:"Feb", spend:800,  clicks:667,  bookings:7,  revenue:2450  },
        { month:"Mar", spend:1000, clicks:833,  bookings:9,  revenue:3150  },
        { month:"Apr", spend:1200, clicks:1000, bookings:11, revenue:3850  },
        { month:"May", spend:1100, clicks:917,  bookings:10, revenue:3500  },
        { month:"Jun", spend:1300, clicks:1083, bookings:12, revenue:4200  },
      ]},
      "Search Ads":    { monthly:[
        { month:"Jan", spend:300,  clicks:250,  bookings:3,  revenue:1050  },
        { month:"Feb", spend:400,  clicks:333,  bookings:4,  revenue:1400  },
        { month:"Mar", spend:500,  clicks:417,  bookings:5,  revenue:1750  },
        { month:"Apr", spend:600,  clicks:500,  bookings:6,  revenue:2100  },
        { month:"May", spend:500,  clicks:417,  bookings:5,  revenue:1750  },
        { month:"Jun", spend:600,  clicks:500,  bookings:6,  revenue:2100  },
      ]},
    },
  },
  "Microsoft": {
    color:"#00A4EF", icon:"M",
    campaigns: {
      "Search":   { monthly:[
        { month:"Jan", spend:1900, clicks:1517, bookings:18, revenue:6300  },
        { month:"Feb", spend:2100, clicks:1750, bookings:21, revenue:7350  },
        { month:"Mar", spend:2700, clicks:2250, bookings:27, revenue:9450  },
        { month:"Apr", spend:3200, clicks:2667, bookings:32, revenue:11200 },
        { month:"May", spend:2900, clicks:2417, bookings:29, revenue:10150 },
        { month:"Jun", spend:3100, clicks:2583, bookings:29, revenue:10150 },
      ]},
      "Shopping": { monthly:[
        { month:"Jan", spend:500,  clicks:400,  bookings:5,  revenue:1750  },
        { month:"Feb", spend:600,  clicks:500,  bookings:6,  revenue:2100  },
        { month:"Mar", spend:800,  clicks:667,  bookings:8,  revenue:2800  },
        { month:"Apr", spend:900,  clicks:750,  bookings:9,  revenue:3150  },
        { month:"May", spend:800,  clicks:667,  bookings:8,  revenue:2800  },
        { month:"Jun", spend:700,  clicks:583,  bookings:7,  revenue:2450  },
      ]},
      "Display":  { monthly:[
        { month:"Jan", spend:300,  clicks:240,  bookings:3,  revenue:1050  },
        { month:"Feb", spend:300,  clicks:240,  bookings:3,  revenue:1050  },
        { month:"Mar", spend:400,  clicks:333,  bookings:4,  revenue:1400  },
        { month:"Apr", spend:500,  clicks:417,  bookings:5,  revenue:1750  },
        { month:"May", spend:400,  clicks:333,  bookings:4,  revenue:1400  },
        { month:"Jun", spend:400,  clicks:333,  bookings:3,  revenue:1050  },
      ]},
    },
  },
};

const YOY_DATA = [
  { month:"Jan",  spend24:34864, spend25:39143, cpc24:1.42,cpc25:1.28, cvr24:2.8,cvr25:3.1,  conv24:118, conv25:143, rev24:502000,  rev25:552300  },
  { month:"Feb",  spend24:35269, spend25:37570, cpc24:1.38,cpc25:1.21, cvr24:2.9,cvr25:3.4,  conv24:134, conv25:167, rev24:529437,  rev25:618000  },
  { month:"Mar",  spend24:41064, spend25:36251, cpc24:1.45,cpc25:1.19, cvr24:3.1,cvr25:3.6,  conv24:189, conv25:218, rev24:591984,  rev25:832000  },
  { month:"Apr",  spend24:38213, spend25:36763, cpc24:1.41,cpc25:1.22, cvr24:3.0,cvr25:3.8,  conv24:201, conv25:261, rev24:516650,  rev25:984000  },
  { month:"May",  spend24:40583, spend25:39037, cpc24:1.39,cpc25:1.18, cvr24:3.2,cvr25:3.9,  conv24:218, conv25:239, rev24:549825,  rev25:891000  },
  { month:"Jun",  spend24:35785, spend25:36926, cpc24:1.35,cpc25:1.15, cvr24:3.3,cvr25:4.1,  conv24:241, conv25:312, rev24:540212,  rev25:1186000 },
  { month:"Jul",  spend24:38193, spend25:null,  cpc24:1.33,cpc25:null, cvr24:3.4,cvr25:null, conv24:258, conv25:null,rev24:506388,  rev25:null    },
  { month:"Aug",  spend24:37640, spend25:null,  cpc24:1.31,cpc25:null, cvr24:3.5,cvr25:null, conv24:274, conv25:null,rev24:624764,  rev25:null    },
  { month:"Sep",  spend24:36930, spend25:null,  cpc24:1.29,cpc25:null, cvr24:3.4,cvr25:null, conv24:261, conv25:null,rev24:600929,  rev25:null    },
  { month:"Oct",  spend24:30328, spend25:null,  cpc24:1.27,cpc25:null, cvr24:3.3,cvr25:null, conv24:null,conv25:null,rev24:null,    rev25:null    },
  { month:"Nov",  spend24:38138, spend25:null,  cpc24:1.25,cpc25:null, cvr24:3.2,cvr25:null, conv24:null,conv25:null,rev24:null,    rev25:null    },
  { month:"Dec",  spend24:39917, spend25:null,  cpc24:1.22,cpc25:null, cvr24:3.1,cvr25:null, conv24:null,conv25:null,rev24:null,    rev25:null    },
  { month:"YTD",  spend24:224707,spend25:225690,cpc24:1.38,cpc25:1.21,cvr24:3.05,cvr25:3.65,conv24:1161,conv25:1340,rev24:3341016,rev25:5063300, isYtd:true  },
  { month:"Total",spend24:454853,spend25:null,  cpc24:1.34,cpc25:null, cvr24:3.2,cvr25:null, conv24:null,conv25:null,rev24:6897410,rev25:null,    isTotal:true},
];

const KEYWORDS  = [
  { keyword:"maldives resort all inclusive",  conv:48, cpa:68.4, cvr:6.2, trend:"up"   },
  { keyword:"luxury beach vacation packages", conv:37, cpa:74.1, cvr:5.8, trend:"up"   },
  { keyword:"best overwater bungalows",       conv:29, cpa:79.3, cvr:5.1, trend:"up"   },
  { keyword:"maldives travel deals 2025",     conv:24, cpa:82.0, cvr:4.7, trend:"flat" },
  { keyword:"private island resort booking",  conv:21, cpa:88.6, cvr:4.3, trend:"down" },
  { keyword:"honeymoon packages maldives",    conv:19, cpa:91.2, cvr:4.1, trend:"up"   },
];

const LOCATIONS = [
  { city:"New York, NY",    bookings:68, revenue:82400, roas:5.4 },
  { city:"Los Angeles, CA", bookings:54, revenue:67800, roas:5.1 },
  { city:"London, UK",      bookings:41, revenue:53200, roas:4.9 },
  { city:"Chicago, IL",     bookings:38, revenue:46100, roas:4.7 },
  { city:"Sydney, AU",      bookings:31, revenue:39800, roas:4.5 },
  { city:"Toronto, CA",     bookings:27, revenue:33600, roas:4.3 },
];

const TREND_METRICS = [
  { key:"roas", label:"ROAS",        color:BRAND,     fmt:v=>`${v.toFixed(2)}x`            },
  { key:"cpa",  label:"CPA",         color:"#f97316", fmt:v=>`$${v.toFixed(2)}`             },
  { key:"cpc",  label:"CPC",         color:"#8b5cf6", fmt:v=>`$${v.toFixed(2)}`             },
  { key:"cvr",  label:"CVR",         color:"#06b6d4", fmt:v=>`${v.toFixed(1)}%`             },
  { key:"impressions",label:"Impressions",color:"#64748b",fmt:v=>`${(v/1000).toFixed(0)}K` },
  { key:"clicks",     label:"Clicks",     color:"#10b981",fmt:v=>v.toLocaleString()         },
  { key:"ctr",        label:"CTR",        color:"#f59e0b",fmt:v=>`${v.toFixed(2)}%`         },
  { key:"sis",        label:"Imp. Share", color:"#ec4899",fmt:v=>`${v}%`                    },
];

// ── Helpers ───────────────────────────────────────────────────────
function trailingAvg(monthly, key, months) {
  const slice = monthly.slice(-months);
  const vals  = slice.map(d=>d[key]).filter(v=>v!=null&&v>0);
  return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
}
function derived(monthly) {
  return monthly.map(d => ({
    ...d,
    cpc:  d.clicks  >0 ? parseFloat((d.spend   /d.clicks  ).toFixed(2)) : 0,
    cvr:  d.clicks  >0 ? parseFloat((d.bookings/d.clicks*100).toFixed(2)) : 0,
    cpa:  d.bookings>0 ? parseFloat((d.spend   /d.bookings).toFixed(2)) : 0,
    roas: d.spend   >0 ? parseFloat((d.revenue /d.spend   ).toFixed(2)) : 0,
    abv:  d.bookings>0 ? parseFloat((d.revenue /d.bookings).toFixed(2)) : 0,
  }));
}
function pct(a,b) { if(!a||!b) return null; return (((b-a)/a)*100).toFixed(0); }
function fmtUSD(v){ return v?`$${(v/1000).toFixed(0)}K`:"—"; }
function fmtNum(v){ return v!=null?v.toLocaleString():"—"; }

// ── Small components ──────────────────────────────────────────────
function PlatformCard({ name, icon, connected, color }) {
  const [conn,setConn]=useState(connected);
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${conn?"border-emerald-200 bg-emerald-50":"border-slate-200 bg-white"}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor:color}}>{icon}</div>
        <span className="text-sm font-medium text-slate-700">{name}</span>
      </div>
      {conn ? <CheckCircle size={16} className="text-emerald-500"/>
        : <button onClick={()=>setConn(true)} className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg" style={{backgroundColor:BRAND_LIGHT,color:BRAND}}>
            <Link2 size={11}/> Connect
          </button>}
    </div>
  );
}

function Pill({ label, active, onClick, color, dark }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
      style={active
        ? { backgroundColor:color||BRAND, color:"#fff", borderColor:color||BRAND }
        : { backgroundColor: dark?"#374151":"#fff", color: dark?"#9ca3af":"#64748b", borderColor: dark?"#4b5563":"#e2e8f0" }}>
      {active?<Eye size={11}/>:<EyeOff size={11}/>}{label}
    </button>
  );
}

function SparkCard({ subtitle, data, dataKey, color, formatter, dark }) {
  const vals   = data.filter(d=>d[dataKey]!=null&&d[dataKey]>0);
  const latest = vals.slice(-1)[0]?.[dataKey];
  const prev   = vals.slice(-2)[0]?.[dataKey];
  const change = latest&&prev?(((latest-prev)/prev)*100).toFixed(1):null;
  const up     = change>0;
  const surface= dark?"bg-gray-800 border-gray-700":"bg-white border-slate-100";
  const text   = dark?"text-white":"text-slate-800";
  const sub    = dark?"text-gray-400":"text-slate-400";
  return (
    <div className={`rounded-2xl border shadow-sm p-4 ${surface}`}>
      <div className="flex items-start justify-between mb-1">
        <p className={`text-xs font-medium uppercase tracking-wide ${sub}`}>{subtitle}</p>
        {change&&<span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${up?"bg-emerald-50 text-emerald-600":"bg-red-50 text-red-500"}`}>
          {up?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}{Math.abs(change)}%
        </span>}
      </div>
      <p className={`text-lg font-bold ${text}`}>{latest?formatter(latest):"—"}</p>
      <p className={`text-xs mb-2 ${sub}`}>Last 6 months</p>
      <ResponsiveContainer width="100%" height={55}>
        <LineChart data={data}>
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false}/>
          <Tooltip contentStyle={{ borderRadius:"8px", border:"1px solid #e2e8f0", fontSize:10, backgroundColor:dark?"#1f2937":"#fff" }} formatter={v=>[formatter(v),subtitle]}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Simplified Projection Calculator ─────────────────────────────
// User only toggles Spend — Revenue and Conversions auto-calculate
// from the client's actual trailing CPC, CVR, ABV
function CampaignProjectionRow({ platform, platformColor, campaignName, monthly, windowMonths, dark }) {
  const data    = derived(monthly);
  const baseCpc = trailingAvg(data,"cpc",windowMonths);
  const baseCvr = trailingAvg(data,"cvr",windowMonths);
  const baseAbv = trailingAvg(data,"abv",windowMonths);
  const defaultSpend = Math.round(trailingAvg(data,"spend",windowMonths));

  const [spend, setSpend] = useState(defaultSpend);

  const projClicks   = baseCpc>0 ? Math.round(spend/baseCpc) : 0;
  const projBookings = Math.round(projClicks*(baseCvr/100));
  const projRevenue  = Math.round(projBookings*baseAbv);
  const projRoas     = spend>0 ? (projRevenue/spend).toFixed(2) : "—";
  const projCpa      = projBookings>0 ? (spend/projBookings).toFixed(2) : "—";

  const surface = dark?"bg-gray-800":"bg-white";
  const text    = dark?"text-white":"text-slate-800";
  const sub     = dark?"text-gray-400":"text-slate-400";
  const inputBg = dark?"bg-gray-700 border-gray-600 text-white":"bg-slate-50 border-slate-200 text-slate-800";

  return (
    <div className={`border-b ${dark?"border-gray-700":"border-slate-100"} last:border-0`}>
      <div className={`grid grid-cols-12 gap-2 items-center px-4 py-3 transition-colors ${dark?"hover:bg-gray-700":"hover:bg-slate-50"}`}>
        {/* Platform + campaign */}
        <div className="col-span-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor:platformColor}}/>
          <div>
            <p className={`text-xs font-semibold ${text}`}>{campaignName}</p>
            <p className={`text-xs ${sub}`}>{platform}</p>
          </div>
        </div>

        {/* Spend — editable */}
        <div className="col-span-2">
          <div className={`flex items-center gap-1 border rounded-lg px-2 py-1.5 ${inputBg}`}>
            <span className={`text-xs ${sub}`}>$</span>
            <input type="number" value={spend}
              onChange={e=>setSpend(Math.max(0,Number(e.target.value)))}
              className="w-full text-xs font-semibold bg-transparent outline-none" step={500}/>
          </div>
        </div>

        {/* Auto-calculated outputs */}
        {[
          { label:"Clicks",   value:projClicks.toLocaleString() },
          { label:"Bookings", value:projBookings                },
          { label:"Revenue",  value:`$${projRevenue.toLocaleString()}`, accent:true },
          { label:"ROAS",     value:`${projRoas}x`,             accent:true },
          { label:"CPA",      value:`$${projCpa}`,              warn: projCpa!=="—" && parseFloat(projCpa)>90 },
        ].map((c,i) => (
          <div key={i} className="col-span-1 text-center">
            <p className={`text-xs font-semibold ${c.accent?"":"text-opacity-100"}`}
              style={c.accent ? {color:BRAND} : c.warn ? {color:"#f97316"} : {color: dark?"#e5e7eb":"#334155"}}>
              {c.value}
            </p>
            <p className={`text-xs ${sub}`}>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectionCalculator({ dark }) {
  const [windowMonths, setWindowMonths] = useState(3);
  const [view,         setView]         = useState("table");

  const surface = dark?"bg-gray-800 border-gray-700":"bg-white border-slate-100";
  const text    = dark?"text-white":"text-slate-800";
  const sub     = dark?"text-gray-400":"text-slate-400";
  const headBg  = dark?"bg-gray-700":"bg-slate-50";

  // Totals for summary row
  const allRows = [];
  Object.entries(PLATFORM_CAMPAIGNS).forEach(([platform,pData]) =>
    Object.entries(pData.campaigns).forEach(([campaign,cData]) => {
      const data     = derived(cData.monthly);
      const spend    = Math.round(trailingAvg(data,"spend",windowMonths));
      const cpc      = trailingAvg(data,"cpc",windowMonths);
      const cvr      = trailingAvg(data,"cvr",windowMonths);
      const abv      = trailingAvg(data,"abv",windowMonths);
      const clicks   = cpc>0?Math.round(spend/cpc):0;
      const bookings = Math.round(clicks*(cvr/100));
      const revenue  = Math.round(bookings*abv);
      allRows.push({ platform, campaign, spend, clicks, bookings, revenue, color:pData.color });
    })
  );
  const totals = allRows.reduce((a,r)=>({
    spend:a.spend+r.spend, clicks:a.clicks+r.clicks,
    bookings:a.bookings+r.bookings, revenue:a.revenue+r.revenue,
  }),{spend:0,clicks:0,bookings:0,revenue:0});
  totals.roas    = totals.spend>0?(totals.revenue/totals.spend).toFixed(2):"—";
  totals.cpa     = totals.bookings>0?(totals.spend/totals.bookings).toFixed(2):"—";

  const chartData = Object.entries(PLATFORM_CAMPAIGNS).map(([platform,pData])=>{
    const rows    = allRows.filter(r=>r.platform===platform);
    const spend   = rows.reduce((a,r)=>a+r.spend,0);
    const revenue = rows.reduce((a,r)=>a+r.revenue,0);
    const bookings= rows.reduce((a,r)=>a+r.bookings,0);
    return { platform, spend, revenue, bookings, roas:spend>0?parseFloat((revenue/spend).toFixed(2)):0 };
  });

  return (
    <div className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:BRAND_LIGHT}}>
            <Target size={16} style={{color:BRAND}}/>
          </div>
          <div>
            <h2 className={`text-base font-semibold ${text}`}>Projection Calculator</h2>
            <p className={`text-xs ${sub}`}>Adjust spend per campaign — revenue & bookings auto-calculate from actuals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-full p-0.5">
            {[1,2,3,6].map(w=>(
              <button key={w} onClick={()=>setWindowMonths(w)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={windowMonths===w?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>
                {w}mo
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 rounded-full p-0.5">
            {["table","chart"].map(v=>(
              <button key={v} onClick={()=>setView(v)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize"
                style={view===v?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className={`text-xs mb-5 flex items-center gap-1 ${sub}`}>
        <Info size={11}/> Edit the Spend column per campaign. Revenue, Bookings, ROAS and CPA update automatically using trailing {windowMonths}-month CPC &amp; CVR from this client's actual data.
      </p>

      {view==="table" ? (
        <>
          {/* Header */}
          <div className={`grid grid-cols-12 gap-2 px-4 py-2 rounded-xl mb-2 text-xs font-semibold uppercase tracking-wide ${dark?"text-gray-400":"text-slate-500"} ${headBg}`}>
            <div className="col-span-3">Platform / Campaign</div>
            <div className="col-span-2">Spend ✏️</div>
            <div className="col-span-1 text-center">Clicks</div>
            <div className="col-span-1 text-center">Bookings</div>
            <div className="col-span-1 text-center">Revenue</div>
            <div className="col-span-1 text-center">ROAS</div>
            <div className="col-span-1 text-center">CPA</div>
            <div className="col-span-2"/>
          </div>

          {/* Rows by platform */}
          <div className={`rounded-2xl border overflow-hidden ${dark?"border-gray-700":"border-slate-100"}`}>
            {Object.entries(PLATFORM_CAMPAIGNS).map(([platform,pData])=>(
              <div key={platform}>
                <div className="px-4 py-2 flex items-center gap-2" style={{backgroundColor:`${pData.color}18`}}>
                  <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor:pData.color}}>{pData.icon}</div>
                  <span className={`text-xs font-bold ${text}`}>{platform}</span>
                </div>
                {Object.entries(pData.campaigns).map(([campaign,cData])=>(
                  <CampaignProjectionRow key={`${platform}-${campaign}`}
                    platform={platform} platformColor={pData.color}
                    campaignName={campaign} monthly={cData.monthly}
                    windowMonths={windowMonths} dark={dark}/>
                ))}
              </div>
            ))}

            {/* Totals */}
            <div className={`grid grid-cols-12 gap-2 items-center px-4 py-4 border-t-2 ${dark?"border-gray-600":"border-slate-200"}`}
              style={{backgroundColor:BRAND_LIGHT}}>
              <div className="col-span-3"><p className="text-xs font-bold text-slate-800">TOTAL — All Platforms</p></div>
              <div className="col-span-2"><p className="text-sm font-bold text-slate-800">${totals.spend.toLocaleString()}</p></div>
              <div className="col-span-1 text-center"><p className="text-xs font-bold text-slate-800">{totals.clicks.toLocaleString()}</p></div>
              <div className="col-span-1 text-center"><p className="text-xs font-bold text-slate-800">{totals.bookings.toLocaleString()}</p></div>
              <div className="col-span-1 text-center"><p className="text-sm font-bold" style={{color:BRAND}}>${totals.revenue.toLocaleString()}</p></div>
              <div className="col-span-1 text-center"><p className="text-sm font-bold" style={{color:BRAND}}>{totals.roas}x</p></div>
              <div className="col-span-1 text-center"><p className="text-xs font-semibold text-slate-600">${totals.cpa}</p></div>
              <div className="col-span-2"/>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title:"Projected Revenue", key:"revenue", fmt:v=>`$${(v/1000).toFixed(0)}k` },
            { title:"Projected ROAS",    key:"roas",    fmt:v=>`${v}x`, domain:[0,7]       },
          ].map(c=>(
            <div key={c.key}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>{c.title}</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"} vertical={false}/>
                  <XAxis dataKey="platform" tick={{fontSize:10,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false}
                    tickFormatter={c.fmt} domain={c.domain}/>
                  <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e2e8f0",fontSize:11,backgroundColor:dark?"#1f2937":"#fff"}}
                    formatter={v=>[c.key==="revenue"?`$${v.toLocaleString()}`:`${v}x`,c.title]}/>
                  <Bar dataKey={c.key} fill={BRAND} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
          <div className="md:col-span-2">
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>Spend vs Projected Revenue — All Platforms</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"} vertical={false}/>
                <XAxis dataKey="platform" tick={{fontSize:10,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e2e8f0",fontSize:11,backgroundColor:dark?"#1f2937":"#fff"}} formatter={v=>[`$${v.toLocaleString()}`]}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="spend"   name="Spend"   fill={dark?"#374151":"#e2e8f0"} radius={[4,4,0,0]}/>
                <Bar dataKey="revenue" name="Revenue" fill={BRAND} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function ClientDashboard({ client, dark=false }) {
  const [revenueMode,    setRevenueMode]    = useState(true);
  const [showRevenue,    setShowRevenue]    = useState(true);
  const [activePlatform, setActivePlatform] = useState("Google Ads");
  const [platformMetric, setPlatformMetric] = useState("spend");
  const [metrics, setMetrics] = useState({ roas:true,cpa:true,cpc:false,cvr:false,impressions:false,clicks:false,ctr:false,sis:false });

  const toggleMetric = k => setMetrics(m=>({...m,[k]:!m[k]}));
  const activeMetrics = TREND_METRICS.filter(m=>metrics[m.key]);

  const surface  = dark?"bg-gray-800 border-gray-700":"bg-white border-slate-100";
  const text     = dark?"text-white":"text-slate-800";
  const sub      = dark?"text-gray-400":"text-slate-400";
  const gridBg   = dark?"bg-gray-700":"bg-slate-50";

  // Blended monthly for charts
  const MONTHLY = derived(
    PLATFORM_CAMPAIGNS["Google Ads"].campaigns["Search"].monthly.map((d,i)=>{
      let spend=0,clicks=0,bookings=0,revenue=0;
      Object.values(PLATFORM_CAMPAIGNS).forEach(p=>Object.values(p.campaigns).forEach(c=>{
        spend+=c.monthly[i]?.spend||0; clicks+=c.monthly[i]?.clicks||0;
        bookings+=c.monthly[i]?.bookings||0; revenue+=c.monthly[i]?.revenue||0;
      }));
      return {month:d.month,spend,clicks,bookings,revenue,impressions:0,ctr:0,sis:0};
    })
  );

  const platData    = PLATFORM_CAMPAIGNS[activePlatform];
  const metricLabels= {spend:"Spend",roas:"ROAS",conv:"Bookings",cpa:"CPA"};
  const metricFmts  = {spend:v=>`$${v.toLocaleString()}`,roas:v=>`${typeof v==="number"?v.toFixed(1):v}x`,conv:v=>v,cpa:v=>`$${typeof v==="number"?v.toFixed(1):v}`};
  const platTotal   = Object.values(platData.campaigns).reduce((acc,c)=>{
    const l=c.monthly[c.monthly.length-1];
    return {spend:acc.spend+l.spend,bookings:acc.bookings+l.bookings,revenue:acc.revenue+l.revenue};
  },{spend:0,bookings:0,revenue:0});
  platTotal.roas = platTotal.spend>0?(platTotal.revenue/platTotal.spend).toFixed(1):0;
  platTotal.cpa  = platTotal.bookings>0?(platTotal.spend/platTotal.bookings).toFixed(1):0;

  return (
    <div className="space-y-6">

      {/* Platform connections */}
      <div className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-semibold ${text}`}>Platform Connections</h2>
            <p className={`text-xs mt-0.5 ${sub}`}>Connect ad platforms to pull live data</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-semibold bg-amber-50 text-amber-600">Phase 2: Live API</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <PlatformCard name="Google Ads" icon="G" connected={true}  color="#4285F4"/>
          <PlatformCard name="Meta Ads"   icon="f" connected={true}  color="#1877F2"/>
          <PlatformCard name="TikTok"     icon="T" connected={false} color="#010101"/>
          <PlatformCard name="Microsoft"  icon="M" connected={false} color="#00A4EF"/>
        </div>
      </div>

      {/* KPI row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-base font-semibold ${text}`}>Performance Overview</h2>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowRevenue(!showRevenue)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={showRevenue?{backgroundColor:BRAND_LIGHT,color:BRAND,borderColor:BRAND}:{backgroundColor:dark?"#374151":"#fff",color:"#94a3b8",borderColor:dark?"#4b5563":"#e2e8f0"}}>
              {showRevenue?<Eye size={11}/>:<EyeOff size={11}/>} Revenue
            </button>
            <div className="flex items-center bg-slate-100 rounded-full p-0.5">
              <button onClick={()=>setRevenueMode(true)}  className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={revenueMode ?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>Revenue</button>
              <button onClick={()=>setRevenueMode(false)} className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={!revenueMode?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>Bookings</button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:"Ad Spend",    value:"$25,300",  change:"12.4",up:false,show:true},
            {label:"Revenue",     value:"$118,600", change:"18.7",up:true, show:showRevenue},
            {label:"Blended ROAS",value:"4.69x",    change:"4.2", up:true, show:true},
            {label:revenueMode?"Bookings":"Conv.",value:"312",change:"9.1",up:true,show:true},
          ].filter(k=>k.show).map((k,i)=>(
            <div key={i} className={`rounded-2xl border shadow-sm p-4 ${surface}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${sub}`}>{k.label}</span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${k.up?"bg-emerald-50 text-emerald-600":"bg-red-50 text-red-500"}`}>
                  {k.up?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>}{k.change}%
                </span>
              </div>
              <p className={`text-xl font-bold ${text}`}>{k.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROAS + CPA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {title:"ROAS Trend",sub:"Return on ad spend",key:"roas",color:BRAND,    fmt:v=>`${v}x`,domain:[3.5,5.5],latest:"4.69x",lc:BRAND    },
          {title:"CPA Trend", sub:"Cost per booking",  key:"cpa", color:"#f97316",fmt:v=>`$${v}`,domain:[75,95],  latest:"$81.10",lc:"#f97316"},
        ].map(c=>(
          <div key={c.key} className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
            <div className="flex items-center justify-between mb-4">
              <div><h2 className={`text-base font-semibold ${text}`}>{c.title}</h2><p className={`text-xs ${sub}`}>{c.sub}</p></div>
              <span className="text-lg font-bold" style={{color:c.lc}}>{c.latest}</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false} domain={c.domain}/>
                <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e2e8f0",fontSize:12,backgroundColor:dark?"#1f2937":"#fff"}} formatter={v=>[c.fmt(v),c.title]}/>
                <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={2.5} dot={{fill:c.color,r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Revenue/Bookings bar */}
      <div className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-semibold ${text}`}>{revenueMode?"Revenue":"Bookings"} Trend</h2>
            <p className={`text-xs ${sub}`}>Monthly performance</p>
          </div>
          <div className="flex items-center bg-slate-100 rounded-full p-0.5">
            <button onClick={()=>setRevenueMode(true)}  className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={revenueMode ?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>Revenue</button>
            <button onClick={()=>setRevenueMode(false)} className="px-3 py-1 rounded-full text-xs font-semibold transition-all" style={!revenueMode?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>Bookings</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MONTHLY} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark?"#374151":"#f1f5f9"} vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:dark?"#9ca3af":"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>revenueMode?`$${(v/1000).toFixed(0)}k`:v}/>
            <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e2e8f0",fontSize:12,backgroundColor:dark?"#1f2937":"#fff"}} formatter={v=>[revenueMode?`$${v.toLocaleString()}`:v,revenueMode?"Revenue":"Bookings"]}/>
            <Bar dataKey={revenueMode?"revenue":"bookings"} fill={BRAND} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Projection Calculator */}
      <ProjectionCalculator dark={dark}/>

      {/* YoY Table */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${surface}`}>
        <div className={`px-6 py-4 border-b ${dark?"border-gray-700":"border-slate-100"}`}>
          <h2 className={`text-base font-semibold ${text}`}>Year-Over-Year Performance</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>2024 vs 2025 · prior / current / % change</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${dark?"bg-gray-700 border-gray-600":"bg-slate-50 border-slate-100"}`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide w-20 ${sub}`}>Month</th>
                {["Spend","CPC","CVR","Conversions","Revenue"].map(g=>(
                  <th key={g} colSpan={3} className={`px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide border-l ${dark?"border-gray-600 text-gray-400":"border-slate-100 text-slate-500"}`}>{g}</th>
                ))}
              </tr>
              <tr className={`border-b ${dark?"bg-gray-700 border-gray-600":"bg-slate-50 border-slate-200"}`}>
                <th className="px-4 py-1.5"/>
                {["Spend","CPC","CVR","Conversions","Revenue"].map(g=>
                  ["'24","'25","YoY"].map((s,i)=>(
                    <th key={`${g}-${s}`} className={`px-2 py-1.5 text-center text-xs ${sub} ${i===0?`border-l ${dark?"border-gray-600":"border-slate-100"}`:""}`}>{s}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {YOY_DATA.map(row=>{
                const special=row.isYtd||row.isTotal;
                const yoy=(a,b,lower=false)=>{
                  const p=pct(a,b); if(p==null) return <td className="px-2 py-2 text-center"/>;
                  const good=lower?p<0:p>0;
                  return <td className="px-2 py-2 text-center"><span className={`text-xs font-bold ${good?"text-emerald-600":"text-red-500"}`}>{p>0?"+":""}{p}%</span></td>;
                };
                return (
                  <tr key={row.month} className={`border-b transition-colors ${dark?"border-gray-700":"border-slate-50"} ${special?dark?"bg-gray-700":"bg-slate-50":dark?"hover:bg-gray-700":"hover:bg-slate-50"}`}>
                    <td className={`px-4 py-2 text-xs font-semibold ${text}`}>{row.month}</td>
                    <td className={`px-2 py-2 text-center text-xs border-l ${dark?"border-gray-700 text-gray-400":"border-slate-100 text-slate-500"}`}>{fmtUSD(row.spend24)}</td>
                    <td className={`px-2 py-2 text-center text-xs font-semibold ${text}`}>{fmtUSD(row.spend25)}</td>
                    {yoy(row.spend24,row.spend25,false)}
                    <td className={`px-2 py-2 text-center text-xs border-l ${dark?"border-gray-700 text-gray-400":"border-slate-100 text-slate-500"}`}>{row.cpc24?`$${row.cpc24}`:"—"}</td>
                    <td className={`px-2 py-2 text-center text-xs font-semibold ${text}`}>{row.cpc25?`$${row.cpc25}`:"—"}</td>
                    {yoy(row.cpc24,row.cpc25,true)}
                    <td className={`px-2 py-2 text-center text-xs border-l ${dark?"border-gray-700 text-gray-400":"border-slate-100 text-slate-500"}`}>{row.cvr24?`${row.cvr24}%`:"—"}</td>
                    <td className={`px-2 py-2 text-center text-xs font-semibold ${text}`}>{row.cvr25?`${row.cvr25}%`:"—"}</td>
                    {yoy(row.cvr24,row.cvr25,false)}
                    <td className={`px-2 py-2 text-center text-xs border-l ${dark?"border-gray-700 text-gray-400":"border-slate-100 text-slate-500"}`}>{fmtNum(row.conv24)}</td>
                    <td className={`px-2 py-2 text-center text-xs font-semibold ${text}`}>{fmtNum(row.conv25)}</td>
                    {yoy(row.conv24,row.conv25,false)}
                    <td className={`px-2 py-2 text-center text-xs border-l ${dark?"border-gray-700 text-gray-400":"border-slate-100 text-slate-500"}`}>{fmtUSD(row.rev24)}</td>
                    <td className={`px-2 py-2 text-center text-xs font-semibold ${text}`}>{fmtUSD(row.rev25)}</td>
                    {yoy(row.rev24,row.rev25,false)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform breakout */}
      <div className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-semibold ${text}`}>Platform Breakout</h2>
            <p className={`text-xs mt-0.5 ${sub}`}>By platform and campaign type</p>
          </div>
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 gap-0.5">
            {Object.entries(metricLabels).map(([k,l])=>(
              <button key={k} onClick={()=>setPlatformMetric(k)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={platformMetric===k?{backgroundColor:BRAND,color:"#fff"}:{color:"#64748b"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.keys(PLATFORM_CAMPAIGNS).map(p=>(
            <button key={p} onClick={()=>setActivePlatform(p)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={activePlatform===p?{backgroundColor:BRAND,color:"#fff",borderColor:BRAND}:{backgroundColor:dark?"#374151":"#fff",color:dark?"#9ca3af":"#64748b",borderColor:dark?"#4b5563":"#e2e8f0"}}>
              {p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>{activePlatform} — Latest Month</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[["Spend",`$${platTotal.spend.toLocaleString()}`],["ROAS",`${platTotal.roas}x`],["Bookings",platTotal.bookings],["CPA",`$${platTotal.cpa}`]].map(([l,v])=>(
                <div key={l} className="rounded-xl p-3" style={{backgroundColor:BRAND_LIGHT}}>
                  <p className="text-xs font-medium mb-0.5" style={{color:BRAND}}>{l}</p>
                  <p className="text-lg font-bold" style={{color:BRAND_DARK}}>{v}</p>
                </div>
              ))}
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>By Campaign — {metricLabels[platformMetric]}</p>
            <div className="space-y-3">
              {Object.entries(platData.campaigns).map(([campaign,cData])=>{
                const l=cData.monthly[cData.monthly.length-1];
                const dm=derived([l])[0];
                const val=platformMetric==="spend"?l.spend:platformMetric==="roas"?dm.roas:platformMetric==="conv"?l.bookings:dm.cpa;
                const maxVal=Math.max(...Object.values(platData.campaigns).map(c=>{const ll=c.monthly[c.monthly.length-1];const d2=derived([ll])[0];return platformMetric==="spend"?ll.spend:platformMetric==="roas"?d2.roas:platformMetric==="conv"?ll.bookings:d2.cpa;}));
                return (
                  <div key={campaign} className="flex items-center gap-3">
                    <span className={`text-xs w-24 shrink-0 ${sub}`}>{campaign}</span>
                    <div className={`flex-1 rounded-full h-2.5 ${dark?"bg-gray-600":"bg-slate-100"}`}>
                      <div className="h-2.5 rounded-full transition-all duration-500" style={{width:`${maxVal?(val/maxVal)*100:0}%`,backgroundColor:BRAND}}/>
                    </div>
                    <span className={`text-xs font-semibold w-16 text-right ${text}`}>{metricFmts[platformMetric](val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>Campaign Detail — Latest Month</p>
            <table className="w-full text-xs">
              <thead>
                <tr className={`border-b ${dark?"border-gray-700":"border-slate-100"}`}>
                  {["Campaign","Spend","ROAS","Bookings","CPA"].map(h=>(
                    <th key={h} className={`pb-2 ${h==="Campaign"?"text-left":"text-right"} font-medium ${sub}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(platData.campaigns).map(([campaign,cData])=>{
                  const l=cData.monthly[cData.monthly.length-1];
                  const dm=derived([l])[0];
                  return (
                    <tr key={campaign} className={`border-b ${dark?"border-gray-700 hover:bg-gray-700":"border-slate-50 hover:bg-slate-50"}`}>
                      <td className={`py-2 font-semibold ${text}`}>{campaign}</td>
                      <td className={`py-2 text-right ${sub}`}>${l.spend.toLocaleString()}</td>
                      <td className="py-2 text-right font-bold" style={{color:BRAND}}>{dm.roas}x</td>
                      <td className={`py-2 text-right ${sub}`}>{l.bookings}</td>
                      <td className={`py-2 text-right ${sub}`}>${dm.cpa.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Keywords + Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title:"Top Converting Keywords", subtitle:"Google Ads · This month", icon:<Search size={14} style={{color:BRAND}}/>,
            content:(
              <table className="w-full text-xs">
                <thead><tr className={`border-b ${dark?"border-gray-700":"border-slate-100"}`}>
                  {["Keyword","Conv.","CPA","CVR","↑↓"].map((h,i)=>(
                    <th key={h} className={`pb-2 font-medium ${sub} ${i===0?"text-left":"text-right"} ${h==="↑↓"?"text-center":""}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{KEYWORDS.map(k=>(
                  <tr key={k.keyword} className={`border-b ${dark?"border-gray-700 hover:bg-gray-700":"border-slate-50 hover:bg-slate-50"}`}>
                    <td className={`py-2 font-medium max-w-0 w-full ${text}`}><span className="truncate block" title={k.keyword}>{k.keyword}</span></td>
                    <td className={`py-2 text-right font-bold ${text}`}>{k.conv}</td>
                    <td className={`py-2 text-right ${sub}`}>${k.cpa}</td>
                    <td className={`py-2 text-right ${sub}`}>{k.cvr}%</td>
                    <td className="py-2 text-center">
                      {k.trend==="up"&&<TrendingUp size={12} className="inline text-emerald-500"/>}
                      {k.trend==="down"&&<TrendingDown size={12} className="inline text-red-400"/>}
                      {k.trend==="flat"&&<span className={sub}>—</span>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            )},
          { title:"Top Locations", subtitle:"By bookings · This month", icon:<MapPin size={14} style={{color:BRAND}}/>,
            content:(
              <table className="w-full text-xs">
                <thead><tr className={`border-b ${dark?"border-gray-700":"border-slate-100"}`}>
                  {["Location","Bookings","Revenue","ROAS"].map((h,i)=>(
                    <th key={h} className={`pb-2 font-medium ${sub} ${i===0?"text-left":"text-right"}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{LOCATIONS.map((l,i)=>(
                  <tr key={l.city} className={`border-b ${dark?"border-gray-700 hover:bg-gray-700":"border-slate-50 hover:bg-slate-50"}`}>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{backgroundColor:BRAND,fontSize:9}}>{i+1}</span>
                        <span className={`font-medium ${text}`}>{l.city}</span>
                      </div>
                    </td>
                    <td className={`py-2 text-right font-bold ${text}`}>{l.bookings}</td>
                    <td className={`py-2 text-right ${sub}`}>${(l.revenue/1000).toFixed(0)}K</td>
                    <td className="py-2 text-right font-bold" style={{color:BRAND}}>{l.roas}x</td>
                  </tr>
                ))}</tbody>
              </table>
            )},
        ].map(s=>(
          <div key={s.title} className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{backgroundColor:BRAND_LIGHT}}>{s.icon}</div>
              <div>
                <h2 className={`text-base font-semibold ${text}`}>{s.title}</h2>
                <p className={`text-xs ${sub}`}>{s.subtitle}</p>
              </div>
            </div>
            {s.content}
          </div>
        ))}
      </div>

      {/* Metric toggles */}
      <div className={`rounded-2xl border shadow-sm p-6 ${surface}`}>
        <div className="mb-4">
          <h2 className={`text-base font-semibold ${text}`}>Metric Trends</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Toggle to show/hide trend charts</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {TREND_METRICS.map(m=>(
            <Pill key={m.key} label={m.label} active={metrics[m.key]} color={m.color} onClick={()=>toggleMetric(m.key)} dark={dark}/>
          ))}
        </div>
        {activeMetrics.length===0&&<div className={`text-center py-8 text-sm ${sub}`}>Select metrics above to see trend charts</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeMetrics.map(m=>(
            <SparkCard key={m.key} subtitle={m.label} data={MONTHLY} dataKey={m.key} color={m.color} formatter={m.fmt} dark={dark}/>
          ))}
        </div>
      </div>

    </div>
  );
}
