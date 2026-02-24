const express = require("express");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const sendEmail = require("../utils/sendEmail");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Get all employees (Admin Only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const employees = await Employee.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new employee (Admin Only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { employeeId, fullName, emailAddress, department } = req.body;

    if (!employeeId || !fullName || !emailAddress || !department) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: "Employee ID already exists" });
    }

    // Generate random 8-character password
    const plainPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const employee = await Employee.create({
      employeeId,
      fullName,
      emailAddress,
      department,
      password: hashedPassword,
    });

    // Send confirmation email
    // Send confirmation email
    const emailHtml = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;padding:20px 0;">
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;background-color:#ffffff;border:1px solid #e6ebf1;border-radius:12px;margin:0 auto;box-shadow:0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <tbody>
            <tr>
              <td>
                <!-- Header Component -->
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background:linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);padding:40px 0;border-top-left-radius:12px;border-top-right-radius:12px;">
                  <tbody>
                    <tr>
                      <td style="text-align:center;">
                        <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px;">HRMS Portal</h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Body Content -->
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:40px 48px;">
                  <tbody>
                    <tr>
                      <td>
                        <h2 style="color:#1a202c;font-size:22px;font-weight:600;margin:0 0 16px;">Welcome aboard, ${fullName}!</h2>
                        <p style="color:#4a5568;font-size:16px;line-height:26px;margin:0 0 32px;">
                          We are thrilled to officially welcome you to the team. Your enterprise account has been successfully provisioned. You can use the credentials below to log in and manage your dashboard.
                        </p>
                        
                        <!-- Credentials Box -->
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px;">
                          <tbody>
                            <tr>
                              <td style="padding-bottom:12px;">
                                <span style="display:inline-block;width:120px;color:#718096;font-size:14px;font-weight:500;">Login URL</span>
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="color:#4F46E5;font-size:15px;font-weight:600;text-decoration:none;">${process.env.FRONTEND_URL || 'http://localhost:3000'}/login</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom:12px;">
                                <span style="display:inline-block;width:120px;color:#718096;font-size:14px;font-weight:500;">Email Address</span>
                                <span style="color:#2d3748;font-size:15px;font-weight:600;">${emailAddress}</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span style="display:inline-block;width:120px;color:#718096;font-size:14px;font-weight:500;">Temp Password</span>
                                <div style="display:inline-block;background-color:#edf2f7;border-radius:6px;padding:6px 12px;">
                                  <span style="color:#1a202c;font-family:monospace;font-size:16px;font-weight:700;letter-spacing:1px;">${plainPassword}</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <!-- Security Warning -->
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:32px 0 0;background-color:#fffaf0;border-left:4px solid #ed8936;border-radius:4px;padding:16px;">
                          <tbody>
                            <tr>
                              <td>
                                <p style="color:#9c4221;font-size:14px;line-height:22px;margin:0;">
                                  <strong>Security Check:</strong> Please do not share this email. Use these credentials to sign in and we heavily recommend saving your portal bookmark immediately.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <!-- Action Button -->
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:40px;">
                          <tbody>
                            <tr>
                              <td align="center">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color:#4F46E5;border-radius:8px;color:#ffffff;display:inline-block;font-size:16px;font-weight:600;line-height:50px;text-align:center;text-decoration:none;width:250px;">Access Employee Portal</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Footer Component -->
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#f1f5f9;border-top:1px solid #e2e8f0;border-bottom-left-radius:12px;border-bottom-right-radius:12px;padding:30px;">
                  <tbody>
                    <tr>
                      <td style="text-align:center;">
                        <p style="color:#a0aec0;font-size:13px;line-height:20px;margin:0;">
                          © ${new Date().getFullYear()} Enterprise HRMS System. All rights reserved.<br />
                          This is an automated system email. Please do not reply directly.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Send email asynchronously in the background so it doesn't block the API response
    sendEmail({
      email: emailAddress,
      subject: "Welcome to the HRMS Lite Portal - Account Details",
      html: emailHtml,
    }).catch((emailError) => {
      console.error("Error sending email background task:", emailError.message);
    });

    res.status(201).json({
      success: true,
      data: {
        _id: employee._id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        emailAddress: employee.emailAddress,
        department: employee.department,
        plainPassword: plainPassword
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Employee ID or Email already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an employee (Admin Only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await Attendance.deleteMany({ employeeId: id });

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
