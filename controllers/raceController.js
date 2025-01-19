const db = require("../db/raceQueries");
const CustomError = require("../errors/CustomError")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


const getAllRaces = asyncHandler(async (req, res) => {
    const races = await db.getAllRaces();
    res.app.locals.races = races;

    res.render("raceViews/races", {
      title: "List of Races",
      races: races,
    });
});


const getAddRace = (req, res) => {
  res.render("raceViews/addRace", {
    title: "Add Race"
  });
};


const lengthErr = "must be between 1 and 50 characters.";

const validateChar = [
  body("name").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Name ${lengthErr}`)
];


const postAddRace = [
  validateChar,
  (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).render("raceViews/addRace", {
        title: "Add Race",
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingRace= await db.getRace(name);

    if (existingRace && existingRace.name === name) {
      return res.status(400).render("raceViews/addRace", {
        title: "Add Race",
        errors: [{ msg: "Error: A race with that name already exists." }]
      });
    }
  
    await db.addRace(name);
    res.redirect("/races");
  })
];



const getUpdateRace = asyncHandler(async (req, res) => {
    const race = await db.getRace(req.params.id);

    if (!race) {
      throw new CustomError(404, "Race not found");
    }

    res.app.locals.race = race;
    res.render("raceViews/updateRace", {
      title: "Update Race",
      race: race
    });  
});
  

const postUpdateRace = [
  validateChar,
  (req, res, next) => {
      const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("raceViews/updateRace", {
        title: "Update Race",
        race: res.app.locals.race,
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const existingRace = await db.getRace(name);

    if (existingRace && existingRace.name === name) {
      return res.status(400).render("raceViews/updateRace", {
        title: "Update Race",
        race: res.app.locals.race,
        errors: [{ msg: "Error: A race with that name already exists." }]
      });
    }
 
    await db.updateRace(req.params.id, name);
    res.redirect("/races");
  })
];


const postDeleteRace = asyncHandler(async (req, res) => {
    const chars = await db.getCharsOfRace(req.params.id);

    if (chars.length > 0) {
      return res.status(400).render("raceViews/races", {
        title: "List of Races",
        realms: res.app.locals.races,
        error: "Error: cannot delete a race if there is at least one character that has that race"
      });    
    }

    await db.deleteRace(req.params.id);
    res.redirect("/races");
});


module.exports = { getAllRaces, 
                   getAddRace, 
                   postAddRace, 
                   getUpdateRace, 
                   postUpdateRace, 
                   postDeleteRace
                  }