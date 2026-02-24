const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const router = express.Router();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

// Admin Login
router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                success: true,
                data: {
                    _id: admin._id,
                    email: admin.email,
                    role: "admin",
                    token: generateToken(admin._id, "admin"),
                },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Employee Login
router.post("/employee/login", async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
        const employee = await Employee.findOne({ emailAddress });
        if (employee && (await bcrypt.compare(password, employee.password))) {
            res.json({
                success: true,
                data: {
                    _id: employee._id,
                    emailAddress: employee.emailAddress,
                    employeeId: employee.employeeId,
                    fullName: employee.fullName,
                    role: "employee",
                    token: generateToken(employee._id, "employee"),
                },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
