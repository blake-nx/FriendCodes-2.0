const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv").config();
const token = process.env.TOKEN;

// Create a new client instance and set the intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// import client events functions from the /events directory
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

// loop through each event file, require and set its functionality to the appropriate client event
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    // if event only needs to run once, use .once() function to register it
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    // if event needs to run multiple times, use .on() function to register it
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// recursively import all command files in the /commands directory and its subdirectories
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const subdirs = fs
  .readdirSync(commandsPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);
// loop through each subdirectory and its files, require and set its functionality to the appropriate command name

for (const subdir of subdirs) {
  const subdirPath = path.join(commandsPath, subdir);
  const commandFiles = fs
    .readdirSync(subdirPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(subdirPath, file);
    const command = require(filePath);
    // set each command's name and function to the client's commands Collection
    client.commands.set(command.data.name, command);
  }
}

// authenticate and login the client with the bot token from the .env file
client.login(token);
