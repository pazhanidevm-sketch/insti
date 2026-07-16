const mongoose = require("mongoose");

const libraryStaffIssueSchema = new mongoose.Schema({

    staffId: String,

    staffName: String,

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

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "LibraryStaffIssue",
    libraryStaffIssueSchema
);