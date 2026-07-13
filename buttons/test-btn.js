const { MessageFlags } = require("discord.js");
const { masterDiscordLog } = require("./../lib/globallog");

module.exports = {
  customId: "test-btn",
  async execute(interaction) {
    // test
    await interaction.reply({
      content: `Test OK.`,
      flags: MessageFlags.Ephemeral,
    });
    // test

    // paranoia level set to 1 because it's a succesfull click
    masterDiscordLog(
      1,
      false,
      `Button: \`${interaction.customId}\`\nTest succesfully posted.`,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
