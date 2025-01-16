require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();
//const raceRouter = require("./routes/raceRouter");
const charRouter = require("./routes/charRouter");
const racedb = require("./db/raceQueries");
const realmdb = require("./db/realmQueries");
const asyncHandler = require("express-async-handler");
const CustomError = require("./errors/CustomError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const getRaces = asyncHandler(async() => {
    try {
        const rows = await racedb.getAllRaces();
        app.locals.races = rows;
    } catch {
        throw new CustomError(500, "Internal server error");
    }
});
getRaces();

const getRealms = asyncHandler(async() => {
    try {
        const rows = await realmdb.getAllRealms();
        app.locals.realms = rows;
    } catch {
        throw new CustomError(500, "Internal server error");
    }
});
getRealms();



app.use("/characters", charRouter);
//app.use("/races", raceRouter);
app.get("/", (req, res) => {
    res.render("index");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message || "Internal server error");
});

app.all('/*', (req, res, next) => {
    res.status(404).send("404 - Not found");
    ;
});



const PORT = process.env.PORT || 3000;
app.listen(PORT);