const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcode")
    .setDescription("Add your friend code to the bot for others to see")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription("Your friend code")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getString("friendcode");
    await interaction.reply({
      content: `friend code ${target} added!`,
      ephemeral: true,
    });
  },
};
