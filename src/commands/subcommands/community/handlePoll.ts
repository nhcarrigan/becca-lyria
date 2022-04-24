/* eslint-disable jsdoc/require-param */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Creates an embed containing the `question` as the description, the `a`, `b`,
 * `c`, and `d` options as fields, and attaches buttons for those options.
 * Clicking a button allows the user to vote for the option. Users can only vote
 * once.
 */
export const handlePoll: CommandHandler = async (Becca, interaction, t) => {
  try {
    const question = interaction.options.getString("question", true);
    const optionA = interaction.options.getString("a", true);
    const optionB = interaction.options.getString("b", true);
    const optionC = interaction.options.getString("c", true);
    const optionD = interaction.options.getString("d", true);

    const responses: { userId: string; response: string }[] = [];

    const pollEmbed = new MessageEmbed();
    pollEmbed.setTitle(t("commands:community.poll.title"));
    pollEmbed.setDescription(question);
    pollEmbed.addField("A", optionA, true);
    pollEmbed.addField("B", optionB, true);
    pollEmbed.addField("\u200b", "\u200b", true);
    pollEmbed.addField("C", optionC, true);
    pollEmbed.addField("D", optionD, true);
    pollEmbed.addField("\u200b", "\u200b", true);
    pollEmbed.setColor(Becca.colours.default);
    pollEmbed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    const buttonA = new MessageButton()
      .setEmoji("🇦")
      .setCustomId("a")
      .setStyle("PRIMARY");
    const buttonB = new MessageButton()
      .setEmoji("🇧")
      .setCustomId("b")
      .setStyle("PRIMARY");
    const buttonC = new MessageButton()
      .setEmoji("🇨")
      .setCustomId("c")
      .setStyle("PRIMARY");
    const buttonD = new MessageButton()
      .setEmoji("🇩")
      .setCustomId("d")
      .setStyle("PRIMARY");

    const row = new MessageActionRow().addComponents([
      buttonA,
      buttonB,
      buttonC,
      buttonD,
    ]);

    const message = (await interaction.editReply({
      embeds: [pollEmbed],
      components: [row],
    })) as Message;

    const collector = message.createMessageComponentCollector({
      time: 1800000,
    });

    collector.on("collect", async (click) => {
      await click.deferReply({ ephemeral: true });
      if (responses.find((el) => el.userId === click.user.id)) {
        await click.editReply(t("commands:community.pull.failed"));
        return;
      }
      responses.push({ userId: click.user.id, response: click.customId });
      await click.editReply(
        t("commands:community.poll.success", { id: click.customId })
      );
    });

    collector.on("end", async () => {
      const countsA = responses.filter((el) => el.response === "a").length;
      const countsB = responses.filter((el) => el.response === "b").length;
      const countsC = responses.filter((el) => el.response === "c").length;
      const countsD = responses.filter((el) => el.response === "d").length;

      pollEmbed.addField(
        t("commands:community.poll.results"),
        `**A:** ${countsA}\n**B:** ${countsB}\n**C:** ${countsC}\n**D:** ${countsD}`
      );

      buttonA.setDisabled(true);
      buttonB.setDisabled(true);
      buttonC.setDisabled(true);
      buttonD.setDisabled(true);

      const disabledRow = new MessageActionRow().addComponents([
        buttonA,
        buttonB,
        buttonC,
        buttonD,
      ]);

      await message.edit({ embeds: [pollEmbed], components: [disabledRow] });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "poll command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "poll", errorId, t)],
    });
  }
};
