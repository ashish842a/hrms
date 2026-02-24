"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/Modal";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  emailAddress: string;
  department: string;
}

const API_URL = "http://localhost:5000/api/employees";

// Function to safely extract initials
const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function EmployeesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    emailAddress: "",
    department: "",
  });

  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      router.push("/attendance");
    }
  }, [user, authLoading, router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchEmployees();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await axios.post(API_URL, formData);
      if (res.data.success) {
        setEmployees([res.data.data, ...employees]);
        setIsModalOpen(false);
        setFormData({ employeeId: "", fullName: "", emailAddress: "", department: "" });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to completely remove ${name} from the system?`)) return;
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      if (res.data.success) {
        setEmployees(employees.filter(emp => emp._id !== id));
      }
    } catch (err) {
      alert("Failed to delete employee");
    }
  };

  if (authLoading || (user && user.role !== "admin")) return null;

  return (
    <div>
      <div className="header">
        <div>
          <h1>Directory</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Manage your team members and their account details.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Employee
        </button>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : employees.length === 0 ? (
          <div className="panel-padding">
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>No Employees Found</h3>
              <p>Your directory is currently empty. Get started by adding a new employee to the system.</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Add First Employee
              </button>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th style={{ textAlign: "right", paddingRight: "2rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="avatar-cell">
                        <div className="avatar">
                          {getInitials(emp.fullName)}
                        </div>
                        <div>
                          <div className="emp-name">{emp.fullName}</div>
                          <div className="emp-email">{emp.emailAddress}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-id">{emp.employeeId}</span>
                    </td>
                    <td>
                      <span className="badge-dept">{emp.department}</span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "2rem" }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => router.push(`/attendance?employee=${emp._id}`)}
                          className="btn-icon-danger"
                          style={{ color: 'var(--primary)' }}
                          title="View Attendance"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp._id, emp.fullName)}
                          className="btn-icon-danger"
                          title="Remove Employee"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddEmployee}>
          {error && <div className="form-group" style={{ color: "var(--danger)", backgroundColor: "var(--danger-light)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500 }}>{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control" required placeholder="John Doe" />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="form-control" required placeholder="john@company.com" />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Employee ID</label>
              <input name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="form-control" required placeholder="e.g. EMP001" />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Department</label>
              <input name="department" value={formData.department} onChange={handleInputChange} className="form-control" required placeholder="Engineering" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Confirm & Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
