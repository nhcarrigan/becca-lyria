import { ContextMenuInteraction } from "discord.js";

import { BeccaInt } from "../BeccaInt";
import { ServerConfig } from "../database/ServerConfig";

export interface ContextInt {
  data: {
    name: string;
    type: 2 | 3;
  };
  /**
   * Handles the logic for a given context menu interaction.
   *
   * @param {BeccaInt} Becca Becca's Discord instance.
   * @param {ContextMenuInteraction} interaction The context menu interaction payload.
   * @param {ServerConfig} config The server's settings from the database.
   */
  run: (
    Becca: BeccaInt,
    interaction: ContextMenuInteraction,
    config: ServerConfig
  ) => Promise<void>;
}
