import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#f8fafc" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ marginBottom:"24px" }}>
          <div style={{ width:"48px", height:"48px", borderRadius:"12px", backgroundColor:"#E21A6B", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <span style={{ color:"white", fontSize:"20px" }}>✈</span>
          </div>
          <p style={{ fontWeight:800, fontSize:"18px", color:"#1e293b", margin:0 }}>Propellic</p>
          <p style={{ fontSize:"13px", color:"#E21A6B", margin:0, fontWeight:600 }}>Travel Pulse</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
