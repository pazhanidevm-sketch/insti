const express = require("express");
const router = express.Router();
const Intake = require("../models/Intake");


// ✅ ADD / UPDATE INTAKE
router.post("/set", async (req, res) => {
    try {
        const { category, department, totalSeats } = req.body;

        // check if already exists
        let intake = await Intake.findOne({ category, department });

        if (intake) {
            intake.totalSeats = totalSeats;
            await intake.save();
        } else {
            intake = new Intake({ category, department, totalSeats });
            await intake.save();
        }

        res.json({ message: "Intake saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving intake" });
    }
});


// ✅ GET ALL INTAKES (FILTER BY CATEGORY)
router.get("/:category", async (req, res) => {
    try {
        const intakes = await Intake.find({ category: req.params.category });
        res.json(intakes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching intake" });
    }
});
router.get("/analysis/:category", async (req, res) => {
    try {
        const category = req.params.category;

        const intakes = await Intake.find({ category });

        const Admission = require("../models/Admission");

        let result = [];

        for (let intake of intakes) {
            const filled = await Admission.countDocuments({
                category,
                department: intake.department,
                status:{ $in: ["sent", "sent_to_principal", "confirmed"] }
            });

            result.push({
                department: intake.department,
                totalSeats: intake.totalSeats,
                filledSeats: filled,
                remainingSeats: intake.totalSeats - filled
            });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: "Error generating analysis" });
    }
});
module.exports = router;