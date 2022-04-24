/* eslint-disable camelcase */
/* eslint-disable jsdoc/require-param */
import axios from "axios";
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Trivia } from "../../../interfaces/commands/games/Trivia";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { replaceHtml } from "../../../utils/replaceHtml";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";

/**
 * Fetches a trivia question from an API, generates it into an embed. Adds buttons
 * to that embed for the four answers, then collects button responses from users.
 * Tracks the users that answered correctly and announces the winners after 30 seconds.
 */
export const handleTrivia: CommandHandler = async (Becca, interaction, t) => {
  try {
    const letters = ["A", "B", "C", "D"];

    const data = await axios.get<Trivia>(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const { category, correct_answer, incorrect_answers, question } =
      data.data.results[0];

    const answers = incorrect_answers.map((el) => replaceHtml(el));
    answers.push(replaceHtml(correct_answer));
    answers.sort();

    const correctAnswerLetter =
      letters[answers.indexOf(replaceHtml(correct_answer))];

    const answered: string[] = [];
    const correct: string[] = [];

    const triviaEmbed = new MessageEmbed();
    triviaEmbed.setColor(Becca.colours.default);
    triviaEmbed.setTitle(category);
    triviaEmbed.setDescription(replaceHtml(question));
    triviaEmbed.addField("A", answers[0], true);
    triviaEmbed.addField("B", answers[1], true);
    triviaEmbed.addField("\u200b", "\u200b", true);
    triviaEmbed.addField("C", answers[2], true);
    triviaEmbed.addField("D", answers[3], true);
    triviaEmbed.addField("\u200b", "\u200b", true);
    triviaEmbed.setFooter(t("commands:games.trivia.footer"));

    const resultEmbed = new MessageEmbed();

    const aButton = new MessageButton()
      .setCustomId("a")
      .setLabel("A")
      .setStyle("PRIMARY");
    const bButton = new MessageButton()
      .setCustomId("b")
      .setLabel("B")
      .setStyle("PRIMARY");
    const cButton = new MessageButton()
      .setCustomId("c")
      .setLabel("C")
      .setStyle("PRIMARY");
    const dButton = new MessageButton()
      .setCustomId("d")
      .setLabel("D")
      .setStyle("PRIMARY");

    const buttons = new MessageActionRow().addComponents(
      aButton,
      bButton,
      cButton,
      dButton
    );

    const sentEmbed = (await interaction.editReply({
      embeds: [triviaEmbed],
      components: [buttons],
    })) as Message;

    const answerCollector = sentEmbed.createMessageComponentCollector({
      time: 30000,
    });

    answerCollector.on("collect", async (click) => {
      if (answered.includes(click.user.id)) {
        await click.reply({
          content: t("commands:games.trivia.duplicate"),
          ephemeral: true,
        });
        return;
      }
      await click.reply({
        content: t("commands:games.trivia.answered", {
          answer: click.customId,
        }),
        ephemeral: true,
      });

      if (click.customId.toUpperCase() === correctAnswerLetter) {
        correct.push(click.user.id);
      }
      answered.push(click.user.id);
    });

    answerCollector.on("end", async () => {
      resultEmbed.setTimestamp();
      resultEmbed.setColor(Becca.colours.default);
      resultEmbed.setTitle(
        t("commands:games.trivia.result", { count: correct.length })
      );
      resultEmbed.setDescription(
        customSubstring(correct.map((el) => `<@!${el}>`).join(", "), 4000)
      );
      resultEmbed.addField(
        t("commands:games.trivia.correct"),
        `${correctAnswerLetter}: ${replaceHtml(correct_answer)}`
      );

      await interaction.channel?.send({ embeds: [resultEmbed] });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "trivia command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "trivia", errorId, t)],
    });
  }
};
