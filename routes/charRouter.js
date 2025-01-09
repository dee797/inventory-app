const { Router } = require("express");
const charController = require("../controllers/charController");
const charRouter = Router();


charRouter.get("/", charController.getAllChars);

charRouter.get("/add", charController.getAddChar);
charRouter.post("/add", charController.postAddChar);

charRouter.get("/:id", charController.getChar);
charRouter.get("/:id/update", charController.getCharUpdate);
charRouter.post("/:id/update", charController.postCharUpdate);

charRouter.post("/:id/delete", charController.postCharDelete);

module.exports = charRouter;