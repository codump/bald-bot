const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");
const { masterDiscordLog } = require("./../../lib/globallog");

module.exports = {
  cooldown: 5, // User can only run this command once every 5 seconds
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's live connection speeds.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild]),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Calculating latencies... 🔄",
      withResponse: true,
      flags: MessageFlags.Ephemeral,
    });

    const roundtripLatency =
      sent.resource.message.createdTimestamp - interaction.createdTimestamp;
    const websocketPing = interaction.client.ws.ping;

    await interaction.editReply({
      content: `🏓 **Pong!**\n• **Roundtrip Latency:** \`${roundtripLatency}ms\`\n• **Websocket Heartbeat:** \`${websocketPing}ms\``,
    });

    // paranoia level set to 1 because it's a succesfull command
    masterDiscordLog(
      1,
      false,
      `Slashcommand: </ping:1524151920552579292>\n🏓 **Pong!**\n• **Roundtrip Latency:** \`${roundtripLatency}ms\`\n• **Websocket Heartbeat:** \`${websocketPing}ms\``,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
