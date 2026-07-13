const { Events } = require("discord.js");
const { masterId, masterLogId, honeypotId } = require("../config.json");
const { masterDiscordLog } = require("./../lib/globallog");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    if (message.channel.id === honeypotId) {
      const member = message.member;
      if (!member) return;

      if (!member.bannable) {
        console.log(
          `Honeypot can't ban ${message.author.tag} due to role hierarchy limitations.`,
        );
        // paranoia level set to 5 because it's an error and ping to true to notify staff
        masterDiscordLog(
          5,
          true,
          `Honeypot can't ban ${message.author.tag} due to role hierarchy limitations.`,
          1,
          message.author.id,
        );
        return;
      }

      try {
        await member.ban({
          deleteMessageSeconds: 7 * 24 * 60 * 60,
          reason: "Honeypot activated.",
        });

        console.log(`Ban via honeypot: ${message.author.tag}`);
        // paranoia level set to 5 because it's a succes we want to know and ping to true to notify staff
        masterDiscordLog(
          5,
          true,
          `Ban via honeypot: ${message.author.tag}`,
          2,
          message.author.id,
        );
      } catch (error) {
        console.error("Honeypot ban failed:", error);
        // paranoia level set to 5 because it's an error and ping to true to notify staff
        masterDiscordLog(
          5,
          true,
          `Honeypot ban failed: ${error}`,
          1,
          message.author.id,
        );
      }
    }
  },
};
