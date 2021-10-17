import { Message } from "discord.js";

import { BeccaLyria } from "../BeccaLyria";
import { ServerConfig } from "../database/ServerConfig";

export type ListenerHandler = (
  Becca: BeccaLyria,
  message: Message,
  config: ServerConfig
) => Promise<void>;
