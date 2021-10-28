/* eslint-disable jsdoc/require-param */
import { GuildMember, TextChannel } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Allows the suggestion embed with the given `id` to be marked as approved or
 * denied (determined by the `action`). Appends the `action` and the `reason` to the
 * suggestion embed.
 */
export const handleSuggestion: CommandHandler = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { user: author, guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.missingGuild),
      });
      return;
    }

    if (!(member as GuildMember).permissions.has("MANAGE_GUILD")) {
      await interaction.editReply({
        content: getRandomValue(Becca.responses.noPermission),
      });
      return;
    }

    const action = interaction.options.getString("action", true);
    const suggestionId = interaction.options.getString("id", true);
    const reason = interaction.options.getString("reason", true);

    const suggestionChannel = guild.channels.cache.find(
      (el) => el.id === config.suggestion_channel
    );

    if (!suggestionChannel) {
      await interaction.editReply({
        content: "So... where exactly *are* your suggestions?",
      });
      return;
    }

    const targetSuggestion = await (
      suggestionChannel as TextChannel
    ).messages.fetch(`${BigInt(suggestionId)}`);

    if (!targetSuggestion) {
      await interaction.editReply({
        content: "It seems that suggestion fell off the notice board.",
      });
      return;
    }

    const embeddedSuggestion = targetSuggestion.embeds[0];

    if (
      !embeddedSuggestion ||
      embeddedSuggestion.title !== "Someone had an idea:"
    ) {
      await interaction.editReply({
        content: "That is not a suggestion. I am not messing with that.",
      });
      return;
    }

    if (embeddedSuggestion.fields.length) {
      await interaction.editReply({
        content: "I already put a decision on this one. We cannot do it again.",
      });
      return;
    }

    embeddedSuggestion.addField(
      action === "approve" ? "Suggestion approved by" : "Suggestion denied by",
      `<@!${author.id}>`
    );
    embeddedSuggestion.addField("Reason", customSubstring(reason, 1000));
    embeddedSuggestion.setColor(
      action === "approve" ? Becca.colours.success : Becca.colours.error
    );

    targetSuggestion.edit({ embeds: [embeddedSuggestion] });

    await interaction.editReply({ content: "Signed, sealed, and delivered." });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "suggestion command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "suggestion", errorId)],
    });
  }
};
