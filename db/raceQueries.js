const pool = require("./pool");

async function getAllRaces() {
  const { rows } = await pool.query("SELECT * FROM race ORDER BY name");
  return rows;
}

async function getRace(name) {
  const { rows } = await pool.query("SELECT * FROM race WHERE race.name = $1", [name]);
    return rows[0];
}

async function getCharsOfRace(name) {
  const { rows } = await pool.query("SELECT * FROM character WHERE character.race = $1", [name]);
  return rows;
}

async function addRace(name) {
  await pool.query("INSERT INTO race (name) VALUES ($1)", [name]);
}

async function updateRace(oldName, newName) {
  await pool.query("UPDATE race SET name = $2 WHERE race.name = $1", [oldName, newName]);
}

async function deleteRace(name) {
    await pool.query("DELETE FROM race WHERE race.name = $1", [name]);
}

module.exports = {
    getAllRaces,
    getRace,
    getCharsOfRace,
    addRace,
    updateRace,
    deleteRace
}
