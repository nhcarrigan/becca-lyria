/* eslint-disable jsdoc/require-param */
import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { IndividualOrbitData } from "../../../interfaces/commands/misc/Orbit";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { getOrbitData } from "../../../modules/commands/misc/getOrbitData";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

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

    const orbitEmbed = new EmbedBuilder();
    orbitEmbed.setTitle(t<string, string>("commands:misc.orbit.title"));
    orbitEmbed.setDescription(
      t<string, string>("commands:misc.orbit.description")
    );
    orbitEmbed.setColor(Becca.colours.default);
    orbitEmbed.setTimestamp();
    orbitEmbed.setFooter({
      text: t<string, string>("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    orbitEmbed.addFields(
      parsed.map((user) => ({
        name: user.attributes.name,
        value:
          user.attributes.love +
          " " +
          t<string, string>("commands:misc.orbit.points"),
        inline: true,
      }))
    );

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
      ? t<string, string>("commands:misc.orbit.record", {
          user: author.username,
          points: authorData.data.data.attributes.love,
        })
      : t<string, string>("commands:misc.orbit.norecord", {
          user: author.username,
        });

    orbitEmbed.addFields([
      {
        name: t<string, string>("commands:misc.orbit.rank"),
        value: authorString,
      },
      {
        name: t<string, string>("commands:misc.orbit.cache"),
        value: String(cached),
      },
    ]);

    orbitEmbed.setFooter({
      text: t<string, string>("commands:misc.orbit.footer"),
    });

    const discordBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji("<:discord:904209263738642482>")
      .setURL("https://chat.nhcarrigan.com")
      .setLabel(t<string, string>("commands:misc.orbit.buttons.discord"));
    const githubBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji("<:github:904209263717658624>")
      .setURL("https://github.com/nhcarrigan")
      .setLabel(t<string, string>("commands:misc.orbit.buttons.github"));
    const twitterBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setEmoji("<:twitter:904209263642177556>")
      .setURL("https://twitter.com/becca_lyria")
      .setLabel(t<string, string>("commands:misc.orbit.buttons.twitter"));

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
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
