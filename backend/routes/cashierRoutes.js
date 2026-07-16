const express = require("express");
const router = express.Router();
const Admission = require("../models/Admission");
const Payment = require("../models/payment"); // ensure exact filename case
// ✅ CASHIER: GET CONFIRMED STUDENTS (NO INCOME FILTER)
router.get("/confirmed", async (req, res) => {
    try {
        const { search, department } = req.query;

        let filter = {
            status: "confirmed"
        };

        // 🔍 SEARCH
        if (search) {
            filter.$or = [
                { fullName: new RegExp(search, "i") },
                { department: new RegExp(search, "i") },
                { "rawData.regNo": new RegExp(search, "i") }, 
                { category: new RegExp(search, "i") }
            ];
        }

        // 🏫 DEPARTMENT FILTER
        if (department && department !== "ALL") {
            filter.department = new RegExp(department, "i");
        }

        const students = await Admission.find(filter)
            .sort({ createdAt: -1 });

        res.json(students);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching cashier data" });
    }
});
// ✅ GET SINGLE STUDENT FOR CASHIER
router.get("/student/:id", async (req, res) => {
    try {
        const student = await Admission.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);

    } catch (err) {
        res.status(500).json({ message: "Error fetching student" });
    }
});
// ✅ ADD PAYMENT
router.post("/student/:id/payments", async (req, res) => {
    try {
        const { amount, category } = req.body;

        const student = await Admission.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const payment = new Payment({
            studentId: student._id,
            studentName: student.fullName,
            department: student.department,
            amount,
            category
        });

        await payment.save();

        res.json({ message: "Payment saved successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error saving payment" });
    }
});
// ✅ GET STUDENT PAYMENTS
router.get("/student/:id/payments", async (req, res) => {
    try {
        const payments = await Payment.find({ studentId: req.params.id })
            .sort({ date: -1 });

        res.json(payments);

    } catch (err) {
        res.status(500).json({ message: "Error fetching payments" });
    }
});
// ✅ GET ALL PAYMENT HISTORY
router.get("/history", async (req, res) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { studentName: new RegExp(search, "i") },
                { department: new RegExp(search, "i") }
            ];
        }

        const payments = await Payment.find(filter)
            .sort({ date: -1 });

        res.json(payments);

    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
});
// ✅ GET PENDING STUDENTS
router.get("/pending", async (req, res) => {
    try {
        const { search, department } = req.query;

        let filter = {
            status: "confirmed"
        };

        // 🔍 SEARCH SUPPORT
        if (search) {
            filter.$or = [
                { fullName: new RegExp(search, "i") },
                { department: new RegExp(search, "i") },
                { "rawData.regNo": new RegExp(search, "i") }
            ];
        }

        // 🏫 DEPARTMENT FILTER
        if (department && department !== "ALL") {
            filter.department = new RegExp(department, "i");
        }

        const students = await Admission.find(filter);

        const result = [];

        for (let student of students) {
            const payments = await Payment.find({ studentId: student._id });

            const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

            const raw = student.rawData || {};
            // TOTAL FEES
const tuition = Number(raw.feeTuition) || 0;
const books = Number(raw.feeBooks) || 0;
const admission = Number(raw.feeAdmission) || 0;
const hostel = Number(raw.feeHostel) || 0;
const bus = Number(raw.feeBus) || 0;

const totalFee = tuition + books + admission + hostel + bus;

// CATEGORY-WISE PAID
let paidTuition = 0;
let paidHostelBus = 0;
let paidBooks = 0;   // ✅ ADD THIS
payments.forEach(p => {
    if (p.category === "Tuition Fee") paidTuition += p.amount;
    if (p.category === "Hostel/Bus Fee") paidHostelBus += p.amount;
     if (p.category === "Books Fee") paidBooks += p.amount;
});

// PENDING CALCULATION
const pendingTuition = tuition - paidTuition;
const pendingHostelBus = (hostel + bus) - paidHostelBus;
const pendingBooks = books - paidBooks;   // ✅ ADD THIS
const balance = totalFee - totalPaid;
           
            if (balance > 0) {
                result.push({
    ...student._doc,
    totalFee,
    totalPaid,
    balance,
    pendingTuition,
    pendingHostelBus,
    pendingBooks 
});
            }
        }

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: "Error fetching pending students" });
    }
});
module.exports = router;