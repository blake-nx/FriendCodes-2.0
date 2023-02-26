const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-pogocode")
    .setDescription("This posts your Pokemon Go friend code!"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    const handle = interaction.user.tag;
    const userId = interaction.user.id;

    try {
      const friendcode = await User.findOne({ where: { handle: handle } });
      if (friendcode.get("friend_code") !== null) {
        return await interaction.editReply({
          content: `${friendcode.get("friend_code")}`,
          ephemeral: false,
        });
      }
      return await interaction.editReply({
        content: `No friend code found for <@${userId}> <:ttar:711069119184764928>`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
