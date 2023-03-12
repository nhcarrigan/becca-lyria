import { ButtonInteraction } from "discord.js";
import { TFunction } from "i18next";

import PollModel from "../../../../database/models/PollModel";
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
        content: getRandomValue(t<string, string[]>("responses:missingGuild")),
      });
      return;
    }
    const pollRecord = await PollModel.findOne({
      serverId: guild.id,
      channelId: channel.id,
      messageId: message.id,
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
      await PollModel.deleteOne({ _id: pollRecord._id });
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
    pollRecord.markModified("responses");
    pollRecord.markModified("results");
    await pollRecord.save();
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
