/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { registerCommands } from "../../../../utils/registerCommands";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Loads and registers all current commands. This should be run when a change
 * to a command's `data` property is deployed, or a command is added/deleted. This
 * does NOT need to be run for changes to the `run` property.
 */
export const handleRegister: CommandHandler = async (Becca, interaction, t) => {
  try {
    const valid = await registerCommands(Becca);

    if (!valid) {
      await interaction.editReply(t("commands:nhcarrigan.register.failed"));
      return;
    }
    const confirm = new MessageEmbed();
    confirm.setTitle(t("commands:nhcarrigan.register.title"));
    confirm.setDescription(t("commands:nhcarrigan.register.description"));

    for (const command of Becca.commands) {
      confirm.addField(command.data.name, command.data.description, true);
    }

    confirm.addField(
      t("commands:nhcarrigan.register.context"),
      Becca.contexts.map((el) => el.data.name).join(", ")
    );

    await interaction.editReply({ embeds: [confirm] });
    await Becca.debugHook.send(
      `Hey <@!${Becca.configs.ownerId}>, application commands were registered.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "register command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "register", errorId)],
    });
  }
};
