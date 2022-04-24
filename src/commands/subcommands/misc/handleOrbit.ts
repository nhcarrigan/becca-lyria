/* eslint-disable jsdoc/require-param */
import axios from "axios";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { IndividualOrbitData } from "../../../interfaces/commands/misc/Orbit";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { getOrbitData } from "../../../modules/commands/misc/getOrbitData";

/**
 * Generates the Orbit leaderboard and parses into an embed.
 */
export const handleOrbit: CommandHandler = async (Becca, interaction, t) => {
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
    orbitEmbed.setTitle(t("commands:misc.orbit.title"));
    orbitEmbed.setDescription(t("commands:misc.orbit.description"));
    orbitEmbed.setColor(Becca.colours.default);
    orbitEmbed.setTimestamp();
    orbitEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    parsed.forEach((user) => {
      orbitEmbed.addField(
        user.attributes.name,
        user.attributes.love + " " + t("commands:misc.orbit.points"),
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
      ? t("commands:misc.orbit.record", {
          user: author.username,
          points: authorData.data.data.attributes.love,
        })
      : t("commands:misc.orbit.norecord", { user: author.username });

    orbitEmbed.addField(t("commands:misc.orbit.rank"), authorString);
    orbitEmbed.addField(t("commands:misc.orbit.cache"), String(cached));
    orbitEmbed.setFooter(t("commands:misc.orbit.footer"));

    const discordBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:discord:904209263738642482>")
      .setURL("https://chat.nhcarrigan.com")
      .setLabel(t("commands:misc.orbit.buttons.discord"));
    const githubBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:github:904209263717658624>")
      .setURL("https://github.com/nhcarrigan")
      .setLabel(t("commands:misc.orbit.buttons.github"));
    const twitterBtn = new MessageButton()
      .setStyle("LINK")
      .setEmoji("<:twitter:904209263642177556>")
      .setURL("https://twitter.com/becca_lyria")
      .setLabel(t("commands:misc.orbit.buttons.twitter"));

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
      embeds: [errorEmbedGenerator(Becca, "orbit", errorId, t)],
    });
  }
};
