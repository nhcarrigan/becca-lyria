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
  run: async (Becca, interaction, config) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const guild = interaction.guild as Guild;
      const message = interaction.options.getMessage("message") as Message;

      if (!guild || !message) {
        await interaction.editReply({
          content: getRandomValue(Becca.responses.missingGuild),
        });
        return;
      }

      const reportChannel = (await guild.channels.fetch(
        config.report_channel
      )) as TextChannel;

      if (!reportChannel || !config.report_channel) {
        await interaction.editReply(
          "The guild staff have not enabled reporting for this guild yet."
        );
        return;
      }

      const author = message.author as User;

      const reportEmbed = new MessageEmbed();
      reportEmbed.setTitle(`Your saved message!`);
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
      reportEmbed.setFooter(
        "Like the bot? Donate: https://donate.nhcarrigan.com",
        "https://cdn.nhcarrigan.com/profile-transparent.png"
      );

      await reportChannel.send({
        content: `<@!${interaction.user.id}> has reported this message:`,
        embeds: [reportEmbed],
      });
      await interaction.editReply(
        "I have reported this message to the guild keepers."
      );
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
