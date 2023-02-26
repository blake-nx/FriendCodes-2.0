const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-switchcode")
    .setDescription("Delete your Nintendo Switch friend code from the bot"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const switchcode = await User.findOne({ where: { handle: handle } });
    const deleteCode = await User.update(
      { switch_code: null },
      { where: { handle: handle } }
    );
    try {
      if (switchcode.get("switch_code") !== null) {
        if (deleteCode !== 0) {
          return await interaction.editReply({
            content: `Nintendo Switch friend code for <@${userId}> deleted!`,
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          content: `No Nintendo Switch friend code found for <@${userId}> <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
