const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");
const { masterDiscordLog } = require("./../../lib/globallog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("privateping")
    .setDescription(
      "Check the bot's latency from anywhere (DMs or any server)!",
    )
    .setIntegrationTypes([ApplicationIntegrationType.UserInstall])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Calculating personal app latency... 🚀",
      withResponse: true,
      flags: MessageFlags.Ephemeral,
    });

    const roundtripLatency =
      sent.resource.message.createdTimestamp - interaction.createdTimestamp;
    const websocketPing = interaction.client.ws.ping;

    await interaction.editReply({
      content: `✨ **User-App Pong!**\n• **Roundtrip Latency:** \`${roundtripLatency}ms\`\n• **Websocket Heartbeat:** \`${websocketPing}ms\``,
    });

    // paranoia level set to 1 because it's a succesfull command
    masterDiscordLog(
      1,
      false,
      `Slashcommand: </privateping:1524150281770635356>\n✨ **User-App Pong!**\n• **Roundtrip Latency:** \`${roundtripLatency}ms\`\n• **Websocket Heartbeat:** \`${websocketPing}ms\``,
      2,
      interaction.user.id,
    );
  },
};
