import React from "react";
import { Link } from "react-router-dom";
import { Bus, Calendar, QrCode, ArrowRight, CheckCircle2, AlertCircle, Hash } from "lucide-react";

const PassCard = ({ pass }) => {
  const isExpired = pass.status === "Expired" || new Date(pass.expiryDate) < new Date();

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bus size={18} color="var(--primary)" />
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff" }}>{pass.passId}</span>
          </div>
          <span className={`badge ${isExpired ? 'badge-expired' : 'badge-active'}`}>
            {isExpired ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
            {isExpired ? "Expired" : "Active Pass"}
          </span>
        </div>

        <div style={{ background: "#0f172a", padding: "0.85rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Route Journey</span>
            <span className="badge badge-pending" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
              <Hash size={10} /> {pass.busNo || "BUS-101"}
            </span>
          </div>

          <div style={{ fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>{pass.source}</span>
            <ArrowRight size={14} color="#60a5fa" />
            <span>{pass.destination}</span>
          </div>

          <div style={{ fontSize: "0.78rem", color: "#60a5fa", marginTop: "0.25rem" }}>
            Route: {pass.route} ({pass.passType} Pass)
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Calendar size={14} /> Valid Till:
          </span>
          <span style={{ color: isExpired ? "var(--danger)" : "#10b981", fontWeight: 700 }}>
            {new Date(pass.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      <Link to="/digital-pass" className="btn btn-primary" style={{ width: "100%" }}>
        <QrCode size={16} /> View Digital Pass
      </Link>
    </div>
  );
};

export default PassCard;
