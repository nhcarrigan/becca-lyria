/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates an embed describing the currency system.
 */
export const handleAbout: CurrencyHandler = async (Becca, interaction) => {
  try {
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setTitle("Currency System");
    aboutEmbed.setDescription(
      "Our new currency system allows you to collect BeccaCoin, a virtual currency, and exchange these coins for rewards. These coins can be collected on a daily and weekly basis. Note that these rewards require you to [join our support server](https://chat.nhcarrigan.com)."
    );
    aboutEmbed.addField(
      "Right to Modify",
      "We reserve the right to add, remove, or modify rewards at any time, without prior notice to the users."
    );
    aboutEmbed.addField(
      "No Cash Value",
      "BeccaCoin is a virtual currency with *no cash value*, except for implied value available through the reward exchange."
    );
    aboutEmbed.addField(
      "No Bots",
      "Using automation, scripting, self-bots, or other methods to take advantage of the currency system are violations of Discord Terms of Service and we will deny any rewards obtained this way."
    );
    aboutEmbed.addField(
      "Right to Refuse",
      "The development team reserves the right to refuse any claimed reward without compensation to the user."
    );

    await interaction.editReply({ embeds: [aboutEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "about", errorId)],
    });
  }
};
