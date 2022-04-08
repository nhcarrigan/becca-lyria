import { CommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { UserConfig } from "../database/UserConfig";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function (generated in the command def).
 * @param {UserConfig} config The settings for the user who called the interaction.
 */
export type UserConfigCommandHandler = (
  Becca: BeccaLyria,
  interaction: CommandInteraction,
  t: TFunction,
  config: UserConfig
) => Promise<void>;
