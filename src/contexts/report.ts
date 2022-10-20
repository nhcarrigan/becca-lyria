/* eslint-disable jsdoc/require-jsdoc */
import { User } from "@sentry/types";
import {
  ChannelType,
  EmbedBuilder,
  Guild,
  Message,
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

      if (!guild || !message || message.channel.type === ChannelType.DM) {
        await interaction.editReply({
          content: getRandomValue(
            t<string, string[]>("responses:missingGuild")
          ),
        });
        return;
      }

      const reportChannel = (await guild.channels.fetch(
        config.report_channel
      )) as TextChannel;

      if (!reportChannel || !config.report_channel) {
        await interaction.editReply(
          t<string, string>("contexts:report.notEnabled")
        );
        return;
      }

      const author = message.author as User;

      const reportEmbed = new EmbedBuilder();
      reportEmbed.setTitle(t<string, string>("contexts:report.title"));
      reportEmbed.setDescription(
        `${customSubstring(message.content || "no content found!", 4000)}`
      );
      reportEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      reportEmbed.setColor(Becca.colours.default);
      reportEmbed.addFields([
        {
          name: "Channel",
          value: message.channel.name,
          inline: true,
        },
        {
          name: "Link",
          value: message.url,
          inline: true,
        },
      ]);
      reportEmbed.setFooter({
        text: t<string, string>("defaults:donate"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      await reportChannel.send({
        content: t<string, string>("contexts:report.reported", {
          mention: `<@!${interaction.user.id}>`,
        }),
        embeds: [reportEmbed],
      });
      await interaction.editReply(t<string, string>("contexts:report.success"));
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "report context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "report context", errorId, t)],
      });
    }
  },
};
