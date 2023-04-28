import { servers } from "@prisma/client";
import { Message } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

export type ListenerHandler = (
  Becca: BeccaLyria,
  message: Message,
  t: TFunction,
  config: servers
) => Promise<void | boolean>;
