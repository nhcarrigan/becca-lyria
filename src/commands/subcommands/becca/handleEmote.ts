/* eslint-disable jsdoc/require-param */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { emoteList } from "../../../config/commands/emoteList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Using the artList config, selects a random art object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleEmote: CommandHandler = async (Becca, interaction, t) => {
  try {
    const random = Math.floor(Math.random() * emoteList.length);
    const { emoteName, description, fileName } = emoteList[random];

    const emoteEmbed = new MessageEmbed();
    emoteEmbed.setTitle(emoteName);
    emoteEmbed.setColor(Becca.colours.default);
    emoteEmbed.setDescription(description);
    emoteEmbed.setImage(`https://www.beccalyria.com/assets/emotes/${fileName}`);
    emoteEmbed.setFooter({ text: t("commands:becca.emote.footer") });

    const button = new MessageButton()
      .setLabel(t("commands:becca.emote.buttons.more"))
      .setEmoji("<:BeccaArt:897545793655930910>")
      .setStyle("LINK")
      .setURL(
        "https://www.beccalyria.com/emotes?utm_source=discord&utm_medium=emote-command"
      );

    const row = new MessageActionRow().addComponents([button]);

    await interaction.editReply({ embeds: [emoteEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote", errorId, t)],
    });
  }
};
