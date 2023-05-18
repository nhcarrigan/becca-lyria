import { PrismaClient } from "@prisma/client";
import { Client, WebhookClient } from "discord.js";

import { Analytics } from "../modules/Analytics";

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
    announcementChannel: string;
    topGGToken: string;
    topGG: string;
    voteChannel: string;
    analyticsSecret: string;
    analyticsUrl: string;
  };
  colours: {
    default: number;
    success: number;
    warning: number;
    error: number;
  };
  commands: Command[];
  contexts: Context[];
  timeOuts: {
    [uuid: string]: NodeJS.Timeout;
  };
  db: PrismaClient;
  analytics: Analytics;
}
