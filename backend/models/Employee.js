const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
    {
        employeeId: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        emailAddress: { type: String, required: true, match: /.+\@.+\..+/ },
        department: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
