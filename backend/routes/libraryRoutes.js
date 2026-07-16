const express = require("express");
const router = express.Router();

const {
    getBooks,
    addBook,

    getPlacements,
    addPlacement,

    getIssues,
    addIssue,
    checkInBook,

    getStaffIssues,
    addStaffIssue,
    checkInStaffBook

} = require("../controllers/libraryController");

router.get("/books", getBooks);

router.post("/books", addBook);

router.get("/placements", getPlacements);

router.post("/placements", addPlacement);

router.get("/issues", getIssues);

router.post("/issues", addIssue);

router.put("/issues/:id/checkin", checkInBook);

router.get("/staff-issues", getStaffIssues);

router.post("/staff-issues", addStaffIssue);

router.put("/staff-issues/:id/checkin", checkInStaffBook);

module.exports = router;