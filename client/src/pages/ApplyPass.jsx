import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { submitPassApplication } from "../services/passService";
import { MapPin, Navigation, Bus, Send, AlertCircle, CheckCircle, Hash } from "lucide-react";
import "../styles/application.css";

const ApplyPass = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    route: user?.route || "Route 101 - Central Express",
    busNo: user?.busNo || "BUS-101",
    source: "",
    destination: "",
    passType: "Monthly"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const routeOptions = [
    "Route 101 - Central Express (Main Campus ↔ City Terminal)",
    "Route 202 - Tech Corridor (Campus ↔ Tech Park & Metro)",
    "Route 303 - North Suburban (Campus ↔ North Station)",
    "Route 404 - South Coast (Campus ↔ Seaside Junction)"
  ];

  const passTypes = [
    { title: "Monthly", duration: "30 Days", price: "$45" },
    { title: "Quarterly", duration: "90 Days", price: "$120" },
    { title: "Yearly", duration: "365 Days", price: "$400" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.busNo || !formData.busNo.trim()) {
      setError("Please specify your Bus Number.");
      return;
    }

    setLoading(true);

    try {
      await submitPassApplication(formData, token);
      setSuccess("Application submitted successfully to Admin for approval!");
      setTimeout(() => {
        navigate("/status");
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-container">
      <div style={{ marginBottom: "2rem" }}>
        <h1>Apply for Bus Pass</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Specify your route details, bus number, and duration to request a digital bus pass.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="glass-panel application-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Select / Type Bus Route</label>
              <div style={{ position: "relative" }}>
                <Bus size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type="text"
                  name="route"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="e.g. Route 101 - Central Express"
                  value={formData.route}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Requested Bus Number (Bus No)</label>
              <div style={{ position: "relative" }}>
                <Hash size={18} color="#60a5fa" style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type="text"
                  name="busNo"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="e.g. BUS-42, BUS-101"
                  value={formData.busNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Boarding Stop (Source)</label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} color="var(--secondary)" style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type="text"
                  name="source"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="e.g. Central Station"
                  value={formData.source}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Destination Stop</label>
              <div style={{ position: "relative" }}>
                <Navigation size={18} color="var(--accent)" style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type="text"
                  name="destination"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="e.g. University Campus Gate 2"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Pass Type & Duration</label>
            <div className="pass-type-selector">
              {passTypes.map((pt) => (
                <div
                  key={pt.title}
                  className={`pass-type-option ${formData.passType === pt.title ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, passType: pt.title })}
                >
                  <div className="pass-type-title">{pt.title}</div>
                  <div className="pass-type-price">{pt.price} / {pt.duration}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "2rem", padding: "0.9rem" }}
            disabled={loading}
          >
            {loading ? "Submitting Application..." : <><Send size={18} /> Submit Application to Admin</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyPass;
