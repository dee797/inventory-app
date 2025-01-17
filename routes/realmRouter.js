const { Router } = require("express");
const realmController = require("../controllers/realmController");
const realmRouter = Router();


realmRouter.get("/", realmController.getAllRealms);

realmRouter.get("/add", realmController.getAddRealm);
realmRouter.post("/add", realmController.postAddRealm);

realmRouter.get("/:id/update", realmController.getUpdateRealm);
realmRouter.post("/:id/update", realmController.postUpdateRealm);

realmRouter.post("/:id/delete", realmController.postDeleteRealm);

module.exports = realmRouter;