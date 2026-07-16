const express = require("express");
const router = express.Router();

const Class =
require("../models/Class");


// CREATE CLASS
router.post("/", async (req, res) => {

    try {

        const newClass =
        new Class(req.body);

        await newClass.save();

        res.json({
            message: "Class created successfully"
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// GET CLASSES BY DEPARTMENT
router.get("/", async (req, res) => {

    try {

        const department =
        req.query.department;


        const filter = {};

        if (department) {

            filter.department =
            department;

        }


        const classes =
        await Class.find(filter)
        .sort({ createdAt: -1 });


        res.json(classes);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            message:
            "Server error"
        });

    }

});
module.exports = router;