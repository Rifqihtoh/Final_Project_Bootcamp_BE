const postgresql = require("../utils/postgre.util");

(async () => {
  try {
    const query = `CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL
    );`;

    await postgresql.query(query);

    console.log("success create table");
  } catch (error) {
    console.log(error);
  }
})();
