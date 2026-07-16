const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["UG", "PG"],
        required: true
    },

    fullName: String,
    department: String,
    phone: String,

    rawData: {
        type: Object,
        required: true
    },


    status: {
        type: String,
        enum: ["pending", "sent", "sent_to_principal", "confirmed"],
        default: "pending"
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, // ✅ FIX HERE (comma added)

    year: String,
    section: String,
   courseDuration: String,
});
module.exports = mongoose.model("Admission", admissionSchema);