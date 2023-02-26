const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-switchcode")
    .setDescription("Update your Nintendo Switch friend code!")
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
    const switchcode = interaction.options.getString("friendcode");
    try {
      let updateCode = await User.update(
        { switch_code: switchcode },
        { where: { handle: handle } }
      );
      if (updateCode !== 0) {
        return await interaction.editReply({
          content: `Nintendo Switch friend code updated for <@${userId}>!`,
          ephemeral: true,
        });
      }
      await interaction.editReply({
        content: `Something went wrong with adding your code. Friend code doesn't exist or there was an error with its formatting.`,
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
