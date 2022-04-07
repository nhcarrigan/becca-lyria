import { ButtonInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getRandomValue } from "../../utils/getRandomValue";
import { errorEmbedGenerator } from "../commands/errorEmbedGenerator";

/**
 * Handles the process of adding/removing a role on button click.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 */
export const reactionButtonClick = async (
  Becca: BeccaLyria,
  t: TFunction,
  interaction: ButtonInteraction
) => {
  try {
    const { guild, customId, member } = interaction;
    if (!guild || !member || Array.isArray(member.roles)) {
      await interaction.editReply(getRandomValue(t("responses:missingGuild")));
      return;
    }

    const roleId = customId.split("-")[1];
    const role = await guild.roles.fetch(roleId);

    if (!role) {
      await interaction.editReply(t("events:interaction.noRole"));
      return;
    }

    let content = "";

    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
      content = t("events:interaction.removedRole");
    } else {
      await member.roles.add(role);
      content = t("events:interaction.addedRole");
    }
    await interaction.editReply({ content });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reaction button",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reaction button", errorId, t)],
    });
  }
};
