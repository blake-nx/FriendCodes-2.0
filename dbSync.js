const db = require("./db/db-connect.js");
// force the database to sync with the models in db-connect.js
// Warning: this will drop all tables and recreate them
return db.sync({ force: true });
