const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-switchcode")
    .setDescription("Tag a friend to get their Nintendo Switch friend code!")
    .addUserOption((option) =>
      option
        .setName("friend")
        .setDescription("Tag your friend (they won't get notified)")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const userId = await interaction.options.getUser("friend").id;
    const username = await interaction.options.getUser("friend").username;
    const discriminator = await interaction.options.getUser("friend")
      .discriminator;
    const handle = `${username}#${discriminator}`;
    const switchcode = await User.findOne({ where: { handle: handle } });

    if (username && discriminator) {
      try {
        if (switchcode.get("switch_code") !== null) {
          return await interaction.editReply({
            content: `${friendcode.get("switch_code")}`,
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
    } else {
      await interaction.editReply({
        content: `Please try the command again and tag a user`,
        ephemeral: true,
      });
    }
  },
};
