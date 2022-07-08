const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../${ENV}.env`,
});
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};
<<<<<<< HEAD
console.log(process.env.DATABASE_URL);
// if (!process.env.PGDATABASE) {
//   throw new Error("PGDATABASE not set");
// }
=======
>>>>>>> 2165965af2e34b2b44d3bf1b139dc6a26f383a7c

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}
module.exports = new Pool();
