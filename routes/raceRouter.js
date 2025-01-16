const { Router } = require("express");
const raceController = require("../controllers/raceController");
const raceRouter = Router();


raceRouter.get("/", raceController.getAllRaces);

raceRouter.get("/add", raceController.getAddRace);
raceRouter.post("/add", raceController.postAddRace);

raceRouter.get("/:id/update", raceController.getUpdateRace);
raceRouter.post("/:id/update", raceController.postUpdateRace);

raceRouter.post("/:id/delete", raceController.postDeleteRace);

module.exports = raceRouter;