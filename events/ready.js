const db = require("../db/db-connect.js");
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    db.sync();
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
