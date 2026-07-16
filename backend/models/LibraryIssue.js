const mongoose = require("mongoose");

const libraryIssueSchema = new mongoose.Schema({

    regNo: String,

    studentName: String,

    department: String,

    title: String,

    itemType: String,

    collectionCode: String,

    checkedOutOn: Date,

    dueDate: Date,

    callNumber: String,

    submittedOn: Date,

    fine: {
        type: Number,
        default: 0
    },

    returned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "LibraryIssue",
        libraryIssueSchema
    );