const mongoose = require("mongoose");

const classCreationSchema =
new mongoose.Schema({

    department: String,

    academicYear: String,

    endDate: Date,

    enabled: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports =
mongoose.model(
    "ClassCreationSetting",
    classCreationSchema
);