require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS race (
  name VARCHAR ( 75 ) PRIMARY KEY
);

INSERT INTO race (name) 
VALUES
  ('Elf'),
  ('Man'),
  ('Hobbit');

CREATE TABLE IF NOT EXISTS realm (
  name VARCHAR ( 75 ) PRIMARY KEY
);

INSERT INTO realm (name)
VALUES 
 ('Rivendell'),
 ('The Shire'),
 ('Gondor');


CREATE TABLE IF NOT EXISTS character (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 75 ),
  race VARCHAR ( 75 ) REFERENCES race (name),
  birth VARCHAR ( 75 ),
  death VARCHAR ( 75 ),
  gender VARCHAR ( 10 ),
  realm VARCHAR ( 75 ) REFERENCES realm (name)
);

INSERT INTO character (name, race, birth, death, gender, realm)
VALUES
  ('Bilbo Baggins', 'Hobbit', 'September 22, TA 2890', 'Unknown', 'Male', 'The Shire'),
  ('Elrond', 'Elf', 'FA 532', 'Still alive', 'Male', 'Rivendell'),
  ('Aragorn', 'Man', 'March 1, 2931', 'FO 120', 'Male', 'Gondor');
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