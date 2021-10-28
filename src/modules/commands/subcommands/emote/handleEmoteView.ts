/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import EmoteCountModel from "../../../../database/models/EmoteCountModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Renders a user's emote data into an embed.
 */
export const handleEmoteView: CommandHandler = async (Becca, interaction) => {
  try {
    const data = await EmoteCountModel.findOne({ userId: interaction.user.id });

    if (!data) {
      await interaction.editReply({
        content: "You have not received any emotes yet!",
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
    emoteEmbed.setTitle("Your emote counts!");
    emoteEmbed.setAuthor(
      interaction.user.tag,
      interaction.user.displayAvatarURL()
    );
    emoteEmbed.setColor(Becca.colours.default);
    emoteEmbed.setDescription(`You have received a total of ${total} emotes!`);
    emoteEmbed.addField("Hugs", data.hug.toString(), true);
    emoteEmbed.addField("Kisses", data.kiss.toString(), true);
    emoteEmbed.addField("Pats", data.pat.toString(), true);
    emoteEmbed.addField("Boops", data.boop.toString(), true);
    emoteEmbed.addField("Throws", data.throw.toString(), true);
    emoteEmbed.addField("Smacks", data.smack.toString(), true);
    emoteEmbed.addField("UwU faces", data.uwu.toString(), true);

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
      embeds: [errorEmbedGenerator(Becca, "emote view", errorId)],
    });
  }
};
