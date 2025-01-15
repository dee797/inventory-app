const pool = require("./pool");

async function getAllRealms() {
  const { rows } = await pool.query("SELECT * FROM realm");
  return rows;
}

module.exports = {
    getAllRealms,
}
