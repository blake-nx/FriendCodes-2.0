const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getcode")
    .setDescription("Tag a friend to get their friend code!")
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
    const friendcode = await User.findOne({ where: { handle: handle } });
    if (username && discriminator) {
      try {
        if (friendcode.get("friend_code") !== null) {
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
    } else {
      await interaction.editReply({
        content: `Please try the command again and tag a user`,
        ephemeral: true,
      });
    }
  },
};
