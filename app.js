require("dotenv").config();
const express = require("express");
const app = express();
const raceRouter = require("./routes/raceRouter");
const charRouter = require("./routes/charRouter");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use("/characters", charRouter);
app.use("/races", raceRouter);
app.use("/", (req, res) => {
    res.render("index");
});

app.use((req, res, next) => {
    res.status(404);
    res.send("404 Error - Not Found");
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT);