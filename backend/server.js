require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const admissionRoutes = require("./routes/admissionRoutes");
const intakeRoutes = require("./routes/intakeRoutes");
const staffRoutes = require("./routes/staffRoutes");
const cashierRoutes = require("./routes/cashierRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const staffLoginRoutes = require("./routes/staffLoginRoutes");
const classCreationRoutes = require("./routes/classCreationRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/admissions", admissionRoutes);
app.use("/api/intake", intakeRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/staff-logins", staffLoginRoutes);
app.use("/api/class-creation", classCreationRoutes);
app.use("/api/classes", classRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});