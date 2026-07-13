const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { botClientId } = require("../config.json");
const { masterDiscordLog } = require("./../lib/globallog");

module.exports = {
  name: "guildCreate",
  once: false,
  async execute(guild) {
    // paranoia level set to 5 because it's a succesfull event we want to know
    masterDiscordLog(
      5,
      true,
      `**Bot is added to a new guild:**  ${guild.name}(${guild.id})`,
      2,
      botClientId,
    );
  },
};
