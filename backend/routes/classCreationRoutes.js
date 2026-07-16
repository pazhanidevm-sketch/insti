const express = require("express");
const router = express.Router();

const ClassCreationSetting =
require("../models/ClassCreationSetting");


// SAVE SETTINGS
router.post("/", async (req, res) => {

    try {

        await ClassCreationSetting.deleteMany();

        const setting =
            new ClassCreationSetting(req.body);

        await setting.save();

        res.json({
            message:
            "Class creation activated"
        });

    }

    catch {

        res.status(500).json({
            message:
            "Server error"
        });

    }

});


// GET CURRENT SETTINGS
router.get("/", async (req, res) => {

    try {

        const setting =
            await ClassCreationSetting.findOne();

        res.json(setting);

    }

    catch {

        res.status(500).json({
            message:
            "Server error"
        });

    }

});

module.exports = router;