import { Client, ColorResolvable, WebhookClient } from "discord.js";

import { Command } from "./commands/Command";
import { Context } from "./contexts/Context";

/**
 * Model used to pass around Becca's Discord instance with additional
 * configurations attached.
 */
export interface BeccaLyria extends Client {
  commitHash: string;
  debugHook: WebhookClient;
  currencyHook: WebhookClient;
  configs: {
    token: string;
    dbToken: string;
    whUrl: string;
    currencyUrl: string;
    nasaKey: string;
    ownerId: string;
    love: string;
    yes: string;
    no: string;
    think: string;
    version: string;
    id: string;
    homeGuild: string;
  };
  colours: {
    default: ColorResolvable;
    success: ColorResolvable;
    warning: ColorResolvable;
    error: ColorResolvable;
  };
  commands: Command[];
  responses: ResponsesInt;
  contexts: Context[];
  sass: SassyInt;
}

export interface ResponsesInt {
  missingGuild: string;
  invalidCommand: string;
  noPermission: string;
  ownerOnly: string;
  missingParam: string;
  defaultModReason: string;
  noModSelf: string;
  noModBecca: string;
}

export interface SassyInt {
  greeting: string;
  amirite: string;
  sorry: string;
}
