const mongoose = require("mongoose");

const libraryPlacementSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    placedIn: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model(
        "LibraryPlacement",
        libraryPlacementSchema
    );