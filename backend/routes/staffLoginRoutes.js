const express = require("express");
const router = express.Router();

const StaffLogin =
    require("../models/StaffLogin");


// CREATE LOGIN
router.post("/", async (req, res) => {

    try {
       const existingStaff =
    await StaffLogin.findOne({
        staffId: req.body.staffId
    });

if (existingStaff) {

    return res.status(400).json({
        message: "Login already exists"
    });

}


const existingUsername =
    await StaffLogin.findOne({
        username: req.body.username
    });

if (existingUsername) {

    return res.status(400).json({
        message: "Username already taken"
    });

}
       

        const login =
            new StaffLogin(req.body);

        await login.save();

        res.json({
            message:
                "Login created"
        });

    } catch (err) {

        res.status(500).json({
            message:
                "Server error"
        });

    }

});


// GET LOGINS BY DEPARTMENT
router.get("/", async (req, res) => {

    try {

        const { department } =
            req.query;

        const data =
            await StaffLogin
                .find({ department })
                .sort({ staffName: 1 });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            message:
                "Server error"
        });

    }

});
// UPDATE LOGIN STATUS
router.put("/status/:id", async (req, res) => {

    try {

        const { status } = req.body;

        await StaffLogin.findByIdAndUpdate(
            req.params.id,
            { status }
        );

        res.json({
            message: "Status updated"
        });

    } catch (err) {

        res.status(500).json({
            message: "Server error"
        });

    }

});
// RESET PASSWORD
router.put("/reset/:id", async (req, res) => {

    try {

        const { password } = req.body;

        await StaffLogin.findByIdAndUpdate(
            req.params.id,
            { password }
        );

        res.json({
            message: "Password updated"
        });

    } catch (err) {

        res.status(500).json({
            message: "Server error"
        });

    }

});
module.exports = router;