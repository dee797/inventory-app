const { Router } = require("express");
const raceController = require("../controllers/raceController");
const raceRouter = Router();

raceRouter.get("/", raceController.getAllRaces);

raceRouter.get("/add", raceController.getAddChar);
raceRouter.post("/add", raceController.postAddChar);

raceRouter.get("/:race", raceController.getRace);
raceRouter.get("/:race/update", raceController.getCharUpdate);
raceRouter.post("/:race/update", raceController.postCharUpdate);

raceRouter.post("/:race/delete", raceController.postCharDelete);

module.exports = raceRouter;