require("dotenv").config();
const express = require("express");
const app = express();
const raceRouter = require("./routes/raceRouter");
const charRouter = require("./routes/charRouter")

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use("/characters", charRouter)
app.use("/races", raceRouter);
app.use("/", (req, res) => {
    
});



const PORT = process.env.PORT || 3000;
app.listen(PORT);