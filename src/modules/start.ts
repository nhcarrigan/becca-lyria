/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import {
  MessageFlags,
  type ChatInputCommandInteraction,
} from "discord.js";
import { personality } from "../config/personality.js";
import { ai } from "../utils/ai.js";
import { calculateCost } from "../utils/calculateCost.js";
import { logger } from "../utils/logger.js";
import { replyToError } from "../utils/replyToError.js";

/**
 * Asks the AI to start a new story.
 * @param interaction - The interaction payload from Discord.
 */
export const start = async(
  interaction: ChatInputCommandInteraction,
): Promise<void> => {
  try {
    await interaction.deferReply({ flags: [ MessageFlags.Ephemeral ] });

    const messages = await ai.messages.create({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Required key format for SDK.
      max_tokens: 2000,
      messages:   [
        { content: "Please start a new story for me.", role: "user" },
      ],
      model:  "claude-3-5-sonnet-latest",
      system: `${personality} The user has requested to start a new adventure. You should generate the first message for the game. The user's name is ${interaction.user.displayName}`,
    });

    const response = messages.content.find((m) => {
      return m.type === "text";
    });

    const sent = response
      ? await interaction.user.send({
        content: response.text,
      }).catch(() => {
        return null;
      })
      : null;

    await interaction.editReply({
      content: sent
        ? "I have sent you a DM to start your adventure!"
        // eslint-disable-next-line stylistic/max-len -- This is a long string.
        : "I was unable to send you a DM. Please ensure your privacy settings allow direct messages.",
    });

    await calculateCost(messages.usage, interaction.user.username);
  } catch (error) {
    await replyToError(interaction);
    if (error instanceof Error) {
      await logger.error("about command", error);
    }
  }
};
