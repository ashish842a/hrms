# HRMS Lite

A lightweight, enterprise-ready Human Resource Management System built with **Next.js** and **Node.js (Express)**.

HRMS Lite is designed to simplify employee management and attendance tracking with a dual-role access system, securely separating administrative capabilities from standard employee workflows. The platform handles end-to-end personnel onboarding (including automated HTML credential emailing) and robust attendance log reporting.

---

## 🚀 Features

### **Administrative Capabilities (Admin)**
*   **Employee Directory Management:** Securely add, view, and completely remove personnel from the corporate system.
*   **Automated Onboarding:** When an Admin adds a new employee, the system locally generates an 8-character password, hashes it safely, and instantly dispatches a beautifully formatted **HTML Welcome Email** to the employee containing their login URL and temporary credentials.
*   **Attendance Oversight:** View real-time attendance logs across the entire company.
*   **Targeted Filtering:** Easily slice attendance data dynamically by `Specific Employee`, `Month`, or `Exact Date`.
*   **CSV Data Export:** Generate and download one-click `.csv` reports of the currently filtered attendance subset natively within the browser.
*   **Manual Backdating:** Admins have exclusive bypass privileges to manually fill out or correct missing attendance logs for any employee on past dates.

### **Employee Capabilities**
*   **Isolated Dashboard:** Employees are locked into their own scope and cannot access the corporate directory.
*   **Self-Service Check In:** Mark daily attendance easily ("Present" or "Absent").
*   **Date Integrity:** Employees are dynamically blocked natively in both the UI Calendar and the Backend API from manipulating timestamps or backdating any attendance logs in the past. 

### **🌟 Bonus Features Implemented**
*   **Filter Attendance Records by Date:** A robust filter system added to strictly query specific months (`MM-YYYY`) and exact days via calendar UI.
*   **Display Total Present Days Per Employee:** Contextual dashboard cards natively recalculate and inject the exact integer counts for specific dropdown-targeted employees.
*   **Basic Dashboard Summary (Counts):** A beautifully styled quick-glance statistics row containing metrics for:
    *   Total Tracked Days
    *   Total Days Present 
    *   Total Days Absent

### **Platform Security & UI**
*   **Role-Based Access Control (RBAC):** Tight structural security preventing employees from invoking unauthorized REST queries.
*   **JWT Authentication:** Localized session management.
*   **Network Rate-Limiting:** Express network constraints actively reject IPs making over 100 requests in 15 minutes, preventing DDOS polling.
*   **Dark Mode Native:** A sleek, fully responsive `ThemeProvider` that elegantly swaps deep blue tones across glassmorphism surfaces and inputs natively.

---

## 🛠 Tech Stack

**Frontend**
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Custom CSS Variables (Agnostic System Design) & Dark Mode

**Backend**
*   **Server:** Node.js with Express.js
*   **Database:** MongoDB via Mongoose ODM
*   **Authentication:** `jsonwebtoken` and `bcryptjs`
*   **Email Engine:** `nodemailer`

---

## 📥 Local Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URI string)

### 2. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd HRMS_Lite
\`\`\`

### 3. Backend Setup
Navigate into the backend directory and install all standard node modules.

\`\`\`bash
cd backend
npm install
\`\`\`

**Environment Variables (`backend/.env`):**
Create a `.env` file at the root of the `/backend` folder and configure the matching constraints:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hrms-lite
JWT_SECRET=your_super_secret_jwt_key
EMAIL=your-company-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
\`\`\`
> *Note: For the email engine to function correctly, ensure you generate an **App Password** from your Google Account settings, rather than using your direct password.*

**Database Seeding:**
You must initialize the default Admin account before using the portal.
\`\`\`bash
npm run seed
\`\`\`
*(This will generate the default login: `admin@gmail.com` | `admin@123`)*

**Start Node Server:**
\`\`\`bash
node server.js
\`\`\`
*(Server will start on http://localhost:5000) (https://hrms-tbe0.onrender.com)*

### 4. Frontend Setup
Open a secondary terminal process, navigate to the frontend directory, and begin the Next.js process.

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(React Application will spin up on http://localhost:3000) (https://hrms-one-sigma.vercel.app/)*

---

## 💻 Usage

Navigate to [http://localhost:3000](http://localhost:3000) or [https://hrms-one-sigma.vercel.app/](https://hrms-one-sigma.vercel.app/) inside your web browser. 

1. Select the **Admin Access** tab.
2. Log in using `admin@gmail.com` / `admin@123`.
3. Start adding your employees in the Directory to automatically dispatch their credential emails, and explore the Attendance Tracking panel!
