import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

/**
 * Takes a slash command or group builder and a list of subcommands,
 * attaches the subcommands to the builder, and returns the builder.
 *
 * @param {SlashCommandBuilder} command The command to use as the root.
 * @param {SlashCommandSubcommandBuilder[]} subcommands The subcommands to attach.
 * @param {boolean} stripOpts Whether to strip the options from the subcommands.
 * @returns {SlashCommandBuilder} The command with the subcommands attached.
 */
export const attachSubcommandsToCommand = (
  command: SlashCommandBuilder,
  subcommands: SlashCommandSubcommandBuilder[],
  stripOpts = false
): SlashCommandBuilder => {
  for (const subcommand of subcommands) {
    stripOpts
      ? command.addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(subcommand.name)
            .setDescription(subcommand.description)
        )
      : command.addSubcommand(subcommand);
  }
  return command;
};

/**
 * Takes a slash command group builder and a list of subcommands,
 * attaches the subcommands to the builder, and returns the builder.
 *
 * @param {SlashCommandSubcommandGroupBuilder} command The command to use as the root.
 * @param {SlashCommandSubcommandBuilder[]} subcommands The subcommands to attach.
 * @param {boolean} stripOpts Whether to strip the options from the subcommands.
 * @returns {SlashCommandSubcommandGroupBuilder} The command with the subcommands attached.
 */
export const attachSubcommandsToGroup = (
  command: SlashCommandSubcommandGroupBuilder,
  subcommands: SlashCommandSubcommandBuilder[],
  stripOpts = false
): SlashCommandSubcommandGroupBuilder => {
  for (const subcommand of subcommands) {
    stripOpts
      ? command.addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(subcommand.name)
            .setDescription(subcommand.description)
        )
      : command.addSubcommand(subcommand);
  }
  return command;
};
