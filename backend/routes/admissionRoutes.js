const express = require("express");
const router = express.Router();
const Admission = require("../models/Admission");


// ✅ SUBMIT FORM (UG / PG)
router.post("/submit", async (req, res) => {
    try {
        const data = req.body;
        data.annualIncome = Number(data.annualIncome) || 0;
        const branchMapUG = {
            "1": "CSE",
            "2": "EEE",
            "3": "ECE",
            "4": "AI & DS",
            "5": "IT"
        };

        const branchMapPG = {
            "1": "M.E CEM",
            "2": "M.E PED",
            "3": "M.E CS",
            "4": "M.E CSE",
            "5": "M.E AE",
            "6": "MBA",
            "7": "MCA"
        };

        const department = (
    data.category === "UG"
        ? branchMapUG[data.branch]
        : branchMapPG[data.branch]
).replace(/\s+/g, "-").replace(".", "");
       const newAdmission = new Admission({
    category: data.category,
    fullName: data.fullNameCaps,
    department: department,
    year: data.year,        // 🔥 ADD THIS
    section: data.section,  // 🔥 ADD THIS
    phone: data.studentWhatsapp || data.fatherMobile,
    rawData: data
});

        await newAdmission.save();

        res.json({ message: "Application submitted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving application" });
    }
});


// ✅ GET PENDING (FOR admission-details.html)
router.get("/pending/:category", async (req, res) => {
    try {
        const students = await Admission.find({
            category: req.params.category,
            status: "pending"
        });

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching pending students" });
    }
});
// ✅ GET SENT (FOR admission-confirm.html)
router.get("/sent/:category", async (req, res) => {
    try {
        const students = await Admission.find({
            category: req.params.category,
            status: "sent"
        });

        res.json(students);

    } catch (err) {
        res.status(500).json({ message: "Error fetching confirmed list" });
    }
});
// ✅ SEND TO OFFICE
router.put("/send-to-office", async (req, res) => {
    try {
        const { ids } = req.body;

        await Admission.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    status: "sent"
                }
            }
        );

        res.json({ message: "Sent to Office" });

    } catch (err) {
        res.status(500).json({ message: "Error updating status" });
    }
});
// ✅ SEND TO MANAGEMENT
router.put("/send-to-management", async (req, res) => {
    try {
        const { ids, batchId, year, section, courseDuration} = req.body;
       console.log("Updated IDs:", ids);
        await Admission.updateMany(
     { _id: { $in: ids } },
            {
                $set: {
                    status: "sent_to_principal",
                    batchId: batchId,
                    approvalStatus: "pending",
                    year,      
                    section,
                    courseDuration   
                }
            }
        );

        res.json({ message: "Batch sent for approval" });

    } catch (err) {
        res.status(500).json({ message: "Error updating status" });
    }
});
// ✅ CONFIRM ADMISSION (FINAL APPROVAL)
router.put("/confirm", async (req, res) => {
    try {
        const { id } = req.body;

        await Admission.findByIdAndUpdate(id, {
            status: "confirmed"
        });

        res.json({ message: "Admission confirmed" });

    } catch (err) {
        res.status(500).json({ message: "Error confirming admission" });
    }
});


// ✅ GET CONFIRMED STUDENTS (FOR OFFICE RECORDS)
router.get("/final-confirmed", async (req, res) => {
    try {
         const { search, department, income } = req.query;

let filter = {
    status: "confirmed"
};

// 🔍 Search filter (BC, quota, etc.)
if (search) {
    filter.$or = [
        { fullName: new RegExp(search, "i") },
        { department: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },

        // 🔥 FORM FIELDS (CORRECT NAMES)
        { "rawData.community": new RegExp(search, "i") },
        { "rawData.quota": new RegExp(search, "i") },
        { "rawData.govtSchool": new RegExp(search, "i") }, // ✅ FIXED
        { "rawData.firstGraduate": new RegExp(search, "i") },

        // 🔥 EXTRA USEFUL FIELDS (optional but recommended)
        { "rawData.nativePlace": new RegExp(search, "i") },
        { "rawData.hscSchool": new RegExp(search, "i") },
        { "rawData.regNo": new RegExp(search, "i") },         // ✅ Register number
        { "rawData.admissionType": new RegExp(search, "i") }// ✅ Admission type
    ];
}

// 🏫 Department filter (THIS IS THE FIX)
if (department && department !== "ALL") {
    filter.department = new RegExp(department, "i");
}
// 💰 Income filter (FINAL FIX)
if (income && income !== "ALL") {

    filter.$and = filter.$and || [];

    filter.$and.push({
        $expr: {
            $lte: [
                { $toInt: "$rawData.annualIncome" },
                parseInt(income)
            ]
        }
    });
}
       console.log("👉 FINAL FILTER:", JSON.stringify(filter, null, 2));
        const students = await Admission.find(filter)
            .sort({ createdAt: -1 });

        res.json(students);

    } catch (err) {
        res.status(500).json({ message: "Error fetching confirmed students" });
    }
});
// GET applications by status + filters
router.get("/office-view", async (req, res) => {
    try {
        console.log("Incoming Query:", req.query);
        const { category, department } = req.query;

        let filter = {
            status: "sent"   // 🔥 IMPORTANT
        };

        if (category) {
            filter.category = category;
        }

        if (department) {
    if (category === "PG") {
        // 🔥 PG → match exactly (ME-CEM, MBA, MCA etc.)
        filter.department = department;
    } else {
        // 🔥 UG → keep your existing flexible logic
        filter.department = new RegExp(department, "i");
    }
}
        const data = await Admission.find(filter).sort({ createdAt: -1 });

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: "Error fetching applications" });
    }
});
router.put("/approve-batch", async (req, res) => {
    try {
        const { batchId } = req.body;

        console.log("👉 Incoming BatchId:", batchId);

        if (!batchId) {
            return res.status(400).json({ message: "BatchId missing" });
        }

        const result = await Admission.updateMany(
            {
                $or: [
                    { batchId: batchId },
                    { _id: batchId } // fallback
                ]
            },
            {
                $set: {
                    approvalStatus: "approved",
                    status: "confirmed"
                }
            }
        );

        console.log("✅ Matched:", result.matchedCount);
        console.log("✅ Modified:", result.modifiedCount);

        res.json({ message: "Batch approved successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error approving batch" });
    }
});
// ❌ REJECT BATCH
router.put("/reject-batch", async (req, res) => {
    try {
        const { batchId } = req.body;

        await Admission.updateMany(
            { batchId },
            {
                $set: {
                    status: "pending",
                    approvalStatus: "rejected"
                },
                $unset: {
                    batchId: ""
                }
            }
        );

        res.json({ message: "Batch rejected and moved back to pending" });

    } catch (err) {
        res.status(500).json({ message: "Error rejecting batch" });
    }
});
// ✅ UPDATE STUDENT (OFFICE EDIT)
router.put("/update/:id", async (req, res) => {
    try {
        const updatedData = req.body;

        const student = await Admission.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // 🔥 Merge old + new data
        const newRawData = {
            ...student.rawData,
            ...updatedData
        };

        student.rawData = newRawData;

        await student.save();

        res.json({ message: "Student updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error updating student" });
    }
});
// ✅ GET ALL BATCHES FOR PRINCIPAL
router.get("/approval-batches", async (req, res) => {
    try {
        const students = await Admission.find({
            status: "sent_to_principal",
            $or: [
               { approvalStatus: "pending" },
               { approvalStatus: { $exists: false } }
            ]
        });
        console.log("Fetched Students for Approval:", students);
        // 🔥 Group by batchId
        const grouped = {};
      students.forEach(student => {
      const batchKey = student.batchId || student._id.toString();// ✅ fallback

    if (!grouped[batchKey]) {
        grouped[batchKey] = [];
    }

    grouped[batchKey].push(student);
});

        res.json(grouped);

    } catch (err) {
        res.status(500).json({ message: "Error fetching batches" });
    }
});
// ✅ GET STUDENTS FOR HOD ASSIGNMENT
router.get("/students-for-assignment", async (req, res) => {

    try {

        const { department, year } = req.query;

        console.log("Department received:", department);
        console.log("Year received:", year);

        const all = await Admission.find();

console.log(all.map(s => ({
    name: s.fullName,
    department: s.department,
    year: s.year,
    status: s.status,
    section: s.section
})));

const students = await Admission.find({
    status: "confirmed",
    department: department,
    year: year
}).sort({
    fullName: 1
});

console.log("Students Found:", students.length);

        console.log("Students Found:", students.length);

        res.json(students);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching students"
        });

    }

});
// ✅ SAVE SECTION ALLOCATION
router.put(
    "/save-section-allocation",
    async (req, res) => {

        try {

            const {
    students,
    year
} = req.body;

            for (const student of students) {

                await Admission.findByIdAndUpdate(

                    student.id,

                    {
    section: student.section,
    year: year
}

                );

            }

            res.json({
                message:
                "Section allocation saved successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                "Error saving allocation"
            });

        }

    }
);
// ✅ GET SINGLE STUDENT (IMPORTANT FIX)
router.get("/:id", async (req, res) => {
    try {
        const student = await Admission.findById(req.params.id);

        // 🔥 RETURN FULL FORM DATA
        res.json(student.rawData);

    } catch (err) {
        res.status(500).json({ message: "Error fetching student" });
    }
});

module.exports = router;