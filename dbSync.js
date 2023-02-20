const db = require("./db/db-connect.js");

return db.sync({ force: true });
