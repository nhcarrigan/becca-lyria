import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export class CommandDataHelper {
  private readonly _command: RESTPostAPIChatInputApplicationCommandsJSONBody;
  private readonly _subcommandGroups: APIApplicationCommandSubcommandGroupOption[];
  private readonly _subcommands: APIApplicationCommandSubcommandOption[];
  private readonly _data: { name: string; description: string };
  constructor(command: RESTPostAPIChatInputApplicationCommandsJSONBody) {
    this._command = command;
    this._subcommandGroups = this.parseSubcommandGroups();
    this._subcommands = this.parseSubcommands();
    this._data = {
      name: this._command.name,
      description: this._command.description,
    };
  }

  private parseSubcommandGroups(): APIApplicationCommandSubcommandGroupOption[] {
    return (
      (this._command.options?.filter(
        (opt) => opt.type === ApplicationCommandOptionType.SubcommandGroup
      ) as APIApplicationCommandSubcommandGroupOption[]) || []
    );
  }

  private parseSubcommands(): APIApplicationCommandSubcommandOption[] {
    if (this._subcommandGroups.length) {
      return (
        this._subcommandGroups
          .flatMap(
            (group) =>
              group.options?.filter(
                (opt) => opt.type === ApplicationCommandOptionType.Subcommand
              ) as APIApplicationCommandSubcommandOption[]
          )
          .filter(
            (command, index, self) =>
              self.findIndex((c) => c.name === command.name) === index
          ) || []
      );
    }
    return (
      (this._command.options?.filter(
        (opt) => opt.type === ApplicationCommandOptionType.Subcommand
      ) as APIApplicationCommandSubcommandOption[]) || []
    );
  }

  public get subcommandGroups() {
    return this._subcommandGroups;
  }
  public get subcommands() {
    return this._subcommands;
  }
  public get data() {
    return this._data;
  }
  public getSpecificGroup(name: string) {
    return this._subcommandGroups.find((group) => group.name === name);
  }
  public getSpecificSubcommand(name: string) {
    return this._subcommands.find((cmd) => cmd.name === name);
  }
  public getSubcommandsForGroup(group: string) {
    const target = this._subcommandGroups.find((g) => g.name === group);
    if (!target) {
      return [];
    }
    return target.options?.filter(
      (opt) => opt.type === ApplicationCommandOptionType.Subcommand
    ) as APIApplicationCommandSubcommandOption[];
  }
  public getSubcommandOption<
    T extends
      | APIApplicationCommandStringOption
      | APIApplicationCommandIntegerOption
      | APIApplicationCommandBooleanOption
      | APIApplicationCommandUserOption
      | APIApplicationCommandChannelOption
      | APIApplicationCommandRoleOption
      | APIApplicationCommandMentionableOption
      | APIApplicationCommandNumberOption
      | APIApplicationCommandAttachmentOption
  >(subcommand: string, optionIndex): T | null {
    const target = this._subcommands.find((cmd) => cmd.name === subcommand);
    if (!target?.options?.[optionIndex]) {
      return null;
    }
    return target.options[optionIndex] as T;
  }
}
