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
export const handleViewSlash: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandData[];

    if (!commands.length) {
      await interaction.editReply(t("commands:nhcarrigan.viewslash.none"));
      return;
    }

    const embed = new MessageEmbed();
    embed.setTitle(t("commands:nhcarrigan.viewslash.title"));
    embed.setDescription(t("commands:nhcarrigan.viewslash.description"));

    for (const command of commands) {
      embed.addField(
        command.name,
        command.options?.map((opt) => opt.name).join(", ") ||
          t("commands:nhcarrigan.viewslash.opts")
      );
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "view slash command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "view slash", errorId, t)],
    });
  }
};
