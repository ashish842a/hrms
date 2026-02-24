const express = require("express");
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Get attendance
router.get("/", protect, async (req, res) => {
    try {
        const { employeeId, filterMonth, filterDay, searchQuery } = req.query;

        let query = {};

        // If not admin, bound strictly to their own ID
        if (req.role !== "admin") {
            query.employeeId = req.user._id;
        } else if (employeeId) {
            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ success: false, message: "Invalid employee ID" });
            }
            query.employeeId = employeeId;
        }

        // Filter by Month (format YYYY-MM)
        if (filterMonth) {
            query.date = { $regex: `^${filterMonth}` };
        }
        // Filter by specific day (format YYYY-MM-DD)
        if (filterDay) {
            query.date = filterDay;
        }

        let attendanceRecords = await Attendance.find(query).populate('employeeId', 'fullName employeeId department').sort({ date: -1 });

        // Client-side mapping for search query text matching logic since populate doesn't easily do text search
        if (searchQuery && req.role === "admin") {
            const lowerQuery = searchQuery.toLowerCase();
            attendanceRecords = attendanceRecords.filter(record =>
                record.employeeId && (
                    record.employeeId.fullName.toLowerCase().includes(lowerQuery) ||
                    record.employeeId.employeeId.toLowerCase().includes(lowerQuery)
                )
            );
        }

        res.json({ success: true, data: attendanceRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark attendance
router.post("/", protect, async (req, res) => {
    try {
        let { employeeId, date, status } = req.body;

        if (req.role !== "admin") {
            employeeId = req.user._id;
        }

        if (!employeeId || !date || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Must be 'Present' or 'Absent'" });
        }

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ success: false, message: "Invalid employee ID" });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { employeeId, date },
            { status },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
