import { MessageEmbed } from "discord.js";
import { SusColours, SusNames } from "../../config/commands/susList";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const sus: CommandInt = {
  name: "sus",
  description: "Returns which Among Us player is sus.",
  category: "game",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const random = Math.floor(Math.random() * SusNames.length);
      const susEmbed = new MessageEmbed();
      susEmbed.setTitle("Emergency Meeting!");
      susEmbed.setDescription(SusNames[random] + " is the new SUS!");
      susEmbed.setColor(SusColours[random]);
      susEmbed.setTimestamp();

      return { success: true, content: susEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "sus command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "sus", errorId),
      };
    }
  },
};
