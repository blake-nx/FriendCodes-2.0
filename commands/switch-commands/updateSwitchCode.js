const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name and description of the slash command, and a string option for the new friend code
module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-switchcode")
    .setDescription("Update your Nintendo Switch friend code!")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription(
          "Add your updated Nintendo Switch friend code! ex: SW-1234-5678-9012"
        )
        .setRequired(true)
    ),
  // async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to true to hide the reply from other users.
    await interaction.deferReply({ ephemeral: true });

    // Get the handle, user ID, and new friend code from the interaction options
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const switchcode = interaction.options.getString("friendcode");

    try {
      // Update the user record in the database with the new friend code
      let updateCode = await User.update(
        { switch_code: switchcode },
        { where: { handle: handle } }
      );

      // If the update was successful, edit the reply with a success message
      if (updateCode !== 0) {
        return await interaction.editReply({
          content: `Nintendo Switch friend code updated for <@${userId}>!`,
          ephemeral: true,
        });
      }

      // If the update was not successful, edit the reply with an error message
      await interaction.editReply({
        content: `Something went wrong with adding your code. Friend code doesn't exist or there was an error with its formatting.`,
        ephemeral: true,
      });
    } catch (error) {
      // Catch any errors and log them to the console, then edit the reply with an error message
      console.log(error);
      return interaction.editReply({
        content: `${error.errors[0].message}. Please try again <:ttar:711069119184764928>`,
        ephemeral: true,
      });
    }
  },
};
