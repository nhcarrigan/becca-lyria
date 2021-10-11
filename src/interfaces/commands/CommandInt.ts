import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { BeccaInt } from "../BeccaInt";
import { ServerConfig } from "../database/ServerConfig";

export interface CommandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Handles the logic for running a given command.
   *
   * @param {BeccaInt} Becca Becca's Discord instance.
   * @param {CommandInteraction} interaction The interaction payload from Discord.
   * @param {ServerConfig} config The server configuration from the database.
   */
  run: (
    Becca: BeccaInt,
    interaction: CommandInteraction,
    config: ServerConfig
  ) => Promise<void>;
}
