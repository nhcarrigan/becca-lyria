import { Message } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ServerConfig } from "../database/ServerConfig";

export type ListenerHandler = (
  Becca: BeccaLyria,
  message: Message,
  t: TFunction,
  config: ServerConfig
) => Promise<void | boolean>;
