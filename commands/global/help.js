const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { masterDiscordLog } = require("./../../lib/globallog");

module.exports = {
  cooldown: 5, // User can only run this command once every 5 seconds
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get more information about the bot.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild]),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Fetching information... 🔄",
      withResponse: true,
      flags: MessageFlags.Ephemeral,
    });

    const isAdmin = interaction.member?.permissions.has(
      PermissionFlagsBits.Administrator,
    );
    let helpText = "";
    if (isAdmin) {
      helpText = `🛠️ **Admin Help**\n• </setup:1524346199904096337> - Setup settings for your guild.\n• </serverinfo:1524147944830406696> - Show live network latency and server metrics.`;
      const button1 = new ButtonBuilder()
        .setLabel("Go to developers discord")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/n653JGK6SD");
      const row = new ActionRowBuilder().addComponents(button1);

      await interaction.editReply({
        content: helpText,
        components: [row],
      });
    } else {
      helpText = `👤 **Help Me**\n• </help:1525873300658589839> - Shows this message.\n• </ping:1524151920552579292> - Check the bot's live connection speeds.\n\n**User-installed**\n• </privateping:1524150281770635356> - Check the bot's latency from anywhere (DMs or any server)!`;

      await interaction.editReply({
        content: helpText,
      });
    }

    // paranoia level set to 1 because it's a succesfull command
    masterDiscordLog(
      1,
      false,
      `Slashcommand: </help:1525873300658589839>\n${helpText}`,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
