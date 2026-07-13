const { MessageFlags } = require("discord.js");
const { masterDiscordLog } = require("./../lib/globallog");
const { honeypotId } = require("./../config.json");

module.exports = {
  customId: "insert-honeypot",
  async execute(interaction) {
    interaction.client.channels.cache.get(honeypotId)?.send({
      content: `# :warning: **Do not post any message in this channel. ** :warning:\nIt's a honeypot for spam, any message posted here will result in an automatic ban.\nDo not test this, there are no exceptions and no warnings after this message.`,
    });
    await interaction.reply({
      content: `The message has been posted succesfully.`,
      flags: MessageFlags.Ephemeral,
    });
    // paranoia level set to 1 because it's a succesfull click
    masterDiscordLog(
      1,
      false,
      `Button: \`${interaction.customId}\`\nHoneypot message succesfully posted.`,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
