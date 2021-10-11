import { defaultServer } from "../../config/database/defaultServer";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { ServerConfig } from "../../interfaces/database/ServerConfig";
import { SettingsTypes } from "../../interfaces/settings/SettingsTypes";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * This will reset the given setting to the default value.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {string} serverID Discord ID of the server to modify settings for.
 * @param {string} serverName Name of that server.
 * @param {SettingsTypes} key The name of the setting to modify.
 * @param {ServerConfig} server The server configuration entry from the database.
 * @returns {ServerConfig | null} The server setting object, or null on error.
 */
export const resetSetting = async (
  Becca: BeccaInt,
  serverID: string,
  serverName: string,
  key: SettingsTypes,
  server: ServerConfig
): Promise<ServerConfig | null> => {
  try {
    server.set(key, defaultServer[key]);
    server.markModified(key);
    await server.save();
    return server;
  } catch (err) {
    beccaErrorHandler(Becca, "reset setting module", err, serverName);
    return null;
  }
};
