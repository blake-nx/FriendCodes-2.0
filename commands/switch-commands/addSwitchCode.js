const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-switchcode")
    .setDescription("Add your Nintendo Switch friend code for easy sharing!")
    .addStringOption((option) =>
      option
        .setName("friendcode")
        .setDescription("Add your friend code!")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const code = interaction.options.getString("friendcode");
    const userId = interaction.user.id;
    const handle = interaction.user.tag;
    const userExists = await User.findOne({ where: { handle: handle } });
    let addCode;
    try {
      if (!userExists) {
        addCode = await User.create({
          handle: handle,
          switch_code: code,
        });
      } else {
        addCode = await User.update(
          { switch_code: code },
          { where: { handle: handle } }
        );
      }
      if (addCode !== 0) {
        return await interaction.editReply({
          content:
            "friend code " + "`" + code + "`" + ` added for <@${userId}>!`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.editReply({
          content:
            `Friend code for <@${userId}> already exists! Try ` +
            "`" +
            "/update-switchcode" +
            "`" +
            " to change your code or " +
            "`" +
            "/delete-switchcode" +
            "`" +
            "to remove it",
          ephemeral: true,
        });
      } else if (error.errors[0].type === "Validation error") {
        return interaction.editReply({
          content: `${error.errors[0].message}. Please try again <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      } else {
        return interaction.editReply({
          content: `Whoops! Something went wrong with adding your code. Please try again <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      }
    }
  },
};
