const db = require("../db/db-connect.js");

// This script exports an object with an event listener function that is
// triggered once when the Discord bot has finished logging in.
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const { count, rows } = await db.findAndCountAll({
      attributes: ["handle"],
    });
    console.log("# of friend codes added:", count);
  },
};
