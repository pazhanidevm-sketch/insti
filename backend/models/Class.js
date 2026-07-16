const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

    year: String,

    semester: String,

    department: String,

    section: String,

    studentCount: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
mongoose.model("Class", classSchema);