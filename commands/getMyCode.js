const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mycode")
    .setDescription("This posts your friend code!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const handle = interaction.user.tag;
    const userId = interaction.user.id;

    try {
      const friendcode = await User.findOne({ where: { handle: handle } });
      if (friendcode) {
        return await interaction.editReply({
          content: `${friendcode.get("friend_code")}`,
          ephemeral: false,
        });
      }
      return await interaction.editReply({
        content: `No friend code found for <@${userId}>`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
