"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/Modal";
import { useAuth } from "@/components/AuthProvider";
import { useSearchParams, useRouter } from "next/navigation";

interface Employee {
    _id: string;
    fullName: string;
    employeeId: string;
}

interface AttendanceRecord {
    _id: string;
    employeeId: any;
    date: string;
    status: "Present" | "Absent";
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getInitials = (name: string) => {
    if (!name) return "??";
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
};

export default function AttendancePage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterDay, setFilterDay] = useState("");
    const [employeeIdFilter, setEmployeeIdFilter] = useState(searchParams?.get("employee") || "");

    const [formData, setFormData] = useState({
        employeeId: user?.role === "employee" ? user._id : "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
    });

    const fetchData = async () => {
        try {
            setLoading(true);

            let endpoint = `${API_BASE}/attendance?`;
            if (searchQuery) endpoint += `searchQuery=${searchQuery}&`;
            if (filterMonth && !filterDay) endpoint += `filterMonth=${filterMonth}&`;
            if (filterDay) endpoint += `filterDay=${filterDay}&`;
            if (employeeIdFilter && user?.role === "admin") endpoint += `employeeId=${employeeIdFilter}&`;

            if (user?.role === "admin") {
                const [empRes, attRes] = await Promise.all([
                    axios.get(`${API_BASE}/employees`),
                    axios.get(endpoint)
                ]);
                setEmployees(empRes.data.data || []);
                setAttendance(attRes.data.data || []);
            } else {
                const attRes = await axios.get(endpoint);
                setAttendance(attRes.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, searchQuery, filterMonth, filterDay, employeeIdFilter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMarkAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/attendance`, formData);
            if (res.data.success) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to mark attendance");
        } finally {
            setSubmitting(false);
        }
    };

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Employee Name,Employee ID,Date,Status\n";

        attendance.forEach((record) => {
            const name = record.employeeId?.fullName || user?.fullName || "Self";
            const empId = record.employeeId?.employeeId || user?.employeeId || "---";
            const date = record.date;
            const status = record.status;
            csvContent += `"${name}","${empId}","${date}","${status}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setFilterMonth("");
        setFilterDay("");
        setEmployeeIdFilter("");
        if (searchParams?.get("employee")) {
            router.push("/attendance");
        }
    };

    return (
        <div>
            <div className="header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1>Attendance Tracking</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "0.25rem", fontSize: "0.95rem" }}>
                        {user?.role === "admin" ? "Log and review daily attendance logs here." : "Log and view your personal attendance history."}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {attendance.length > 0 && (
                        <button className="btn btn-outline" onClick={downloadCSV}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export CSV
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Mark Attendance
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', alignItems: 'flex-end' }}>
                {user?.role === "admin" && (
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Employee</label>
                        <select
                            value={employeeIdFilter}
                            onChange={(e) => setEmployeeIdFilter(e.target.value)}
                            className="form-control"
                        >
                            <option value="">All Employees</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.fullName} ({emp.employeeId})</option>
                            ))}
                        </select>
                    </div>
                )}

                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Filter by Month</label>
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => { setFilterMonth(e.target.value); setFilterDay(""); }}
                        className="form-control"
                    />
                </div>

                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Filter by Day</label>
                    <input
                        type="date"
                        value={filterDay}
                        onChange={(e) => { setFilterDay(e.target.value); setFilterMonth(""); }}
                        className="form-control"
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {(searchQuery || filterMonth || filterDay || employeeIdFilter) && (
                    <button onClick={clearFilters} className="btn btn-outline" style={{ padding: '0.625rem 1rem' }}>
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Basic Dashboard Summary */}
            {!loading && attendance.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Tracked Days</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{attendance.length}</span>
                    </div>
                    <div style={{ background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', borderBottom: '4px solid var(--success)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Days Present</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                            {attendance.filter(r => r.status === 'Present').length}
                        </span>
                    </div>
                    <div style={{ background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', borderBottom: '4px solid var(--danger)' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Days Absent</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>
                            {attendance.filter(r => r.status === 'Absent').length}
                        </span>
                    </div>
                </div>
            )}

            <div className="glass-panel">
                {loading ? (
                    <div className="loader-container"><div className="loader"></div></div>
                ) : attendance.length === 0 ? (
                    <div className="panel-padding">
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <h3>No Records Found</h3>
                            <p>Try adjusting your search filters or mark attendance to get started.</p>
                        </div>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>ID</th>
                                    <th>Date Logged</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record) => {
                                    const name = record.employeeId?.fullName || user?.fullName || "Self";
                                    const empId = record.employeeId?.employeeId || user?.employeeId || "---";

                                    return (
                                        <tr key={record._id}>
                                            <td>
                                                <div className="avatar-cell">
                                                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                                        {getInitials(name)}
                                                    </div>
                                                    <div className="emp-name" style={{ fontSize: '0.9rem' }}>
                                                        {name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="badge-id">{empId}</span></td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                                                {new Date(record.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${record.status.toLowerCase()}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Attendance">
                <form onSubmit={handleMarkAttendance}>
                    {error && <div className="form-group" style={{ color: "var(--danger)", backgroundColor: "var(--danger-light)", padding: "0.75rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500 }}>{error}</div>}

                    {user?.role === "admin" && (
                        <div className="form-group">
                            <label>Employee Select</label>
                            <select name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="form-control" required>
                                <option value="" disabled>Search or select member...</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.fullName} - {emp.employeeId}</option>
                                ))}
                            </select>
                            {employees.length === 0 && (
                                <p style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: '0.5rem' }}>
                                    You must create an employee first in the Directory.
                                </p>
                            )}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Attendance Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="form-control"
                                min={new Date().toISOString().split("T")[0]}
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="form-control" required>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || (user?.role === "admin" && employees.length === 0)}>
                            {submitting ? "Saving..." : "Submit Log"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
