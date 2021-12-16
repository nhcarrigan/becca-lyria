/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Remove a trigger from the server config.
 */
export const handleTriggerRemove: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const trigger = interaction.options.getString("trigger", true);

    const triggerIndex = config.triggers.findIndex((el) => el[0] === trigger);

    if (triggerIndex === -1) {
      await interaction.editReply({
        content: "That trigger does not exist.",
      });
      return;
    }

    config.triggers.splice(triggerIndex, 1);
    config.markModified("triggers");
    await config.save();

    const success = new MessageEmbed();
    success.setTitle("Trigger Removed");
    success.setDescription(`Successfully removed the trigger \`${trigger}\``);
    success.setColor(Becca.colours.default);
    success.setAuthor(
      interaction.user.tag,
      interaction.user.displayAvatarURL()
    );
    success.setTimestamp();
    success.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

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
      embeds: [errorEmbedGenerator(Becca, "trigger remove", errorId)],
    });
  }
};
