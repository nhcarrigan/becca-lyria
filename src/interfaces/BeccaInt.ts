import { Client, ColorResolvable, WebhookClient } from "discord.js";

import { CommandInt } from "./commands/CommandInt";
import { ContextInt } from "./contexts/ContextInt";

/**
 * Model used to pass around Becca's Discord instance with additional
 * configurations attached.
 */
export interface BeccaInt extends Client {
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
  commands: CommandInt[];
  responses: ResponsesInt;
  contexts: ContextInt[];
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
