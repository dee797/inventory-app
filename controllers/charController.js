//const db = require("../db/queries");
const CustomError = require("../errors/CustomError")
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


const getAllChars = asyncHandler(async (req, res) => {
    const chars = await db.getAllChars();

    if (!chars) {
        throw new CustomError(500, "Internal server error");
    }

    res.render("characters", {
        title: "Character list",
        chars: chars,
    });
});


const getAddChar = (req, res) => {
  res.render("addChar", {
    title: "Add Character",
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
    const added = await db.addUser({ name, race, birth, death, gender,realm });

    if (!added) {
      throw new CustomError(500, "Internal server error");
    }

    res.redirect("/characters");
  }
];



const getCharUpdate = (req, res) => {
    const char = db.getChar(req.params.id);

    if (!char) {
        throw new CustomError(404, "Character not found");
    }

    res.render("updateChar", {
      title: "Update Character",
      char: char,
    });
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
      const updated = await db.updateUser({ name, race, birth, death, gender, realm });

      if (!updated) {
        throw new CustomError(500, "Internal server error");
      }

      res.redirect("/characters");
    }
];



const postCharDelete = async (req, res) => {
    const deleted = await db.deleteChar(req.params.id);

    if (!deleted) {
      throw new CustomError(500, "Internal server error");
    }

    res.redirect("/characters");
};


module.exports = { getAllChars, 
                   getAddChar, 
                   postAddChar, 
                   getCharUpdate, 
                   postCharUpdate, 
                   postCharDelete
                  }