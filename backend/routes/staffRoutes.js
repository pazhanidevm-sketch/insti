const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");


// ✅ SUBMIT STAFF (from officestaff.html)
router.post("/", async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        await newStaff.save();

        res.json({ message: "Staff submitted" });
    } catch (err) {
        res.status(500).json({ message: "Error saving staff" });
    }
});


// ✅ GET PENDING STAFF (for view list)
router.get("/pending", async (req, res) => {
    try {
        const data = await Staff.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching staff" });
    }
});


// ✅ SEND TO PRINCIPAL
router.put("/send-to-management", async (req, res) => {
    try {
        const { ids } = req.body;

        await Staff.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    status: "sent",
                    approvalStatus: "pending"
                }
            }
        );

        res.json({ message: "Sent to Principal" });

    } catch (err) {
        res.status(500).json({ message: "Error updating" });
    }
});


// ✅ PRINCIPAL APPROVES
router.put("/approve", async (req, res) => {
    try {
        const { ids } = req.body;

        await Staff.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    status: "confirmed",
                    approvalStatus: "approved"
                }
            }
        );

        res.json({ message: "Approved" });

    } catch (err) {
        res.status(500).json({ message: "Error approving" });
    }
});


// ✅ GET CONFIRMED STAFF (for staff records page)
router.get("/confirmed", async (req, res) => {
    try {
        const { search, department } = req.query;

        let filter = { status: "confirmed" };
        // 🔍 SEARCH (name OR department)
if (search) {
    filter.$or = [
        { name: new RegExp(search, "i") },
        { department: new RegExp(search, "i") }
    ];
}

// 🏫 DEPARTMENT FILTER (AND condition)
if (department && department !== "ALL") {
    filter.department = new RegExp(`^${department}$`, "i"); // exact match
}
       

        const data = await Staff.find(filter).sort({ createdAt: -1 });

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: "Error fetching confirmed staff" });
    }
});
// ✅ GET STAFF FOR PRINCIPAL APPROVAL
router.get("/approval-list", async (req, res) => {
    try {
        const data = await Staff.find({
            status: "sent",
            approvalStatus: "pending"
        }).sort({ createdAt: -1 });

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: "Error fetching staff approvals" });
    }
});


// ✅ APPROVE STAFF
router.put("/approve-staff", async (req, res) => {
    try {
        const { id } = req.body;

        await Staff.findByIdAndUpdate(id, {
            status: "confirmed",
            approvalStatus: "approved"
        });

        res.json({ message: "Staff Approved" });

    } catch (err) {
        res.status(500).json({ message: "Error approving staff" });
    }
});


// ❌ REJECT STAFF
router.put("/reject-staff", async (req, res) => {
    try {
        const { id } = req.body;

        await Staff.findByIdAndUpdate(id, {
            status: "pending",
            approvalStatus: "rejected"
        });

        res.json({ message: "Staff Rejected" });

    } catch (err) {
        res.status(500).json({ message: "Error rejecting staff" });
    }
});
module.exports = router;