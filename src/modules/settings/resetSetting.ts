import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { ServerConfig } from "../../interfaces/database/ServerConfig";
import { Settings } from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * This will reset the given setting to the default value.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverID Discord ID of the server to modify settings for.
 * @param {string} serverName Name of that server.
 * @param {Settings} key The name of the setting to modify.
 * @param {ServerConfig} server The server configuration entry from the database.
 * @returns {ServerConfig | null} The server setting object, or null on error.
 */
export const resetSetting = async (
  Becca: BeccaLyria,
  serverID: string,
  serverName: string,
  key: Settings,
  server: ServerConfig
): Promise<ServerConfig | null> => {
  try {
    server.set(key, defaultServer[key]);
    server.markModified(key);
    await server.save();
    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "reset setting module", err, serverName);
    return null;
  }
};
