const { Events, REST, Routes, ActivityType } = require("discord.js");
const {
  botStatus,
  botClientId,
  botToken,
  deployCommands,
} = require("../config.json");
const rest = new REST({ version: "10" }).setToken(botToken);
const { masterDiscordLog } = require("./../lib/globallog");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    // deploy commands
    if (deployCommands) {
      console.log("Starting dynamic command deployment...");
      try {
        const totalGlobalPayload = [
          ...(client.globalCommandsData || []),
          ...(client.userInstallCommandsData || []),
        ];
        // Deploy global and user installed commands
        if (totalGlobalPayload.length > 0) {
          await rest.put(Routes.applicationCommands(client.user.id), {
            body: totalGlobalPayload,
          });
          console.log(
            `Successfully deployed ${totalGlobalPayload.length} total application-level commands.`,
          );
          // paranoia level set to 4 because it's a succesfull event we might want to know but could still ignore it on level 5
          masterDiscordLog(
            4,
            false,
            `**Successfully deployed ${totalGlobalPayload.length} total application-level commands.**`,
            2,
            botClientId,
          );
        } else {
          await rest.put(Routes.applicationCommands(client.user.id), {
            body: [],
          });
        }
        // Deploy guild commands
        if (client.guildCommandsData) {
          for (const guildId in client.guildCommandsData) {
            await rest.put(
              Routes.applicationGuildCommands(client.user.id, guildId),
              { body: client.guildCommandsData[guildId] },
            );
            console.log(
              `Successfully deployed ${client.guildCommandsData[guildId].length} commands to guild ${guildId}.`,
            );
            // paranoia level set to 4 because it's a succesfull event we might want to know but could still ignore it on level 5
            masterDiscordLog(
              4,
              false,
              `**Successfully deployed ${client.guildCommandsData[guildId].length} commands to guild ${guildId}.**`,
              2,
              botClientId,
            );
          }
        }
      } catch (error) {
        console.error("Error deploying commands during startup:", error);
        // paranoia level set to 5 because it's an error and we want those
        masterDiscordLog(
          5,
          false,
          `Error deploying commands during startup: ${error}`,
          1,
          botClientId,
        );
      }
    }
    // deploy commands

    // ready
    if (botStatus == "dev") {
      client.user.setPresence({
        status: "dnd",
        activities: [
          {
            name: "In development, bug spray recommended!",
            type: ActivityType.Watching,
          },
        ],
      });
      // paranoia level set to 3 because it's a succesfull event we might want to know but could still ignore it on level 4
      masterDiscordLog(
        3,
        false,
        `**Bot status set to dev meaning DnD and activities set to dev.**`,
        2,
        botClientId,
      );
    } else {
      client.user.setPresence({
        status: "online",
        activities: [
          {
            name: "Codump.github.io 💚 Bot-Hosting.net",
            type: ActivityType.Watching,
          },
        ],
      });
      // paranoia level set to 3 because it's a succesfull event we might want to know but could still ignore it on level 4
      masterDiscordLog(
        3,
        false,
        `**Bot status set to production meaning online and activities set.**`,
        2,
        botClientId,
      );
    }
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // paranoia level set to 4 because it's a succesfull event we might want to know but could still ignore it on level 5
    masterDiscordLog(
      4,
      false,
      `**Ready!** Logged in as ${client.user.tag}`,
      2,
      botClientId,
    );
  },
};
