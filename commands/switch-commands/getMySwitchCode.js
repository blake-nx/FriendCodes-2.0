const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-switchcode")
    .setDescription("This posts your Nintendo Switch friend code!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const handle = interaction.user.tag;
    const userId = interaction.user.id;
    try {
      const switchCode = await User.findOne({ where: { handle: handle } });
      if (switchCode.get("switch_code") !== null) {
        return await interaction.editReply({
          content: `${switchCode.get("switch_code")}`,
          ephemeral: false,
        });
      }
      return await interaction.editReply({
        content: `No Nintendo Switch friend code found for <@${userId}> <:ttar:711069119184764928>`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
