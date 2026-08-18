import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAllUsers,
  createStudentAccount,
  updateStudentRouteBus,
  deleteUserAccount
} from "../../services/adminService";
import SearchBar from "../../components/SearchBar";
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  ShieldCheck,
  Mail,
  CreditCard,
  AlertCircle,
  Bus,
  Hash,
  X
} from "lucide-react";
import "../../styles/admin.css";

const ManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRouteStudent, setEditRouteStudent] = useState(null);

  // Add Student Form State
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
    phone: "",
    route: "Route 101 - Central Express",
    busNo: "BUS-101"
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Edit Route Form State
  const [editForm, setEditForm] = useState({
    route: "",
    busNo: ""
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load user accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  // Handle Add Student
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAdd(true);
    try {
      await createStudentAccount(addForm, token);
      setShowAddModal(false);
      setAddForm({
        name: "",
        email: "",
        password: "",
        studentId: "",
        department: "",
        phone: "",
        route: "Route 101 - Central Express",
        busNo: "BUS-101"
      });
      loadUsers();
    } catch (err) {
      alert(err.message || "Failed to create student account");
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Open Edit Route Modal
  const openEditModal = (student) => {
    setEditRouteStudent(student);
    setEditForm({
      route: student.route || "Route 101 - Central Express",
      busNo: student.busNo || "BUS-101"
    });
  };

  // Handle Edit Route Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRouteStudent) return;

    setSubmittingEdit(true);
    try {
      await updateStudentRouteBus(editRouteStudent._id, editForm, token);
      setEditRouteStudent(null);
      loadUsers();
    } catch (err) {
      alert(err.message || "Failed to update route and bus number");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete account for "${name}"?`)) {
      try {
        await deleteUserAccount(id, token);
        loadUsers();
      } catch (err) {
        alert(err.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.studentId && u.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.route && u.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.busNo && u.busNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1>Registered Students & Users</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Register new students, update assigned bus routes, and manage accounts.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <UserPlus size={18} /> Register New Student
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="glass-panel" style={{ padding: "1.25rem" }}>
        {loading ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            Loading student profiles...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Contact Email</th>
                  <th>Student ID</th>
                  <th>Assigned Route</th>
                  <th>Bus No</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 700, color: "#fff" }}>{u.name}</td>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Mail size={14} color="var(--text-muted)" /> {u.email}
                        </span>
                      </td>
                      <td>{u.studentId || "N/A"}</td>
                      <td>
                        <span style={{ fontSize: "0.85rem", color: "#60a5fa", fontWeight: 600 }}>
                          {u.route || "Unassigned"}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-pending">
                          <Hash size={10} /> {u.busNo || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-approved' : 'badge-pending'}`}>
                          {u.role === "admin" ? <><ShieldCheck size={12} /> Admin</> : "Student"}
                        </span>
                      </td>
                      <td>
                        {u.role !== "admin" ? (
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => openEditModal(u)}
                              className="btn btn-secondary"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                              title="Edit Route & Bus No"
                            >
                              <Edit3 size={14} /> Change Route
                            </button>
                            <button
                              onClick={() => handleDelete(u._id, u.name)}
                              className="btn btn-danger"
                              style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Protected</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "2.5rem" }}>
                      No matching user accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-card" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3>Register New Student</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="alex@univ.edu"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Student ID *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="CS-2026-99"
                    value={addForm.studentId}
                    onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Assigned Route</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Route 101"
                    value={addForm.route}
                    onChange={(e) => setAddForm({ ...addForm, route: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Assigned Bus Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BUS-42"
                    value={addForm.busNo}
                    onChange={(e) => setAddForm({ ...addForm, busNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Initial Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingAdd}>
                  {submittingAdd ? "Registering..." : "Create Student Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Route & Bus No Modal */}
      {editRouteStudent && (
        <div className="modal-overlay">
          <div className="glass-panel modal-card" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Change Route & Bus No</h3>
              <button onClick={() => setEditRouteStudent(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div style={{ background: "#0f172a", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", border: "1px solid var(--card-border)" }}>
                <div><strong>Student:</strong> {editRouteStudent.name}</div>
                <div><strong>ID:</strong> {editRouteStudent.studentId}</div>
              </div>

              <div className="form-group">
                <label>Assigned Route</label>
                <div style={{ position: "relative" }}>
                  <Bus size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 42 }}
                    placeholder="e.g. Route 202 - Tech Express"
                    value={editForm.route}
                    onChange={(e) => setEditForm({ ...editForm, route: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Bus Number</label>
                <div style={{ position: "relative" }}>
                  <Hash size={18} color="#60a5fa" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 42 }}
                    placeholder="e.g. BUS-42"
                    value={editForm.busNo}
                    onChange={(e) => setEditForm({ ...editForm, busNo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditRouteStudent(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingEdit}>
                  {submittingEdit ? "Updating..." : "Save Route Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
