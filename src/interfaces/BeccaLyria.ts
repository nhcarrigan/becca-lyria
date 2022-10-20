import io from "@pm2/io";
import Gauge from "@pm2/io/build/main/utils/metrics/gauge";
import Meter from "@pm2/io/build/main/utils/metrics/meter";
import { Client, WebhookClient } from "discord.js";

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
  currencyReminderHook: WebhookClient;
  feedbackHook: WebhookClient;
  configs: {
    token: string;
    dbToken: string;
    whUrl: string;
    currencyUrl: string;
    currencyReminderUrl: string;
    feedbackUrl: string;
    nasaKey: string;
    ownerId: string;
    love: string;
    yes: string;
    no: string;
    think: string;
    version: string;
    id: string;
    homeGuild: string;
    topGGToken: string;
    topGG: string;
    voteChannel: string;
    habiticaKey: string;
    orbitKey: string;
    heptagramApiToken: string;
  };
  colours: {
    default: number;
    success: number;
    warning: number;
    error: number;
  };
  commands: Command[];
  contexts: Context[];
  dataCache: {
    orbitData: OrbitMember[];
  };
  timeOuts: {
    [uuid: string]: NodeJS.Timeout;
  };
  pm2: {
    client: typeof io;
    metrics: {
      events: Meter;
      commands: Meter;
      errors: Meter;
      guilds: Gauge;
      users: Gauge;
    };
  };
}
