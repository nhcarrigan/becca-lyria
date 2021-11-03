import prom from "prom-client";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaLogHandler } from "../utils/beccaLogHandler";

/**
 * Module to load the Grafana config and attach it to Becca.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {boolean} True if Grafana was mounted successfully.
 */
export const loadGrafana = (Becca: BeccaLyria): boolean => {
  try {
    Becca.grafana = {
      client: prom,
      register: new prom.Registry(),
      metrics: {
        events: new prom.Counter({
          name: "discord_events",
          help: "Gateway events received from Discord.",
          labelNames: ["eventType"],
        }),
        commands: new prom.Counter({
          name: "bot_commands",
          help: "Bot commands executed by users.",
          labelNames: ["command"],
        }),
        errors: new prom.Counter({
          name: "process_errors",
          help: "Errors that occurred in the process.",
        }),
        guilds: new prom.Gauge({
          name: "discord_guilds",
          help: "Number of guilds the bot is in.",
        }),
        users: new prom.Gauge({
          name: "discord_users",
          help: "Number of users the bot is helping.",
        }),
      },
    };

    Becca.grafana.register.setDefaultLabels({
      app: "becca-lyria",
    });
    Becca.grafana.client.collectDefaultMetrics({
      register: Becca.grafana.register,
    });
    Becca.grafana.register.registerMetric(Becca.grafana.metrics.events);
    Becca.grafana.register.registerMetric(Becca.grafana.metrics.commands);
    Becca.grafana.register.registerMetric(Becca.grafana.metrics.errors);
    Becca.grafana.register.registerMetric(Becca.grafana.metrics.guilds);
    Becca.grafana.register.registerMetric(Becca.grafana.metrics.users);

    return true;
  } catch (err) {
    beccaLogHandler.log("error", err);
    return false;
  }
};
