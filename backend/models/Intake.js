const mongoose = require("mongoose");

const intakeSchema = new mongoose.Schema({
    category: String,      // UG / PG
    department: String,    // CSE, ECE, etc
    totalSeats: Number
});

module.exports = mongoose.model("Intake", intakeSchema);