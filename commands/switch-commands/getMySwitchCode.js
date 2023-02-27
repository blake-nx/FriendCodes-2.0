const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name and description of the slash command
module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-switchcode")
    .setDescription("This posts your Nintendo Switch friend code!"),
  // async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to false so others can see the code.
    await interaction.deferReply({ ephemeral: false });

    // Get the handle and user ID of the interaction user
    const handle = interaction.user.tag;
    const userId = interaction.user.id;

    try {
      // Find the user record in the database
      const switchcode = await User.findOne({ where: { handle: handle } });

      // If the user has a friend code, edit the reply with their friend code
      if (switchcode !== null && switchcode.get("switch_code") !== null) {
        return await interaction.editReply({
          content: `${switchcode.get("switch_code")}`,
          ephemeral: false,
        });
      }

      // If the user does not have a friend code, edit the reply with a message indicating so
      return await interaction.editReply({
        content: `No Nintendo Switch friend code found for <@${userId}> <:ttar:711069119184764928>`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
