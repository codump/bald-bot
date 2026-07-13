const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");
const { masterDiscordLog } = require("./../../../lib/globallog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Show live network latency and server metrics.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Fetching data... 📊",
      withResponse: true,
      flags: MessageFlags.Ephemeral,
    });

    const roundtripLatency =
      sent.resource.message.createdTimestamp - interaction.createdTimestamp;
    const websocketPing = interaction.client.ws.ping;
    const guild = interaction.guild;

    await interaction.editReply({
      content:
        `📊 **Server Status for ${guild.name}**\n\n` +
        `🖥️ **Network Latency:**\n` +
        `• API Roundtrip: \`${roundtripLatency}ms\`\n` +
        `• Gateway Connection: \`${websocketPing}ms\`\n\n` +
        `👥 **Server Stats:**\n` +
        `• Total Members: \`${guild.memberCount}\`\n` +
        `• Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
    });

    // paranoia level set to 1 because it's a succesfull command
    masterDiscordLog(
      1,
      false,
      `Slashcommand: </serverinfo:1524147944830406696>\n📊 **Server Status for ${guild.name}**\n\n` +
        `🖥️ **Network Latency:**\n` +
        `• API Roundtrip: \`${roundtripLatency}ms\`\n` +
        `• Gateway Connection: \`${websocketPing}ms\`\n\n` +
        `👥 **Server Stats:**\n` +
        `• Total Members: \`${guild.memberCount}\`\n` +
        `• Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
