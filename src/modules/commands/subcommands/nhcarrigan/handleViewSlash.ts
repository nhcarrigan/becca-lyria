/* eslint-disable jsdoc/require-param */
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { MessageEmbed } from "discord.js";

import { CommandData } from "../../../../interfaces/commands/CommandData";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates a list of currently registered commands.
 */
export const handleViewSlash: CommandHandler = async (Becca, interaction) => {
  try {
    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandData[];

    if (!commands.length) {
      await interaction.editReply("No commands registered at this time.");
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle("Available commands");
    embed.setDescription("These are the currently registered global commands.");

    for (const command of commands) {
      embed.addField(
        command.name,
        command.options?.map((opt) => opt.name).join(", ") ||
          "Command has no options."
      );
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "list command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        });
      });
  }
};
