/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";
import { connection } from "mongoose";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed with Becca's response time.
 */
export const handlePing: CommandHandler = async (
  Becca,
  interaction,
  t
): Promise<void> => {
  try {
    const receivedInteraction = Date.now();
    const { createdTimestamp } = interaction;

    const discordLatency = receivedInteraction - createdTimestamp;
    const websocketLatency = Becca.ws.ping;

    await connection.db.admin().ping();
    const databaseLatency = Date.now() - receivedInteraction;

    const isSlow =
      discordLatency > 100 || websocketLatency > 100 || databaseLatency > 100;

    const pingEmbed = new MessageEmbed();
    pingEmbed.setTitle(t("commands:becca.ping.title"));
    pingEmbed.setDescription(t("commands:becca.ping.description"));
    pingEmbed.addField(
      t("commands:becca.ping.interaction"),
      `${discordLatency} ms`,
      true
    );
    pingEmbed.addField(
      t("commands:becca.ping.websocket"),
      `${websocketLatency} ms`,
      true
    );
    pingEmbed.addField(
      t("commands:becca.ping.databaase"),
      `${databaseLatency} ms`,
      true
    );
    pingEmbed.setColor(isSlow ? Becca.colours.error : Becca.colours.success);

    await interaction.editReply({ embeds: [pingEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ping command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "ping", errorId, t)],
    });
  }
};
