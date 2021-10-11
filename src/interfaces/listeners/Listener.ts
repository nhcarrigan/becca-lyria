import { Message } from "discord.js";

import { BeccaLyria } from "../BeccaLyria";
import { ServerConfig } from "../database/ServerConfig";

export interface Listener {
  name: string;
  description: string;
  /**
   * Handles the logic for a given listener.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {Message} message The message that triggered the listener.
   * @param {ServerConfig} config The server settings from the database.
   */
  run: (
    Becca: BeccaLyria,
    message: Message,
    config: ServerConfig
  ) => Promise<void>;
}
