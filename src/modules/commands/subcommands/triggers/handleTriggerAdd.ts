/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Adds a new trigger to the server config.
 */
export const handleTriggerAdd: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const trigger = interaction.options.getString("trigger", true);
    const response = interaction.options.getString("response", true);

    const hasTrigger = config.triggers.find((el) => el[0] === trigger);

    if (hasTrigger) {
      await interaction.editReply({
        content: t("commands:triggers.add.duplicate"),
      });
      return;
    }

    if (config.triggers.length >= 50) {
      await interaction.editReply({
        content: t("commands:triggers.add.max"),
      });
      return;
    }

    config.triggers.push([trigger, response]);
    config.markModified("triggers");
    await config.save();

    const success = new MessageEmbed();
    success.setTitle(t("commands:triggers.add.title"));
    success.setDescription(t("commands:triggers.add.description", { trigger }));
    success.setColor(Becca.colours.default);
    success.addField(t("commands:triggers.add.trigger"), trigger);
    success.addField(t("commands:triggers.add.response"), response);
    success.setAuthor({
      name: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL(),
    });
    success.setTimestamp();
    success.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    await interaction.editReply({ embeds: [success] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "trigger add command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "trigger add", errorId, t)],
    });
  }
};
