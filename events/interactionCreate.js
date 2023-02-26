// This event is triggered when a user interacts with a command
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // Check if the interaction is a chat command
    if (!interaction.isChatInputCommand()) return;

    // Get the command that matches the name of the interaction
    const command = interaction.client.commands.get(interaction.commandName);

    // If the command is not found, log an error and return
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      // Execute the command with the interaction object
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
