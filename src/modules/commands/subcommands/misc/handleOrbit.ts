/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { IndividualOrbitData } from "../../../../interfaces/commands/misc/Orbit";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";
import { getOrbitData } from "../../misc/getOrbitData";

/**
 * Generates the Orbit leaderboard and parses into an embed.
 */
export const handleOrbit: CommandHandler = async (Becca, interaction) => {
  try {
    const author = interaction.user;
    let cached = true;

    if (!Becca.dataCache.orbitData.length) {
      cached = false;
      const data = await getOrbitData(Becca);
      // eslint-disable-next-line require-atomic-updates
      Becca.dataCache.orbitData = data;
    }

    const parsed = Becca.dataCache.orbitData
      .sort((a, b) => b.attributes.love - a.attributes.love)
      .slice(0, 25);

    const orbitEmbed = new MessageEmbed();
    orbitEmbed.setTitle("nhcommunity Engagement Leaderboard");
    orbitEmbed.setDescription(
      "This leaderboard represents the global contributions for all of nhcarrigan's party members"
    );
    orbitEmbed.setColor(Becca.colours.default);
    orbitEmbed.setTimestamp();

    parsed.forEach((user) => {
      orbitEmbed.addField(
        user.attributes.name,
        user.attributes.love + " love points",
        true
      );
    });

    const authorData = await axios.get<IndividualOrbitData>(
      `https://app.orbit.love/api/v1/nhcarrigan/members/find?source=discord&username=${author.username}%23${author.discriminator}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Becca.configs.orbitKey}`,
        },
        validateStatus: null,
      }
    );

    const authorString = authorData.data.data
      ? `${author.username} has ${authorData.data.data.attributes.love} love points.`
      : `${author.username} has no Orbit record.`;

    orbitEmbed.addField("Your rank:", authorString);
    orbitEmbed.setFooter(`Data from cache: ${cached}`);

    await interaction.editReply({ embeds: [orbitEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "orbit command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "orbit", errorId)],
    });
  }
};
