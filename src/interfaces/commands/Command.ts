import { servers } from "@prisma/client";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

export interface Command {
  data:
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Handles the logic for running a given command.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
   * @param {TFunction} t The i18n translation function.
   * @param {servers} config The server configuration from the database.
   */
  run: (
    Becca: BeccaLyria,
    interaction: ChatInputCommandInteraction,
    t: TFunction,
    config: servers
  ) => Promise<void>;
}
