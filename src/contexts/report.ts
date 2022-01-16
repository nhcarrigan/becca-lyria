/* eslint-disable jsdoc/require-jsdoc */
import { User } from "@sentry/types";
import {
  Guild,
  GuildChannel,
  Message,
  MessageEmbed,
  TextChannel,
} from "discord.js";

import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { customSubstring } from "../utils/customSubstring";
import { getRandomValue } from "../utils/getRandomValue";

export const report: Context = {
  data: {
    name: "report",
    type: 3,
  },
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const guild = interaction.guild as Guild;
      const message = interaction.options.getMessage("message") as Message;

      if (!guild || !message) {
        await interaction.editReply({
          content: getRandomValue(t("responses:missingGuild")),
        });
        return;
      }

      const reportChannel = (await guild.channels.fetch(
        config.report_channel
      )) as TextChannel;

      if (!reportChannel || !config.report_channel) {
        await interaction.editReply(t("contexts:report.notEnabled"));
        return;
      }

      const author = message.author as User;

      const reportEmbed = new MessageEmbed();
      reportEmbed.setTitle(t("contexts:report.title"));
      reportEmbed.setDescription(
        `${customSubstring(message.content || "no content found!", 4000)}`
      );
      reportEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      reportEmbed.setColor(Becca.colours.default);
      reportEmbed.addField(
        "Channel",
        (message.channel as GuildChannel).name,
        true
      );
      reportEmbed.addField("Link", message.url, true);
      reportEmbed.setFooter({
        text: t("defaults:donate"),
        iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
      });

      await reportChannel.send({
        content: t("contexts:report.reported", {
          mention: `<@!${interaction.user.id}>`,
        }),
        embeds: [reportEmbed],
      });
      await interaction.editReply(t("contexts:report.success"));
      reportEmbed.addField("Link", message.url);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "report context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "report context", errorId)],
      });
    }
  },
};
