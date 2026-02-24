"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/login") {
        return <>{children}</>;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
