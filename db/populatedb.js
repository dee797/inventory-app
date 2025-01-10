require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS race (
  name PRIMARY KEY
);

INSERT INTO race (name) 
VALUES
  ('Elf'),
  ('Man'),
  ('Hobbit');

CREATE TABLE IF NOT EXISTS character (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 20 )
  race REFERENCES race (name)
  birth VARCHAR ( 20 )
  death VARCHAR ( 20 )
  gender VARCHAR ( 20 )
  realm VARCHAR ( 20 )
)
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.CON,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();