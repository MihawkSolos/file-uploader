const { Client } = require("pg");

const SQL = `

`

async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: "postgresql://chaos:Uchiha0603@localhost:5432/figures", //change
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  }
  
  main();