import { servers } from "@prisma/client";
import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function (generated in the command def).
 * @param {servers} config The settings for the server where the interaction occurred.
 */
export type CommandHandler = (
  Becca: BeccaLyria,
  interaction: ChatInputCommandInteraction,
  t: TFunction,
  config: servers
) => Promise<void>;
