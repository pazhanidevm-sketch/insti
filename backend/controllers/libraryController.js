const LibraryBook = require("../models/LibraryBook");
const LibraryPlacement = require("../models/LibraryPlacement");
const LibraryIssue = require("../models/LibraryIssue");
const LibraryStaffIssue = require("../models/LibraryStaffIssue");

// GET ALL BOOKS + SEARCH

const getBooks = async (req, res) => {
    try {

        const search = req.query.search || "";

        const books = await LibraryBook.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { isbaNo: { $regex: search, $options: "i" } },
                { barcode: { $regex: search, $options: "i" } }
            ]
        });

        res.json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching books"
        });

    }
};

// ADD BOOK

const addBook = async (req, res) => {

    try {

        const book = new LibraryBook(req.body);

        await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book
        });

    } catch (error) {

    console.error(error);

    res.status(500).json({
        message: "Error adding book"
    });

}

};

// GET PLACEMENTS

const getPlacements = async (req, res) => {

    try {

        const search =
            req.query.search || "";

        const placements =
            await LibraryPlacement.find({

                $or: [
                    {
                        title: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        placedIn: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            });

        res.json(placements);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error fetching placements"
        });
    }
};


// ADD PLACEMENT

const addPlacement = async (req, res) => {

    try {

        const placement =
            new LibraryPlacement(req.body);

        await placement.save();

        res.status(201).json({
            message:
                "Position added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Error adding position"
        });
    }
};
const getIssues = async (req,res)=>{

    try{

        const search =
            req.query.search || "";

        const issues =
            await LibraryIssue.find({

                returned:false,

                $or:[
                    {
                        studentName:{
                            $regex:search,
                            $options:"i"
                        }
                    },
                    {
                        title:{
                            $regex:search,
                            $options:"i"
                        }
                    },
                    {
                        regNo:{
                            $regex:search,
                            $options:"i"
                        }
                    }
                ]
            });

        res.json(issues);

    }catch(error){

        res.status(500).json({
            message:"Error fetching issues"
        });

    }
};
const addIssue = async (req,res)=>{

    try{

        const issue =
            new LibraryIssue(req.body);

        await issue.save();

        res.status(201).json({
            message:"Book issued successfully"
        });

    }catch(error){

        res.status(500).json({
            message:"Error issuing book"
        });

    }
};
const checkInBook = async (req,res)=>{

    try{

        const issue =
            await LibraryIssue.findById(
                req.params.id
            );

        const today =
            new Date();

        issue.submittedOn = today;

        const due =
            new Date(issue.dueDate);

        let fine = 0;

        if(today > due){

            const diffDays =
                Math.ceil(
                    (today - due) /
                    (1000*60*60*24)
                );

            fine =
                diffDays * 2;
        }

        issue.fine = fine;

        issue.returned = true;

        await issue.save();

        res.json({
            message:
                `Book returned. Fine ₹${fine}`
        });

    }catch(error){

        res.status(500).json({
            message:
                "Check-in failed"
        });

    }
};
// STAFF ISSUES

const getStaffIssues = async (req,res)=>{

    try{

        const search =
        req.query.search || "";

        const issues =
        await LibraryStaffIssue.find({

            returned:false,

            $or:[
                {
                    staffName:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    title:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    staffId:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ]
        });

        res.json(issues);

    }catch(error){

        res.status(500).json({
            message:"Error fetching staff issues"
        });

    }
};

const addStaffIssue = async (req,res)=>{

    try{

        const issue =
        new LibraryStaffIssue(req.body);

        await issue.save();

        res.status(201).json({
            message:"Book issued to staff"
        });

    }catch(error){

        res.status(500).json({
            message:"Error issuing book"
        });

    }
};

const checkInStaffBook = async (req,res)=>{

    try{

        const issue =
        await LibraryStaffIssue.findById(
            req.params.id
        );

        const today =
        new Date();

        issue.submittedOn = today;

        const due =
        new Date(issue.dueDate);

        let fine = 0;

        if(today > due){

            const diffDays =
            Math.ceil(
                (today - due) /
                (1000*60*60*24)
            );

            fine = diffDays * 2;
        }

        issue.fine = fine;

        issue.returned = true;

        await issue.save();

        res.json({
            message:
            `Book returned. Fine ₹${fine}`
        });

    }catch(error){

        res.status(500).json({
            message:"Check-in failed"
        });

    }
};
module.exports = {
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
};