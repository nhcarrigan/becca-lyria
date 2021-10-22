import * as child from "child_process";

import {
  BeccaColours,
  BeccaPhrases,
  BeccaSass,
} from "../config/BeccaResponses";
import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaLogHandler } from "../utils/beccaLogHandler";

/**
 * Validates that all expected environment variables are set with *some* value.
 * Does not validate that the values are valid. Constructs a config object and
 * attaches it to Becca's instance. Also constructs the colours and responses objects
 * and attaches them.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {Object} Object containing a valid property as boolean, and a message as string.
 */
export const validateEnv = (
  Becca: BeccaLyria
): { valid: boolean; message: string } => {
  try {
    if (!process.env.DISCORD_TOKEN) {
      return { valid: false, message: "Missing Discord token!" };
    }

    if (!process.env.MONGODB) {
      return { valid: false, message: "Missing database connection string" };
    }

    if (!process.env.WH_URL) {
      return { valid: false, message: "Missing Discord webhook URL" };
    }

    if (!process.env.CURRENCY_WH) {
      return { valid: false, message: "Missing Discord Currency webhook URL" };
    }

    if (!process.env.NASA_API) {
      beccaLogHandler.log("warn", "Missing NASA API key");
    }

    if (!process.env.OWNER_ID) {
      return { valid: false, message: "Missing Discord ID for owner account" };
    }

    if (!process.env.CLIENT_ID) {
      return { valid: false, message: "Missing Bot's Client ID" };
    }

    if (!process.env.HOME_GUILD_ID) {
      return { valid: false, message: "Missing Bot's Home Guild ID" };
    }

    Becca.commitHash = child.execSync("git rev-parse HEAD").toString().trim();

    const configs: BeccaLyria["configs"] = {
      token: process.env.DISCORD_TOKEN,
      dbToken: process.env.MONGODB,
      whUrl: process.env.WH_URL,
      currencyUrl: process.env.CURRENCY_WH,
      nasaKey: process.env.NASA_API || "",
      ownerId: process.env.OWNER_ID,
      love: process.env.BECCA_LOVE || "💜",
      yes: process.env.BECCA_YES || "✅",
      no: process.env.BECCA_NO || "❌",
      think: process.env.BECCA_THINK || "🤔",
      version: process.env.npm_package_version || "null",
      id: process.env.CLIENT_ID,
      homeGuild: process.env.HOME_GUILD_ID,
    };

    Becca.configs = configs;
    Becca.colours = BeccaColours;
    Becca.responses = BeccaPhrases;
    Becca.sass = BeccaSass;
    return { valid: true, message: "Environment variables validated!" };
  } catch (err) {
    return {
      valid: false,
      message: "Unknown error when validating environment",
    };
  }
};
