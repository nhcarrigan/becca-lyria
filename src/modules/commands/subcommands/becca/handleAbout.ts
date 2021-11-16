/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getCounts } from "../../../becca/getCounts";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing information about Becca.
 */
export const handleAbout: CommandHandler = async (Becca, interaction) => {
  try {
    const { guilds, members, commands } = getCounts(Becca);
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setColor(Becca.colours.default);
    aboutEmbed.setTitle("Becca Lyria the Discord Bot");
    aboutEmbed.setDescription(
      "Becca was created by [nhcarrigan](https://www.nhcarrigan.com). You can [view her source code](https://github.com/beccalyria/discord-bot) or join the [official chat server](http://chat.nhcarrigan.com)."
    );
    aboutEmbed.addField(
      "Version",
      process.env.npm_package_version || "unknown version",
      true
    );
    aboutEmbed.addField("Creation date", "Sunday, 31 May 2020", true);
    aboutEmbed.addField("Guilds", guilds.toString(), true);
    aboutEmbed.addField("Members", members.toString(), true);
    aboutEmbed.addField("Available spells", commands.toString(), true);
    aboutEmbed.addField("Favourite Colour", "Purple", true);
    aboutEmbed.setFooter("Like the bot? Donate: https://donate.nhcarrigan.com");

    await interaction.editReply({ embeds: [aboutEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "about", errorId)],
    });
  }
};
