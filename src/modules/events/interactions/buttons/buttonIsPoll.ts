import { ButtonInteraction } from "discord.js";
import { DefaultTFuncReturn, TFunction } from "i18next";

import { BeccaLyria } from "../../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";

/**
 * For the poll buttons.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const buttonIsPoll = async (
  Becca: BeccaLyria,
  interaction: ButtonInteraction,
  t: TFunction
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, channel, message } = interaction;
    if (!guild || !channel || !message) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }
    const pollRecord = await Becca.db.polls.findUnique({
      where: {
        serverId_channelId_messageId: {
          serverId: guild.id,
          channelId: channel.id,
          messageId: message.id,
        },
      },
    });

    if (!pollRecord) {
      await interaction.editReply({
        content: "I could not find that poll.",
      });
      return;
    }

    if (pollRecord.responses.includes(interaction.user.id)) {
      await interaction.editReply({
        content: "You have already responded to this poll!",
      });
      return;
    }
    const [, letter] = interaction.customId.split("-");

    const { embeds } = interaction.message;

    if (pollRecord.endsAt < Date.now()) {
      await interaction.message.edit({
        embeds: [
          {
            title: embeds[0].title || "Something went wrong.",
            description: embeds[0].description || "Something went wrong.",
            fields: [
              ...embeds[0].fields,
              {
                name: "Results",
                value: `A: ${pollRecord.results.a}\nB: ${pollRecord.results.b}\nC:${pollRecord.results.c}\nD:${pollRecord.results.d}`,
              },
            ],
          },
        ],
        components: [],
      });
      await interaction.editReply({ content: "That poll has ended!" });
      await Becca.db.polls.delete({
        where: {
          serverId_channelId_messageId: {
            serverId: guild.id,
            channelId: channel.id,
            messageId: message.id,
          },
        },
      });
      return;
    }

    if (!(letter in pollRecord.results)) {
      await interaction.editReply({
        content: "Something went wrong with this button oopsie.",
      });
      return;
    }

    pollRecord.results[letter as "a" | "b" | "c" | "d"]++;
    pollRecord.responses.push(interaction.user.id);
    await Becca.db.polls.update({
      where: {
        serverId_channelId_messageId: {
          serverId: guild.id,
          channelId: channel.id,
          messageId: message.id,
        },
      },
      data: {
        responses: pollRecord.responses,
        results: pollRecord.results,
      },
    });
    await interaction.editReply({
      content: "Your response has been recorded.",
    });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "poll button handler",
      err,
      interaction.guild?.name
    );
  }
};
