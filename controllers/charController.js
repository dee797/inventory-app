const db = require("../db/queries");
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
    races: res.app.locals.races || ["Elf", "Man", "Hobbit"],
  });
};


const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

const validateChar = [
  body("name").trim()
    .isAlpha().withMessage(`Name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Name ${lengthErr}`),

  body("birth")
    .optional({values: "falsy"})
    .trim()
    .escape()
    .isLength({ min: 1, max: 20 }).withMessage(`Birthdate ${lengthErr}`),

  body("death")
    .optional({values: "falsy"})
    .trim()
    .escape()
    .isLength({ min: 1, max: 20 }).withMessage(`Date of death ${lengthErr}`),

  body("realm")
    .optional({values: "falsy"})
    .trim()
    .isAlpha().withMessage(`Realm ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Realm ${lengthErr}`),
    ,
];

const postAddChar = [
  validateChar,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("addChar", {
        title: "Add Character",
        errors: errors.array(),
      });
    }

    const { name, race, birth, death, gender, realm } = req.body;

    try {
      await db.addUser({ name, race, birth, death, gender, realm });
      res.redirect("/characters");
    } catch {
      throw new CustomError(500, "Internal server error");
    }
  }
];



const getCharUpdate = async (req, res) => {
    
  try {
    const char = await db.getChar(req.params.id);
    res.render("updateChar", {
      title: "Update Character",
      char: char,
      races: res.app.locals.races || ["Elf", "Man", "Hobbit"],
    });
  } catch {
    throw new CustomError(404, "Character not found");
  }    
};
  

const postCharUpdate = [
    validateChar,
    async (req, res) => {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).render("updateChar", {
          title: "Update Character",
          char: char,
          errors: errors.array(),
        });
      }
      

      const { name, race, birth, death, gender, realm } = req.body;

      try {
        await db.updateUser(req.params.id, { name, race, birth, death, gender, realm });
        res.redirect("/characters");
      } catch {
        throw new CustomError(500, "Internal server error");
      }
    }
];



const postCharDelete = async (req, res) => {
    try {
      await db.deleteChar(req.params.id);
      res.redirect("/characters");
    } catch {
      throw new CustomError(500, "Internal server error");
    }
};


module.exports = { getAllChars, 
                   getAddChar, 
                   postAddChar, 
                   getCharUpdate, 
                   postCharUpdate, 
                   postCharDelete
                  }