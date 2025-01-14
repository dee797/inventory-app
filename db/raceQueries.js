const pool = require("./pool");

async function getAllRaces() {
  const { rows } = await pool.query("SELECT * FROM race");
  return rows;
}

module.exports = {
    getAllRaces,
}
