const express = require("express");
const router = express.Router();

const AcademicCalendar = require("../models/AcademicCalendar");
router.post("/save", async (req, res) => {
    try {

        const { startDate, endDate, events } = req.body;

        await AcademicCalendar.deleteMany({});

        const calendar = new AcademicCalendar({
            startDate,
            endDate,
            events
        });

        await calendar.save();

        res.json({
            success: true,
            message: "Academic calendar updated successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});
router.get("/latest", async (req, res) => {
    try {

        const calendar = await AcademicCalendar
            .findOne()
            .sort({ updatedAt: -1 });

        res.json(calendar);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });
    }
});
module.exports = router;