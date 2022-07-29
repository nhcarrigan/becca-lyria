/* eslint-disable jsdoc/require-param */
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Remove a trigger from the server config.
 */
export const handleTriggerRemove: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const trigger = interaction.options.getString("trigger", true);

    const triggerIndex = config.triggers.findIndex((el) => el[0] === trigger);

    if (triggerIndex === -1) {
      await interaction.editReply({
        content: t("commands:triggers.remove.missing"),
      });
      return;
    }

    config.triggers.splice(triggerIndex, 1);
    config.markModified("triggers");
    await config.save();

    const success = new EmbedBuilder();
    success.setTitle(t("commands:triggers.remove.title"));
    success.setDescription(
      t("commands:triggers.remove.description", { trigger })
    );
    success.setColor(Becca.colours.default);
    success.setAuthor({
      name: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL(),
    });
    success.setTimestamp();
    success.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [success] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "trigger remove command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "trigger remove", errorId, t)],
    });
  }
};
