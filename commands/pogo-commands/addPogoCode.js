const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Format friend code before saving to database
function formatFriendCode(code) {
  // Remove dashes and spaces from the code
  const cleanedCode = code.replace(/[-\s]/g, "");

  // Split the cleaned string into groups of 4 characters each
  const groups = cleanedCode.match(/.{1,4}/g);

  // Join the groups with spaces and return the formatted string e.g. 1234 5678 9012.
  return groups.join(" ");
}

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name, description, and option of the slash command
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-pogocode")
    .setDescription("Add your Pokemon Go friend code for easy sharing!")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription("Add your Pokemon Go friend code!")
        .setRequired(true)
    ),
  // an async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to true to hide the reply from other users.
    await interaction.deferReply({ ephemeral: true });

    // Get the friend code, user ID, and user tag from the interaction
    const code = interaction.options.getString("friendcode");
    const userId = interaction.user.id;
    const handle = interaction.user.tag;

    // Check if the user exists in the database
    const userExists = await User.findOne({ where: { handle: handle } });

    try {
      let addCode;
      // If the user does not exist, create a new user record in the database with the friend code.
      // else the user already exists, update their friend code in the database
      if (!userExists) {
        addCode = await User.create({
          handle: handle,
          friend_code: formatFriendCode(code),
        });
      } else {
        addCode = await User.update(
          { friend_code: formatFriendCode(code) },
          { where: { handle: handle } }
        );
      }

      // If the add/update operation was successful, edit the reply with a success message
      if (addCode !== 0) {
        return await interaction.editReply({
          content:
            "Pokemon Go friend code " +
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
            `Pokemon Go friend code for <@${userId}> already exists! Try ` +
            "`" +
            "/update-pogocode" +
            "`" +
            " to change your code or " +
            "`" +
            "/delete-pogocode" +
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
