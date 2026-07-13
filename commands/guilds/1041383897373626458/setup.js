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
const { masterDiscordLog } = require("./../../../lib/globallog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup settings for your guild.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Fetching options... ⚙️",
      withResponse: true,
      flags: MessageFlags.Ephemeral,
    });

    const button1 = new ButtonBuilder()
      .setCustomId("insert-honeypot")
      .setLabel("Insert honeypot message")
      .setEmoji("🍯")
      .setStyle(ButtonStyle.Secondary);
    const button2 = new ButtonBuilder()
      .setCustomId("test-btn")
      .setLabel("Test button")
      .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(button1, button2);

    await interaction.editReply({
      content: `Select one of the options below.`,
      components: [row],
    });

    // paranoia level set to 1 because it's a succesfull command
    masterDiscordLog(
      1,
      false,
      `Slashcommand: </setup:1524346199904096337>\n⚙️ Fetching options...`,
      2,
      interaction.user.id,
      interaction.channel.id,
    );
  },
};
