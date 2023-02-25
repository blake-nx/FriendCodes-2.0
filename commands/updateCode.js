const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");

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
    .setName("updatecode")
    .setDescription("Update your friend code")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription("Add your updated friend code!")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const friendCode = interaction.options.getString("friendcode");
    try {
      let updateCode = await User.update(
        { friend_code: formatFriendCode(friendCode) },
        { where: { handle: handle } }
      );
      if (updateCode !== 0) {
        return await interaction.editReply({
          content: `friend code for <@${userId}> updated!`,
          ephemeral: true,
        });
      }
      await interaction.editReply({
        content: `Something went wrong with adding your code. Friend code doesn't exist or code length exceeds limit.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        content: `${error.errors[0].message}. Please try again <:ttar:711069119184764928>`,
        ephemeral: true,
      });
    }
  },
};
