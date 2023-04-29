import {
  GuildMember,
  PermissionFlagsBits,
  TextChannel,
  ForumChannel,
} from "discord.js";
import { DefaultTFuncReturn } from "i18next";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { getRandomValue } from "../../../utils/getRandomValue";

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
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:missingGuild")
        ),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      await interaction.editReply({
        content: getRandomValue(
          t<string, DefaultTFuncReturn & string[]>("responses:noPermission")
        ),
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
      suggestionChannel as TextChannel | ForumChannel
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

    targetSuggestion.edit({
      embeds: [
        {
          ...embeddedSuggestion.toJSON(),
          fields: [
            {
              name:
                action === "approve"
                  ? t("commands:manage.suggestion.approved")
                  : t("commands:manage.suggestion.denied"),
              value: `<@!${author.id}>`,
            },
            {
              name: t("commands:manage.suggestion.reason"),
              value: customSubstring(reason, 1000),
            },
          ],
          color:
            action === "approve" ? Becca.colours.success : Becca.colours.error,
        },
      ],
    });

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
