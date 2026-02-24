const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema(
    {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
        date: { type: String, required: true },
        status: { type: String, enum: ["Present", "Absent"], required: true },
    },
    { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
