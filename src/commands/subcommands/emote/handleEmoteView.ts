/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import EmoteCountModel from "../../../database/models/EmoteCountModel";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Renders a user's emote data into an embed.
 */
export const handleEmoteView: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const data = await EmoteCountModel.findOne({ userId: interaction.user.id });

    if (!data) {
      await interaction.editReply({
        content: t("commands:emote.view.none"),
      });
      return;
    }

    const total =
      data.hug +
      data.kiss +
      data.pat +
      data.boop +
      data.throw +
      data.smack +
      data.uwu;

    const emoteEmbed = new MessageEmbed();
    emoteEmbed.setTitle(t("commands:emote.view.title"));
    emoteEmbed.setAuthor({
      name: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL(),
    });
    emoteEmbed.setColor(Becca.colours.default);
    emoteEmbed.setDescription(t("commands:emote.view.description", { total }));
    emoteEmbed.addField(
      t("commands:emote.view.hugs"),
      data.hug.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.kisses"),
      data.kiss.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.pats"),
      data.pat.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.boops"),
      data.boop.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.throws"),
      data.throw.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.smacks"),
      data.smack.toString(),
      true
    );
    emoteEmbed.addField(
      t("commands:emote.view.uwus"),
      data.uwu.toString(),
      true
    );
    emoteEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent",
    });

    await interaction.editReply({ embeds: [emoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote view command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote view", errorId, t)],
    });
  }
};
