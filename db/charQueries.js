const pool = require("./pool");

async function getAllChars() {
  const { rows } = await pool.query("SELECT * FROM character ORDER BY id");
  return rows;
}

async function getChar(id) {
  const { rows } = await pool.query("SELECT * FROM character WHERE character.id = $1", [id]);
  return rows[0];
}

async function addChar({name, race, birth, death, gender, realm}) {
  await pool.query(`INSERT INTO character (name, race, birth, death, gender, realm) 
                    VALUES ($1, $2, $3, $4, $5, $6)`, [name, race, birth, death, gender, realm]);
}


async function updateChar(id, {name, race, birth, death, gender, realm}) {
  await pool.query(`UPDATE character 
                    SET name = $2, race = $3, birth = $4, death = $5, gender = $6, realm = $7
                    WHERE character.id = $1`, [id, name, race, birth, death, gender, realm]);
}

async function deleteChar(id) {
  await pool.query(`DELETE FROM character WHERE character.id = $1`, [id]);
}


module.exports = {
    getAllChars,
    getChar,
    addChar,
    updateChar,
    deleteChar
}

