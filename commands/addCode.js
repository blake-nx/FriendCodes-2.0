const { SlashCommandBuilder } = require("discord.js");
const User = require("../db/db-connect.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcode")
    .setDescription("Add your friend code to the bot for others to see")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription("Add your friend code!")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const code = interaction.options.getString("friendcode");
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    try {
      await User.create({ handle: handle, friend_code: code });
      await interaction.editReply({
        content: "friend code " + "`" + code + "`" + ` added for <@${userId}>!`,
        ephemeral: true,
      });
    } catch (error) {
      if (error.errors[0].type === "unique violation") {
        await interaction.editReply({
          content:
            `Friend code for <@${userId}> already exists! Try ` +
            "`" +
            "/updatecode" +
            "`" +
            " to change your code or " +
            "`" +
            "/deletecode" +
            "`" +
            "to remove it",
          ephemeral: true,
        });
      }
    }
  },
};
