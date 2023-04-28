import { servers } from "@prisma/client";
import { Message } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

export interface Listener {
  name: string;
  description: string;
  /**
   * Handles the logic for a given listener.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {Message} message The message that triggered the listener.
   * @param {TFunction} t The i18n function.
   * @param {servers} config The server settings from the database.
   */
  run: (
    Becca: BeccaLyria,
    message: Message,
    t: TFunction,
    config: servers
  ) => Promise<void>;
}
