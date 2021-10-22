import { ContextMenuInteraction } from "discord.js";

import { BeccaLyria } from "../BeccaLyria";
import { ServerConfig } from "../database/ServerConfig";

export interface Context {
  data: {
    name: string;
    type: 2 | 3;
  };
  /**
   * Handles the logic for a given context menu interaction.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {ContextMenuInteraction} interaction The context menu interaction payload.
   * @param {ServerConfig} config The server's settings from the database.
   */
  run: (
    Becca: BeccaLyria,
    interaction: ContextMenuInteraction,
    config: ServerConfig
  ) => Promise<void>;
}
