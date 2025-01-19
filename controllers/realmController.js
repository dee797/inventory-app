const db = require("../db/realmQueries");
const CustomError = require("../errors/CustomError")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


const getAllRealms = asyncHandler(async (req, res) => {
    const realms = await db.getAllRealms();
    res.app.locals.realms = realms;

    res.render("realmViews/realms", {
      title: "List of Realms",
      realms: realms
    });
});


const getAddRealm = (req, res) => {
  res.render("realmViews/addRealm", {
    title: "Add Realm"
  });
};


const lengthErr = "must be between 1 and 50 characters.";

const validateChar = [
  body("name").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Name ${lengthErr}`)
];


const postAddRealm = [
  validateChar,
  (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).render("realmViews/addRealm", {
        title: "Add Realm",
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingRealm = await db.getRealm(name);

    if (existingRealm && existingRealm.name === name) {
      return res.status(400).render("realmViews/addRealm", {
        title: "Add Realm",
        errors: [{ msg: "Error: A realm with that name already exists." }]
      });
    }

    await db.addRealm(name);
    res.redirect("/realms");
  })
];



const getUpdateRealm = asyncHandler(async (req, res) => {
    const realm = await db.getRealm(req.params.id);

    if (!realm) {
      throw new CustomError(404, "Realm not found");
    }

    res.app.locals.realm = realm;
    res.render("realmViews/updateRealm", {
      title: "Update Realm",
      realm: realm
    });  
});
  

const postUpdateRealm = [
  validateChar,
  (req, res, next) => {
      const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("realmViews/updateRealm", {
        title: "Update Realm",
        realm: res.app.locals.realm,
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingRealm = await db.getRealm(name);

    if (existingRealm && existingRealm.name === name) {
      return res.status(400).render("realmViews/updateRealm", {
        title: "Update Realm",
        realm: res.app.locals.realm,
        errors: [{ msg: "Error: A realm with that name already exists." }]
      });
    }
 
    await db.updateRealm(req.params.id, name);
    res.redirect("/realms");
  })
];


const postDeleteRealm = asyncHandler(async (req, res) => {
    const chars = await db.getCharsOfRealm(req.params.id);

    if (chars.length > 0) {
      return res.status(400).render("realmViews/realms", {
        title: "List of Realms",
        realms: res.app.locals.realms,
        error: "Error: cannot delete a realm if there is at least one character from that realm"
      });
    }

    await db.deleteRealm(req.params.id);
    res.redirect("/realms");
});


module.exports = { getAllRealms, 
                   getAddRealm, 
                   postAddRealm, 
                   getUpdateRealm, 
                   postUpdateRealm, 
                   postDeleteRealm
                  }