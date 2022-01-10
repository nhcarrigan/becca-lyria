/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

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
      .slice(0, 20);

    const orbitEmbed = new MessageEmbed();
    orbitEmbed.setTitle("nhcommunity Engagement Leaderboard");
    orbitEmbed.setDescription(
      "This leaderboard represents the global contributions for all of nhcarrigan's party members"
    );
    orbitEmbed.setColor(Becca.colours.default);
    orbitEmbed.setTimestamp();
    orbitEmbed.setFooter(
      "Like the bot? Donate: https://donate.nhcarrigan.com",
      "https://cdn.nhcarrigan.com/profile-transparent.png"
    );

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
    orbitEmbed.addField("Cached Data?", String(cached));
    orbitEmbed.setFooter("Want to join the community? Click below!");

    const discordBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:discord:904209263738642482>")
      .setURL("https://chat.nhcarrigan.com")
      .setLabel("Join Our Server!");
    const githubBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:github:904209263717658624>")
      .setURL("https://github.com/nhcarrigan")
      .setLabel("Contribute on GitHub!");
    const twitterBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:twitter:904209263642177556>")
      .setURL("https://twitter.com/becca_lyria")
      .setLabel("Follow us on Twitter!");

    const buttons = new MessageActionRow().addComponents([
      discordBtn,
      githubBtn,
      twitterBtn,
    ]);

    await interaction.editReply({
      embeds: [orbitEmbed],
      components: [buttons],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "orbit command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "orbit", errorId)],
    });
  }
};
