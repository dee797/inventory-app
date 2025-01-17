const pool = require("./pool");

async function getAllRealms() {
  const { rows } = await pool.query("SELECT * FROM realm");
  return rows;
}

async function getRealm(name) {
  const { rows } = await pool.query("SELECT * FROM realm WHERE realm.name = $1", [name]);
    return rows[0];
}

async function getCharsOfRealm(name) {
  const { rows } = await pool.query("SELECT * FROM character WHERE character.realm = $1", [name]);
  return rows;
}

async function addRealm(name) {
  await pool.query("INSERT INTO realm (name) VALUES ($1)", [name]);
}

async function updateRealm(oldName, newName) {
  await pool.query("UPDATE realm SET name = $2 WHERE realm.name = $1", [oldName, newName]);
}

async function deleteRealm(name) {
    await pool.query("DELETE FROM realm WHERE realm.name = $1", [name]);
}


module.exports = {
    getAllRealms,
    getRealm,
    getCharsOfRealm,
    addRealm,
    updateRealm,
    deleteRealm
}
