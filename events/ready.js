const db = require("../db/db-connect.js");
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
