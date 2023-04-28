import { Message } from "discord.js";

import ServerConfigModel from "../../database/models/ServerConfigModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to view the current list of commands.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiMigrate = async (Becca: BeccaLyria, message: Message) => {
  try {
    // "~Naomi migrate X"
    const [, , command] = message.content.split(" ");

    if (command === "triggers") {
      const servers = await ServerConfigModel.find();
      await message.reply(`Found ${servers.length} servers.`);
      for (const server of servers) {
        server.newTriggers = server.triggers.map((trigger) => ({
          trigger: trigger[0],
          response: trigger[1],
        }));
        server.markModified("newTriggers");
        await server.save();
      }
      await message.reply("Finished migrating triggers.");
      return;
    }

    await message.reply(`No migration found for ${command}.`);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "migrate command",
      err,
      message.guild?.name,
      message
    );
    await message.reply("Migration failed!");
  }
};
