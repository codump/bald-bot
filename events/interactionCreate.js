const { Events, MessageFlags, Collection } = require("discord.js");
const { coolDownCommands, botClientId } = require("../config.json");
const { masterDiscordLog } = require("./../lib/globallog");

const cooldowns = new Collection();
const globalSpamTracker = new Collection();

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);
      if (!button) {
        console.error(`No button found for customId: ${interaction.customId}`);
        // paranoia level set to 5 because it's an error and we want those
        masterDiscordLog(
          5,
          false,
          `No button found for customId: ${interaction.customId}`,
          1,
          interaction.user.id,
          interaction.channel.id,
        );
        return;
      }
      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(`Error executing button ${interaction.customId}:`, error);
        // paranoia level set to 5 because it's an error and we want those
        masterDiscordLog(
          5,
          false,
          `Error executing button ${interaction.customId}: ${error}`,
          1,
          botClientId,
        );

        if (!interaction.replied && !interaction.deferred) {
          await interaction
            .reply({
              content: "There was an error while executing this button!",
              flags: MessageFlags.Ephemeral,
            })
            .catch(() => null);
        }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      // paranoia level set to 5 because it's an error and we want those
      masterDiscordLog(
        5,
        false,
        `Slashcommand: \`/${interaction.commandName}\` was found.`,
        1,
        interaction.user.id,
        interaction.channel.id,
      );
      return;
    }
    const isImmune =
      interaction.guild &&
      interaction.member?.roles.cache.some((role) =>
        coolDownCommands.immuneCoolDownRoles.includes(role.id),
      );
    const now = Date.now();
    const userId = interaction.user.id;

    if (!isImmune) {
      // cooldown commandsPerMinute
      if (!globalSpamTracker.has(userId)) {
        globalSpamTracker.set(userId, []);
      }

      const oneMinuteAgo = now - 60000;
      let userHistory = globalSpamTracker
        .get(userId)
        .filter((timestamp) => timestamp > oneMinuteAgo);
      userHistory.push(now);
      globalSpamTracker.set(userId, userHistory);
      if (userHistory.length > coolDownCommands.commandsPerMinute) {
        const oldestTimestamp = userHistory[0];
        const timeUntilReset = ((oldestTimestamp + 60000 - now) / 1000).toFixed(
          0,
        );
        let location;
        if (!interaction.channel?.id) {
          location = "";
        } else {
          location = interaction.channel.id;
        }
        // paranoia level set to 3 because it's a succesfull event we might want to know but could still ignore it on level 4
        masterDiscordLog(
          3,
          false,
          `🚨 **Global Rate Limit Triggered!** Slashcommand: \`/${interaction.commandName}\``,
          2,
          interaction.user.id,
          location,
        );
        return interaction.reply({
          content: `🚨 **Global Rate Limit Triggered!** You have sent too many commands too quickly. Please wait **${timeUntilReset} seconds** before using any more commands.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      // cooldown commandsPerMinute
      // cooldown check
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }
      const timestamps = cooldowns.get(command.data.name);
      const cooldownAmount =
        (command.cooldown || coolDownCommands.defaultAmount) * 1000;
      if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
          let location;
          if (!interaction.channel?.id) {
            location = "";
          } else {
            location = interaction.channel.id;
          }
          // paranoia level set to 2 because it's a succesfull event we might want to know but could still ignore it on level 3
          masterDiscordLog(
            2,
            false,
            `⚠️ **Individual Command Spam Triggered!** Slashcommand: \`/${interaction.commandName}\``,
            2,
            interaction.user.id,
            location,
          );
          return interaction.reply({
            content: `⚠️ Slow down! Please wait **${timeLeft}** more second(s) before reusing the \`/${command.data.name}\` command.`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
      timestamps.set(userId, now);
      setTimeout(() => timestamps.delete(userId), cooldownAmount);
      // cooldown check
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
      // paranoia level set to 5 because it's an error and we want those
      masterDiscordLog(
        5,
        false,
        `Slashcommand: \`/${interaction.commandName}\`\n${error}`,
        1,
        interaction.user.id,
        interaction.channel.id,
      );
    }
  },
};
