const db = require("../db/charQueries");
const racedb = require("../db/raceQueries");
const realmdb = require("../db/realmQueries");
const CustomError = require("../errors/CustomError")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


const getAllChars = asyncHandler(async (req, res) => {
    const chars = await db.getAllChars();
    res.render("charViews/characters", {
      title: "Character List",
      chars: chars,
    });
});


const getAddChar = asyncHandler(async (req, res) => {
  const races = await racedb.getAllRaces();
  const realms = await realmdb.getAllRealms();

  res.render("charViews/addChar", {
    title: "Add Character",
    races: races || [{name: "Elf"}, {name: "Man"}, {name: "Hobbit"}],
    realms: realms || [{name: "Rivendell"}, {name: "The Shire"}, {name: "Gondor"}]
  });
});


const lengthErr = "must be between 1 and 50 characters.";

const validateChar = [
  body("name").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Name ${lengthErr}`),

  body("birth")
    .optional({values: "falsy"})
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Birthdate ${lengthErr}`),

  body("death")
    .optional({values: "falsy"})
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Date of death ${lengthErr}`)
];


const postAddChar = [
  validateChar,
  (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).render("charViews/addChar", {
        title: "Add Character",
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name, race, birth, death, gender, realm } = req.body;
  
    await db.addChar({ name, race, birth, death, gender, realm });
    res.redirect("/characters");
  })
];



const getCharUpdate = asyncHandler(async (req, res) => {    
    const char = await db.getChar(parseInt(req.params.id));
    const races = await racedb.getAllRaces();
    const realms = await realmdb.getAllRealms();

    if (!char) {
      throw new CustomError(404, "Character not found");
    }

    res.char = char;
    res.render("charViews/updateChar", {
      title: "Update Character",
      char: char,
      races: races || [{name: "Elf"}, {name: "Man"}, {name: "Hobbit"}],
      realms: realms || [{name: "Rivendell"}, {name: "The Shire"}, {name: "Gondor"}]
    });   
});
  

const postCharUpdate = [
  validateChar,
  (req, res, next) => {
      const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("charViews/updateChar", {
        title: "Update Character",
        char: res.char,
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name, race, birth, death, gender, realm } = req.body;
  
    await db.updateChar(parseInt(req.params.id), { name, race, birth, death, gender, realm });
      res.redirect("/characters");
  })
];


const postCharDelete = asyncHandler(async (req, res) => {
    await db.deleteChar(parseInt(req.params.id));
    res.redirect("/characters");
});


module.exports = { getAllChars, 
                   getAddChar, 
                   postAddChar, 
                   getCharUpdate, 
                   postCharUpdate, 
                   postCharDelete
                  }