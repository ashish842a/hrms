"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/AuthProvider';

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Don't render sidebar on login page
    if (pathname === '/login') return null;

    return (
        <aside className="sidebar" style={{ width: isCollapsed ? '88px' : '260px', padding: isCollapsed ? '1.5rem 1rem' : '1.5rem', alignItems: isCollapsed ? 'center' : 'stretch', transition: 'width 0.3s ease, padding 0.3s ease' }}>
            <div style={{ width: '100%' }}>
                <div className="logo" style={{ marginBottom: "2rem", justifyContent: isCollapsed ? "center" : "flex-start", padding: 0 }}>
                    <div className="logo-icon" style={{ flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    {!isCollapsed && <span style={{ marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>HRMS Lite</span>}
                </div>
                <nav className="nav-links">
                    {user?.role === 'admin' && (
                        <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`} title="Directory" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                            <div className="nav-item-content">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                                    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                                </svg>
                                {!isCollapsed && <span>Directory</span>}
                            </div>
                        </Link>
                    )}
                    <Link href="/attendance" className={`nav-item ${pathname?.startsWith('/attendance') ? 'active' : ''}`} title="Attendance" style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                        <div className="nav-item-content">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {!isCollapsed && <span>Attendance</span>}
                        </div>
                    </Link>
                </nav>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div style={{ padding: isCollapsed ? '0.5rem' : '1rem', background: 'var(--primary-light)', borderRadius: '12px', marginBottom: '1rem', display: 'flex', justifyContent: 'center', textAlign: isCollapsed ? 'center' : 'left' }}>
                    {isCollapsed ? (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                            {user?.role === "admin" ? "AD" : "EM"}
                        </div>
                    ) : (
                        <div style={{ width: '100%' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>Signed in as</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || user?.emailAddress}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem', textTransform: 'capitalize' }}>
                                {user?.role} Portal
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button
                        onClick={toggleTheme}
                        className="nav-item"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', marginBottom: '0.5rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    >
                        <div className="nav-item-content">
                            {theme === 'dark' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                            {!isCollapsed && <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                        </div>
                    </button>

                    <button
                        onClick={logout}
                        className="nav-item"
                        title="Sign Out"
                        style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', color: 'var(--danger)', marginBottom: '0.5rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    >
                        <div className="nav-item-content">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            {!isCollapsed && <span style={{ fontSize: '0.9rem', color: 'var(--danger)', whiteSpace: 'nowrap' }}>Sign Out</span>}
                        </div>
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="nav-item"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', color: 'var(--text-muted)', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    >
                        <div className="nav-item-content">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 16 8 12 12 8"></polyline>
                                <line x1="16" y1="12" x2="8" y2="12"></line>
                            </svg>
                            {!isCollapsed && <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Collapse</span>}
                        </div>
                    </button>
                </div>
            </div>
        </aside>
    );
}
