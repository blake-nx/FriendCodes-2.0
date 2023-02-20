const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");

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
        { friend_code: friendCode },
        { where: { handle: handle } }
      );
      if (updateCode !== 0) {
        return await interaction.editReply({
          content: `friend code for <@${userId}> updated!`,
          ephemeral: true,
        });
      }
      await interaction.editReply({
        content: `No friend code found for <@${userId}>`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
