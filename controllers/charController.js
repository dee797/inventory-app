const db = require("../db/charQueries");
const CustomError = require("../errors/CustomError")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


const getAllChars = asyncHandler(async (req, res) => {
    try {
      const chars = await db.getAllChars();
      res.render("characters", {
        title: "Character List",
        chars: chars,
    });
    } catch {
      throw new CustomError(500, "Internal server error");
    } 
});


const getAddChar = (req, res) => {
  res.render("addChar", {
    title: "Add Character",
    races: req.app.locals.races || [{name: "Elf"}, {name: "Man"}, {name: "Hobbit"}],
    realms: req.app.locals.realms || [{name: "Rivendell"}, {name: "The Shire"}, {name: "Gondor"}]
  });
};


const lengthErr = "must be between 1 and 50 characters.";

const validateChar = [
  body("name").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Name ${lengthErr}`)
    .escape(),

  body("birth")
    .optional({values: "falsy"})
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Birthdate ${lengthErr}`)
    .escape(),

  body("death")
    .optional({values: "falsy"})
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Date of death ${lengthErr}`)
    .escape()
];


const postAddChar = [
  validateChar,
  (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).render("addChar", {
        title: "Add Character",
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name, race, birth, death, gender, realm } = req.body;
  
    try {
      await db.addChar({ name, race, birth, death, gender, realm });
      res.redirect("/characters");
    } catch {
      throw new CustomError(500, "Internal server error");
    }
  })
];



const getCharUpdate = asyncHandler(async (req, res) => {
    
  try {
    const char = await db.getChar(parseInt(req.params.id));
    res.char = char;
    res.render("updateChar", {
      title: "Update Character",
      char: char,
      races: req.app.locals.races || [{name: "Elf"}, {name: "Man"}, {name: "Hobbit"}],
      realms: req.app.locals.realms || [{name: "Rivendell"}, {name: "The Shire"}, {name: "Gondor"}]
    });
  } catch {
    throw new CustomError(404, "Character not found");
  }    
});
  

const postCharUpdate = [
  validateChar,
  (req, res, next) => {
      const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("updateChar", {
        title: "Update Character",
        char: res.char,
        errors: errors.array(),
      });
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { name, race, birth, death, gender, realm } = req.body;
  
    try {
      await db.updateChar(parseInt(req.params.id), { name, race, birth, death, gender, realm });
      res.redirect("/characters");
    } catch {
      throw new CustomError(500, "Internal server error");
    }
  })
];


const postCharDelete = asyncHandler(async (req, res) => {
    try {
      await db.deleteChar(parseInt(req.params.id));
      res.redirect("/characters");
    } catch {
      throw new CustomError(500, "Internal server error");
    }
});


module.exports = { getAllChars, 
                   getAddChar, 
                   postAddChar, 
                   getCharUpdate, 
                   postCharUpdate, 
                   postCharDelete
                  }