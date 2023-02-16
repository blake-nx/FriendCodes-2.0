const db = require("../db/db-connect.js");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    db.sync({ force: true });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
