const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name, description, and user option of the slash command
module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-pogocode")
    .setDescription("Tag a friend to get their Pokemong Go friend code!")
    .addUserOption((option) =>
      option
        .setName("friend")
        .setDescription("Tag your friend (they won't get notified)")
    ),
  // async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to true to hide the reply from other users.
    await interaction.deferReply({ ephemeral: true });

    // Get the user ID, username, and discriminator of the tagged user from the interaction
    const userId = await interaction.options.getUser("friend").id;
    const username = await interaction.options.getUser("friend").username;
    const discriminator = await interaction.options.getUser("friend")
      .discriminator;

    // Create a handle string from the username and discriminator
    const handle = `${username}#${discriminator}`;

    // Find the user record in the database
    const friendcode = await User.findOne({ where: { handle: handle } });

    if (username && discriminator) {
      try {
        // If the user has a friend code, edit the reply with their friend code
        if (friendcode.get("friend_code") !== null) {
          return await interaction.editReply({
            content: `${friendcode.get("friend_code")}`,
            ephemeral: false,
          });
        }
        // If the user does not have a friend code, edit the reply with a message indicating so
        return await interaction.editReply({
          content: `No Pokemon Go friend code found for <@${userId}> <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // If a user was not tagged, edit the reply with a message asking the user to try again
      await interaction.editReply({
        content: `Please try the command again and tag a user`,
        ephemeral: true,
      });
    }
  },
};
