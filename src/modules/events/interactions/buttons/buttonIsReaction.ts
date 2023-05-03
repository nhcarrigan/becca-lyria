import { ButtonHandler } from "../../../../interfaces/buttons/ButtonHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const buttonIsReaction: ButtonHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guild, customId, member } = interaction;
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
