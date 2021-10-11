import { CommandInteraction } from "discord.js";

import { BeccaInt } from "../BeccaInt";
import { ServerConfig } from "../database/ServerConfig";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {ServerConfig} config The settings for the server where the interaction occurred.
 */
export type CommandHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  config: ServerConfig
) => Promise<void>;
