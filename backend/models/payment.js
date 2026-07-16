const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
        required: true
    },
    studentName: String,
    department: String,

    amount: Number,
    category: String,

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);