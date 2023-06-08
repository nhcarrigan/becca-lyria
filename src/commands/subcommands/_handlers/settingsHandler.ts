import { PermissionFlagsBits } from "discord.js";
import { SubcommandHandlers } from "../../../config/commands/_handlers";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { CommandName } from "../../../interfaces/commands/CommandName";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { handleInvalidSubcommand } from "../handleInvalidSubcommand";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

export const settingsHandler = (command: CommandName) => {
  const handler: CommandHandler = async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();
      const { member } = interaction;

      if (
        !member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        member.user.id !== Becca.configs.ownerId
      ) {
        await interaction.editReply({
          content: tFunctionArrayWrapper(t, "responses:noPermission"),
        });
        return;
      }

      const action = interaction.options.getSubcommandGroup(true);
      const setting = interaction.options.getSubcommand(true) as Settings;
      const subcommandData = subcommands.find((el) => el.name === setting);
      if (!subcommandData) {
        await handleInvalidSubcommand(Becca, interaction, t, config);
        return;
      }
      const value =
        setting === "level_roles"
          ? `${interaction.options.getInteger("level", true)} ${
              interaction.options.getRole("role", true).id
            }`
          : `${
              interaction.options.get(subcommandData.options[0].name)?.value ??
              defaultServer[setting]
            }`;
      const handler = SubcommandHandlers[command][action];
      await handler(Becca, interaction, t, config, setting, value);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "welcome group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, `${command} group`, errorId, t)],
      });
    }
  };
  return handler;
};
