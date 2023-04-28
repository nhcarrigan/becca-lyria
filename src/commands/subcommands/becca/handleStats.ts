import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { DefaultTFuncReturn } from "i18next";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { formatTextToTable } from "../../../utils/formatText";
import { getRandomValue } from "../../../utils/getRandomValue";

export const handleStats: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, user: author } = interaction;
    if (!guild || !author) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }

    const view = interaction.options.getString("view");

    if (view === "commands") {
      const topServers = await Becca.db.commands.findMany({
        take: 10,
        orderBy: {
          commandUses: "desc",
        },
      });

      const topServersEmbed = topServers.map((server, index) => [
        index + 1,
        server.serverName,
        server.commandUses,
      ]);

      const commandEmbed = new EmbedBuilder();
      commandEmbed.setTitle(t("commands:becca.stats.commands.title"));
      commandEmbed.setTimestamp();
      commandEmbed.setColor(Becca.colours.default);
      commandEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      commandEmbed.setDescription(
        `\`\`\`\n${formatTextToTable(topServersEmbed, {
          headers: [
            t("commands:becca.stats.commands.rank"),
            t("commands:becca.stats.commands.name"),
            t("commands:becca.stats.commands.uses"),
          ],
        })}\`\`\``
      );
      commandEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      await interaction.editReply({
        embeds: [commandEmbed],
      });
      return;
    }

    if (view === "svotes") {
      const topVotes = await Becca.db.voters.findMany({
        take: 10,
        orderBy: {
          serverVotes: "desc",
        },
      });

      const serverVoteEmbed = topVotes
        .map(
          (el, i) =>
            `#${i + 1}: ${t("commands:becca.stats.bot.votes", {
              user: `<@!${el.userId}>`,
              votes: el.serverVotes,
            })}`
        )
        .join("\n");

      const serverEmbed = new EmbedBuilder();
      serverEmbed.setTitle(t("commands:becca.stats.server.title"));
      serverEmbed.setTimestamp();
      serverEmbed.setColor(Becca.colours.default);
      serverEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      serverEmbed.setDescription(serverVoteEmbed);
      serverEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const supportServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.support"))
        .setEmoji("<:BeccaHello:867102882791424073>")
        .setStyle(ButtonStyle.Link)
        .setURL("https://chat.nhcarrigan.com");
      const voteServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.server"))
        .setEmoji("<:BeccaWoah:877278300949585980>")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/servers/778130114772598785/vote");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        supportServerButton,
        voteServerButton,
      ]);

      await interaction.editReply({ embeds: [serverEmbed], components: [row] });
      return;
    }

    if (view === "bvotes") {
      const topVotes = await Becca.db.voters.findMany({
        take: 10,
        orderBy: {
          botVotes: "desc",
        },
      });

      const botVoteEmbed = topVotes
        .map(
          (el, i) =>
            `#${i + 1}: ${t("commands:becca.stats.bot.votes", {
              user: `<@!${el.userId}>`,
              votes: el.botVotes,
            })}`
        )
        .join("\n");

      const botEmbed = new EmbedBuilder();
      botEmbed.setTitle(t("commands:becca.stats.bot.title"));
      botEmbed.setTimestamp();
      botEmbed.setColor(Becca.colours.default);
      botEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      botEmbed.setDescription(botVoteEmbed);
      botEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const supportServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.button.support"))
        .setEmoji("<:BeccaHello:867102882791424073>")
        .setStyle(ButtonStyle.Link)
        .setURL("https://chat.nhcarrigan.com");
      const voteBotButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.bot"))
        .setEmoji("<:BeccaWoah:877278300949585980>")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/716707753090875473/vote");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        supportServerButton,
        voteBotButton,
      ]);

      await interaction.editReply({ embeds: [botEmbed], components: [row] });
      return;
    }

    await interaction.editReply({
      content: t("commands:becca.stats.invalid"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "stats command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "stats", errorId, t)],
    });
  }
};
