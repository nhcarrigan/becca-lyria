import { Client, ColorResolvable, WebhookClient } from "discord.js";
import prom from "prom-client";

import { Command } from "./commands/Command";
import { OrbitMember } from "./commands/misc/Orbit";
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
    topGG: string;
    voteChannel: string;
    habiticaKey: string;
    orbitKey: string;
  };
  colours: {
    default: ColorResolvable;
    success: ColorResolvable;
    warning: ColorResolvable;
    error: ColorResolvable;
  };
  commands: Command[];
  responses: {
    missingGuild: string[];
    invalidCommand: string[];
    noPermission: string[];
    ownerOnly: string[];
    noModSelf: string[];
    noModBecca: string[];
    noEmoteSelf: string[];
    noEmoteBecca: string[];
  };
  contexts: Context[];
  sass: {
    greeting: string[];
    amirite: string[];
    sorry: string[];
    selfthanks: string[];
    beccathanks: string[];
  };
  dataCache: {
    orbitData: OrbitMember[];
  };
  grafana: {
    client: typeof prom;
    register: prom.Registry;
    metrics: {
      events: prom.Counter<string>;
      commands: prom.Counter<string>;
      errors: prom.Counter<string>;
      guilds: prom.Gauge<string>;
      users: prom.Gauge<string>;
    };
  };
}
