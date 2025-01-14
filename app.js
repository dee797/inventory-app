require("dotenv").config();
const express = require("express");
const app = express();
const raceRouter = require("./routes/raceRouter");
const charRouter = require("./routes/charRouter");
const db = require("./db/raceQueries");
const asyncHandler = require("express-async-handler");
const CustomError = require("./errors/CustomError");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const getRaces = asyncHandler(async() => {
    try {
        const rows = await db.getAllRaces();
        app.locals.races = rows;
    } catch {
        throw new CustomError(500, "Internal server error");
    }
});
getRaces();


app.use("/characters", charRouter);
app.use("/races", raceRouter);
app.get("/", (req, res) => {
    res.render("index");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

app.all('/*', (req, res, next) => {
    res.status(404).send("404 - Not found");
    ;
});



const PORT = process.env.PORT || 3000;
app.listen(PORT);