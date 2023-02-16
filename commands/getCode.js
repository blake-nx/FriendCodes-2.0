const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");

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
    await interaction.deferReply();
    const userId = await interaction.options.getUser("friend").id;
    const username = await interaction.options.getUser("friend").username;
    const discriminator = await interaction.options.getUser("friend")
      .discriminator;
    const handle = `${username}#${discriminator}`;

    if (username && discriminator) {
      try {
        const friendcode = await User.findOne({ where: { handle: handle } });
        if (friendcode) {
          return await interaction.editReply({
            content: `<@${userId}>'s friend code is ${friendcode.get(
              "friend_code"
            )}`,
            ephemeral: true,
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
