/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed containing a link to invite Becca. The link is handled
 * by Becca's domain, to ensure it is up to date with permission and scope
 * changes.
 */
export const handleInvite: CommandHandler = async (Becca, interaction) => {
  try {
    const inviteEmbed = new MessageEmbed();
    inviteEmbed.setTitle("Do you require my assistance?");
    inviteEmbed.setDescription(
      "I suppose I could provide my services to your guild. Click this [invite link](http://invite.beccalyria.com) and I will come serve you. You should also join our [support server](https://chat.nhcarrigan.com)."
    );
    inviteEmbed.setColor(Becca.colours.default);
    inviteEmbed.setFooter("I look forward to working with you.");
    inviteEmbed.setTimestamp();

    await interaction.editReply({ embeds: [inviteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "invite command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "invite", errorId)],
    });
  }
};
