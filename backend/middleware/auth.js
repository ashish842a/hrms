const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

            if (decoded.role === "admin") {
                req.user = await Admin.findById(decoded.id).select("-password");
            } else {
                req.user = await Employee.findById(decoded.id).select("-password");
            }
            req.role = decoded.role;
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Not authorized as an admin" });
    }
};

module.exports = { protect, adminOnly };
