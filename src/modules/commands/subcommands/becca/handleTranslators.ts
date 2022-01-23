/* eslint-disable jsdoc/require-param */

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { translatorList } from "../../../../config/commands/translatorList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Handles providing a list of translators.
 */
export const handleTranslators: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const list = translatorList.length
      ? translatorList.map((el) => `${el.name} - ${el.language}`).join("\n")
      : t("commands:becca.translators.none");
    const embed = new MessageEmbed();
    embed.setTitle(t("commands:becca.translators.title"));
    embed.setDescription(list);
    embed.setColor(Becca.colours.default);
    embed.addField(
      t("commands:becca.translators.help"),
      t("commands:becca.translators.join")
    );
    embed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const button = new MessageButton();
    button.setStyle("LINK");
    button.setLabel(t("commands:becca.translators.button"));
    button.setURL("https://chat.nhcarrigan.com");

    const row = new MessageActionRow().addComponents([button]);

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "translators command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "translators", errorId, t)],
    });
  }
};
