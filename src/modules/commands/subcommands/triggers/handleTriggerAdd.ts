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
  config
) => {
  try {
    const trigger = interaction.options.getString("trigger", true);
    const response = interaction.options.getString("response", true);

    const hasTrigger = config.triggers.find((el) => el[0] === trigger);

    if (hasTrigger) {
      await interaction.editReply({
        content: "That trigger is already present.",
      });
      return;
    }

    if (config.triggers.length >= 50) {
      await interaction.editReply({
        content: "You can't have more than 50 triggers.",
      });
      return;
    }

    config.triggers.push([trigger, response]);
    config.markModified("triggers");
    await config.save();

    const success = new MessageEmbed();
    success.setTitle("Trigger Added");
    success.setDescription(`Successfully added the trigger \`${trigger}\``);
    success.setColor(Becca.colours.default);
    success.addField("Trigger", trigger);
    success.addField("Response", response);
    success.setAuthor(
      interaction.user.tag,
      interaction.user.displayAvatarURL()
    );
    success.setTimestamp();

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
      embeds: [errorEmbedGenerator(Becca, "trigger add", errorId)],
    });
  }
};
