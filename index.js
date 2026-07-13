const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { botClientId, botToken } = require("./config.json");
const { masterDiscordLog } = require("./lib/globallog");

// Catches regular synchronous or code-level runtime errors
process.on("uncaughtException", (error, origin) => {
  console.error(`[CRITICAL ERROR] Uncaught Exception at: ${origin}`);
  console.error(error.stack || error);
});
// Catches unhandled async/await promise rejections (very common if Discord APIs time out)
process.on("unhandledRejection", (reason, promise) => {
  console.error(`[CRITICAL ERROR] Unhandled Promise Rejection at:`, promise);
  console.error(`Reason:`, reason?.stack || reason);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
global.botClient = client;

// commands
client.commands = new Collection();
client.globalCommandsData = [];
client.userInstallCommandsData = [];
client.guildCommandsData = {};
const commandsPath = path.join(__dirname, "commands");

function readCommands(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        readCommands(fullPath);
      } else if (file.name.endsWith(".js")) {
        try {
          const command = require(fullPath);
          if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            const relativePath = path
              .relative(commandsPath, fullPath)
              .replace(/\\/g, "/");
            const pathSegments = relativePath.split("/");
            const topFolder = pathSegments[0];
            if (topFolder === "global") {
              client.globalCommandsData.push(command.data.toJSON());
            } else if (topFolder === "userinstall") {
              client.userInstallCommandsData.push(command.data.toJSON());
            } else if (topFolder === "guilds" && pathSegments.length >= 3) {
              const guildId = pathSegments[1];
              if (!client.guildCommandsData[guildId]) {
                client.guildCommandsData[guildId] = [];
              }
              client.guildCommandsData[guildId].push(command.data.toJSON());
            }
          } else {
            console.log(
              `[WARNING] The command at ${fullPath} is missing "data" or "execute".`,
            );
            // paranoia level set to 5 because it's an error and we want those
            masterDiscordLog(
              5,
              false,
              `Bot error: [WARNING] The command at ${fullPath} is missing "data" or "execute".`,
              1,
              botClientId,
            );
          }
        } catch (fileErr) {
          console.error(fileErr);
          // paranoia level set to 5 because it's an error and we want those
          masterDiscordLog(5, false, `Bot error: ${fileErr}`, 1, botClientId);
        }
      }
    }
  } catch (dirErr) {
    console.error(dirErr);
    // paranoia level set to 5 because it's an error and we want those
    masterDiscordLog(5, false, `Bot error: ${dirErr}`, 1, botClientId);
  }
}
if (fs.existsSync(commandsPath)) {
  readCommands(commandsPath);
}
// commands

// buttons
client.buttons = new Collection();
const buttonsPath = path.join(__dirname, "buttons");

function readButtons(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        readButtons(fullPath);
      } else if (file.name.endsWith(".js")) {
        try {
          const button = require(fullPath);
          if ("customId" in button && "execute" in button) {
            client.buttons.set(button.customId, button);
          } else {
            console.log(
              `[WARNING] The button at ${fullPath} is missing "customId" or "execute".`,
            );
            // paranoia level set to 5 because it's an error and we want those
            masterDiscordLog(
              5,
              false,
              `[WARNING] The button at ${fullPath} is missing "customId" or "execute".`,
              1,
              botClientId,
            );
          }
        } catch (fileErr) {
          console.error(fileErr);
          // paranoia level set to 5 because it's an error and we want those
          masterDiscordLog(5, false, `Bot error: ${fileErr}`, 1, botClientId);
        }
      }
    }
  } catch (dirErr) {
    console.error(dirErr);
    // paranoia level set to 5 because it's an error and we want those
    masterDiscordLog(5, false, `Bot error: ${dirErr}`, 1, botClientId);
  }
}
if (fs.existsSync(buttonsPath)) {
  readButtons(buttonsPath);
}
// buttons

// events
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  try {
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      } catch (eventFileErr) {
        console.error(eventFileErr);
        // paranoia level set to 5 because it's an error and we want those
        masterDiscordLog(
          5,
          false,
          `Bot error: ${eventFileErr}`,
          1,
          botClientId,
        );
      }
    }
  } catch (dirErr) {
    console.error(dirErr);
    // paranoia level set to 5 because it's an error and we want those
    masterDiscordLog(5, false, `Bot error: ${dirErr}`, 1, botClientId);
  }
}
// events

// login bot
client.login(botToken).catch((err) => {
  console.error(err);
});
