import { Message } from "discord.js";

import { BeccaInt } from "../BeccaInt";
import { ServerConfig } from "../database/ServerConfig";

export interface ListenerInt {
  name: string;
  description: string;
  /**
   * Handles the logic for a given listener.
   *
   * @param {BeccaInt} Becca Becca's Discord instance.
   * @param {Message} message The message that triggered the listener.
   * @param {ServerConfig} config The server settings from the database.
   */
  run: (
    Becca: BeccaInt,
    message: Message,
    config: ServerConfig
  ) => Promise<void>;
}
