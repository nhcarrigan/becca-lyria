/* eslint-disable jsdoc/require-jsdoc */
import { MessageEmbed } from "discord.js";

import ActivityModel from "../database/models/ActivityModel";
import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const activity: Context = {
  data: {
    name: "activity",
    type: 2,
  },
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();
      const target = interaction.options.getUser("user", true);

      const data = await ActivityModel.findOne({ userId: target.id });
      if (!data) {
        await interaction.editReply(
          "That user has not interacted with me yet..."
        );
        return;
      }

      const activityEmbed = new MessageEmbed();
      activityEmbed.setTitle(t("contexts:activity.title"));
      activityEmbed.addField(
        t("contexts:activity.buttons"),
        data.buttons.toString(),
        true
      );
      activityEmbed.addField(
        t("contexts:activity.commands"),
        data.commands.toString(),
        true
      );
      activityEmbed.addField(
        t("contexts:activity.selects"),
        data.selects.toString(),
        true
      );
      activityEmbed.addField(
        t("contexts:activity.contexts"),
        data.contexts.toString(),
        true
      );
      activityEmbed.setColor(Becca.colours.default);
      activityEmbed.setAuthor({
        name: target.tag,
        iconURL: target.displayAvatarURL(),
      });
      activityEmbed.setFooter({
        text: t("defaults:donate"),
        iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
      });

      await interaction.editReply({ embeds: [activityEmbed] });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "activity context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "activity context", errorId)],
      });
    }
  },
};
