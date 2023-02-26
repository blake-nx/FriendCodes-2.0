const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name and description of the slash command, and a string option for the new friend code
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-switchcode")
    .setDescription("Add your Nintendo Switch friend code for easy sharing!")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription(
          "Add your Nintendo Switch friend code! ex: SW-1234-5678-9012"
        )
        .setRequired(true)
    ),
  // async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to true to hide the reply from other users.
    await interaction.deferReply({ ephemeral: true });

    // Get the handle, user ID, and new friend code from the interaction options
    const code = interaction.options.getString("friendcode");
    const userId = interaction.user.id;
    const handle = interaction.user.tag;

    // Check if the user already exists in the database
    const userExists = await User.findOne({ where: { handle: handle } });

    try {
      // If the user does not exist, create a new user with the given friend code
      // else the user already exists, update their friend code in the database
      let addCode;
      if (!userExists) {
        addCode = await User.create({
          handle: handle,
          switch_code: code,
        });
      } else {
        addCode = await User.update(
          { switch_code: code },
          { where: { handle: handle } }
        );
      }

      // If the code was added or updated successfully, reply to the user with a success message
      if (addCode !== 0) {
        return await interaction.editReply({
          content:
            "Nintendo Switch friend code " +
            "`" +
            code +
            "`" +
            ` added for <@${userId}>!`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      // Return validation errors if the friend code is not unique or is not in the correct format
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.editReply({
          content:
            `Nintendo Switch friend code for <@${userId}> already exists! Try ` +
            "`" +
            "/update-switchcode" +
            "`" +
            " to change your code or " +
            "`" +
            "/delete-switchcode" +
            "`" +
            "to remove it",
          ephemeral: true,
        });
      } else if (error.errors[0].type === "Validation error") {
        return interaction.editReply({
          content: `${error.errors[0].message}. Please try again <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      } else {
        return interaction.editReply({
          content: `Whoops! Something went wrong with adding your code. Please try again <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      }
    }
  },
};
