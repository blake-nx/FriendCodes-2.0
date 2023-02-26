const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-pogocode")
    .setDescription("Delete your code from the bot"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const friendcode = await User.findOne({ where: { handle: handle } });
    const deleteCode = await User.update(
      { friend_code: null },
      { where: { handle: handle } }
    );
    try {
      if (friendcode.get("friend_code") !== null) {
        if (deleteCode !== 0) {
          return await interaction.editReply({
            content: `friend code for <@${userId}> deleted!`,
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          content: `No friend code found for <@${userId}> <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
