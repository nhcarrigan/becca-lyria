import { servers } from "@prisma/client";
import { ContextMenuCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

export interface Context {
  data: {
    name: string;
    type: 2 | 3;
  };
  /**
   * Handles the logic for a given context menu interaction.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {ContextMenuCommandInteraction} interaction The context menu interaction payload.
   * @param {TFunction} t The i18next translation function.
   * @param {servers} config The server's settings from the database.
   */
  run: (
    Becca: BeccaLyria,
    interaction: ContextMenuCommandInteraction,
    t: TFunction,
    config: servers
  ) => Promise<void>;
}
