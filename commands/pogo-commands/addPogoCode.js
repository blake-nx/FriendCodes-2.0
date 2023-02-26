const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

function formatFriendCode(code) {
  // Remove dashes and spaces from the code
  const cleanedCode = code.replace(/[-\s]/g, "");

  // Split the cleaned string into groups of 4 characters each
  const groups = cleanedCode.match(/.{1,4}/g);

  // Join the groups with spaces and return the formatted string e.g. 1234 5678 9012.
  return groups.join(" ");
}

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
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const code = interaction.options.getString("friendcode");
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const userExists = await User.findOne({ where: { handle: handle } });
    let addCode;
    try {
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
