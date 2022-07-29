/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { setSetting } from "../../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleAutomodAntiphish: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    const action = interaction.options.getString("action", true) as
      | "none"
      | "mute"
      | "kick"
      | "ban";

    const isSet = await setSetting(
      Becca,
      guild.id,
      guild.name,
      "antiphish",
      action,
      config
    );

    if (!isSet) {
      await interaction.editReply(t("commands:automod.antiphish.failure"));
      return;
    }
    const newContent = isSet["antiphish"];
    const parsedContent = renderSetting(Becca, "antiphish", newContent);
    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(t("commands:automod.antiphish.success"));
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "set command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "set", errorId, t)],
    });
  }
};
