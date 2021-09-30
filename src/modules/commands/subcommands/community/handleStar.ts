/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { StarOptOut } from "../../../../config/optout/StarOptOut";
import StarModel from "../../../../database/models/StarModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Generates an embed to give the `user` a gold star for the given `reason`. If the user
 * has not opted out from the tracking, also increments that user's starcount in the database.
 */
export const handleStar: CommandHandler = async (Becca, interaction) => {
  try {
    const { member, guild } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missingGuild });
      return;
    }

    const targetUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    if (!targetUser || !reason) {
      await interaction.editReply({ content: Becca.responses.missingParam });
      return;
    }

    if (StarOptOut.includes(targetUser.id)) {
      await interaction.editReply(
        "I am not permitted to give stars to this user."
      );
      return;
    }

    const starData =
      (await StarModel.findOne({ serverID: guild.id })) ||
      (await StarModel.create({
        serverID: guild.id,
        serverName: guild.name,
        users: [],
      }));

    const targetUserStars = starData.users.find(
      (u) => u.userID === targetUser.id
    );
    if (!targetUserStars) {
      starData.users.push({
        userID: targetUser.id,
        userTag: targetUser.tag,
        avatar: targetUser.displayAvatarURL(),
        stars: 1,
      });
    } else {
      targetUserStars.stars++;
      targetUserStars.userTag = targetUser.tag;
      targetUserStars.avatar = targetUser.displayAvatarURL();
    }

    starData.markModified("users");
    await starData.save();

    const starTotal = targetUserStars?.stars || 1;

    const starEmbed = new MessageEmbed();
    starEmbed.setTitle(`${targetUser.username}, this gold star is for you`);
    starEmbed.setDescription(
      `${member.user.username} wants you to carry this around forever.`
    );
    starEmbed.addField("Reason", customSubstring(reason, 2000));
    starEmbed.setFooter(`You're now carrying ${starTotal} of these. Enjoy.`);
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setTimestamp();
    starEmbed.setImage("https://cdn.nhcarrigan.com/content/projects/star.png");

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "star command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "star", errorId)],
        ephemeral: true,
      })
      .catch(
        async () =>
          await interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "star", errorId)],
          })
      );
  }
};
