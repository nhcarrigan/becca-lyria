/* eslint-disable jsdoc/require-param */
import { GuildMember, TextChannel } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Allows the suggestion embed with the given `id` to be marked as approved or
 * denied (determined by the `action`). Appends the `action` and the `reason` to the
 * suggestion embed.
 */
export const handleSuggestion: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { user: author, guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (!(member as GuildMember).permissions.has("MANAGE_GUILD")) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
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
        content: t("commands:manage.suggestion.lost"),
      });
      return;
    }

    const targetSuggestion = await (
      suggestionChannel as TextChannel
    ).messages.fetch(`${BigInt(suggestionId)}`);

    if (!targetSuggestion) {
      await interaction.editReply({
        content: t("commands:manage.suggestion.missing"),
      });
      return;
    }

    const embeddedSuggestion = targetSuggestion.embeds[0];

    if (
      !embeddedSuggestion ||
      embeddedSuggestion.title !== t("commands:community.suggest.title")
    ) {
      await interaction.editReply({
        content: t("commands:manage.suggestion.invalid"),
      });
      return;
    }

    if (embeddedSuggestion.fields.length) {
      await interaction.editReply({
        content: t("commands:manage.suggestion.duplicate"),
      });
      return;
    }

    embeddedSuggestion.addField(
      action === "approve"
        ? t("commands:manage.suggestion.approved")
        : t("commands:manage.suggestion.denied"),
      `<@!${author.id}>`
    );
    embeddedSuggestion.addField(
      t("commands:manage.suggestion.reason"),
      customSubstring(reason, 1000)
    );
    embeddedSuggestion.setColor(
      action === "approve" ? Becca.colours.success : Becca.colours.error
    );

    targetSuggestion.edit({ embeds: [embeddedSuggestion] });

    await interaction.editReply({
      content: t("commands:manage.suggestion.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "suggestion command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "suggestion", errorId, t)],
    });
  }
};
