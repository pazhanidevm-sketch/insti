const mongoose = require("mongoose");

const staffLoginSchema = new mongoose.Schema({

    staffId: String,

    staffName: String,

    username: String,

    password: String,

    department: String,

    status: {
        type: String,
        default: "active"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
    mongoose.model(
        "StaffLogin",
        staffLoginSchema
    );