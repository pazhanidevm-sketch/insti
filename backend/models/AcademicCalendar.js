const mongoose = require("mongoose");

const AcademicCalendarSchema = new mongoose.Schema({
    startDate: String,
    endDate: String,

    events: [
        {
            date: String,
            title: String
        }
    ],

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "AcademicCalendar",
    AcademicCalendarSchema
);