const mongoose = require("mongoose");

const libraryBookSchema = new mongoose.Schema({
    isbaNo: {
        type: String,
        required: true
    },

    issbaNo: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    placeOfPublication: String,

    publicationName: String,

    publicationDate: Date,

    totalPages: Number,

    collectionCode: String,

    dateAcquired: Date,

    itemType: String,

    barcode: String,

    materialType: {
        type: String
        // Book / Journal / Magazine
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("LibraryBook", libraryBookSchema);