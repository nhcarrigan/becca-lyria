/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { renderSetting } from "../../../settings/renderSetting";
import { setSetting } from "../../../settings/setSetting";

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
      await interaction.editReply(t("commands:automod.set.failure"));
      return;
    }
    const newContent = isSet["antiphish"];
    const parsedContent = renderSetting(Becca, "antiphish", newContent);
    const successEmbed = new MessageEmbed();
    successEmbed.setTitle(
      t("commands:automod.set.success", { setting: "antiphish" })
    );
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
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
