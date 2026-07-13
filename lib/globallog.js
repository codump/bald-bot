const { EmbedBuilder } = require("discord.js");
const { masterId, masterLogId, logging } = require("../config.json");

/**
 * Sends log to your discord master log channel
 * @param {number} level - Paranoia level: 1, 2, 3, 4, 5 where 1 is the highest
 * @param {boolean} ping - Ping master on discord: true or false
 * @param {string} text - The event you want to log
 * @param {number | string} type - The type: 1 | error & 2 | succes | ok
 * @param {number} userID - The interaction user
 * @param {number} [channelID] - (optional) where the interaction took place
 * @returns {boolean} Continue: true or false
 */
async function masterDiscordLog(level, ping, text, type, userID, channelID) {
  try {
    const channelId = masterLogId;

    if (!global.botClient) {
      console.error("No botClient in global scopes.");
      return false;
    }

    const channel = await global.botClient.channels
      .fetch(channelId)
      .catch(() => null);
    if (!channel) {
      console.error(`Log channel ${channelId} not found or no access.`);
      return false;
    }
    const interactionChannel = await global.botClient.channels
      .fetch(channelID)
      .catch(() => null);

    // logging
    let embedColor = 0x00ff00;
    let place = "private";
    let channelLink = "";
    if (channelID) {
      const channelName = interactionChannel.name;
      const guildName = interactionChannel.guild
        ? interactionChannel.guild.name
        : "Direct Message (DM)";
      place = `${channelName}(${channelID}) from ${guildName}(${channel.guild.id})`;
      channelLink = `<#${channelID}>\n`;
    }
    if (type === 1 || type === "error") {
      if (!logging.logError) {
        // Dont want to log error so return continue
        return true;
      }
      embedColor = 0xff0000;
    } else if (type === 2 || type === "succes" || type === "ok") {
      if (!logging.logSucces) {
        // Dont want to log succes so return continue
        return true;
      }
      embedColor = 0x00ff00;
    }
    if (level < logging.paranoia) {
      // Dont want to log this level so return continue
      return true;
    }
    const user = await global.botClient.users.fetch(userID);
    const userAvatar = user.displayAvatarURL({ dynamic: true });
    const message = String(text).substring(0, 4000);
    const logEmbed = new EmbedBuilder()
      .setDescription(channelLink + message)
      .setColor(embedColor)
      .setTimestamp()
      .setAuthor({ name: user.tag, iconURL: userAvatar })
      .setFooter({
        text: `Paranoia Level: ${level}\nWhere: ${place}\n`,
      });
    if (ping) {
      await channel.send({ content: `<@${masterId}>`, embeds: [logEmbed] });
    } else {
      await channel.send({ embeds: [logEmbed] });
    }

    // logging

    return true; // Succes continue
  } catch (error) {
    console.error("Error sending message to log channel:", error);
    return false;
  }
}

module.exports = { masterDiscordLog };
