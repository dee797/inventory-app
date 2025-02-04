require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();
const raceRouter = require("./routes/raceRouter");
const charRouter = require("./routes/charRouter");
const realmRouter = require("./routes/realmRouter");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use("/characters", charRouter);
app.use("/races", raceRouter);
app.use("/realms", realmRouter);
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