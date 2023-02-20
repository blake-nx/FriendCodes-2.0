const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletecode")
    .setDescription("Delete your code from the bot"),
  async execute(interaction) {
    await interaction.deferReply();
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    try {
      let deleteCode = await User.destroy({ where: { handle: handle } });
      if (deleteCode !== 0) {
        return await interaction.editReply({
          content: `friend code for <@${userId}> deleted!`,
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
