const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
    name: String,
    staffId: String,
    department: String,
    email: String,
    mobile: String,
    aadhar: String,
    pan: String,
    dob: String,
    doj: String,
    religion: String,
    community: String,
    blood: String,
    address: String,

    ugDegree: String,
    ugSpec: String,
    pgDegree: String,
    pgSpec: String,
    phd: String,

    photo: String,

    status: {
        type: String,
        default: "pending"   // pending → sent → confirmed
    },

    approvalStatus: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Staff", staffSchema);