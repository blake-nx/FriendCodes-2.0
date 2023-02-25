const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// recursively read all command files in the /commands directory and subdirectories
// and store them in an array
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const subdirs = fs
  .readdirSync(commandsPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const subdir of subdirs) {
  const subdirPath = path.join(commandsPath, subdir);
  const commandFiles = fs
    .readdirSync(subdirPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(subdirPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
