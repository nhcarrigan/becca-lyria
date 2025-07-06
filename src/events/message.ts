/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  type Message,
} from "discord.js";
import { personality } from "../config/personality.js";
import { ai } from "../utils/ai.js";
import { calculateCost } from "../utils/calculateCost.js";
import { isSubscribedMessage } from "../utils/isSubscribed.js";
import { logger } from "../utils/logger.js";
import type { MessageParam } from "@anthropic-ai/sdk/resources/index.js";

/**
 * Handles the Discord message event.
 * @param message - The message payload from Discord.
 */
// eslint-disable-next-line max-lines-per-function, max-statements -- We're off by one bloody line.
export const onMessage = async(message: Message): Promise<void> => {
  try {
    if (message.channel.type !== ChannelType.DM) {
      return;
    }
    if (message.author.bot) {
      return;
    }
    const subbed = await isSubscribedMessage(message);
    if (!subbed) {
      return;
    }
    const historyRequest = await message.channel.messages.fetch({ limit: 20 });
    const history = [ ...historyRequest.values() ];
    const clearMessageIndex = history.findIndex((messageInner) => {
      return (
        messageInner.content === "<Clear History>"
        && messageInner.author.id === message.client.user.id
      );
    });
    if (clearMessageIndex !== -1) {
      // Remove the clear message and everything sent before it, which means everything after in the array because the array is backwards
      history.splice(clearMessageIndex, history.length - clearMessageIndex);
    }
    const context: Array<MessageParam> = history.
      reverse().
      map((messageInner) => {
        return {
          content: messageInner.content,
          role:
            messageInner.author.id === message.client.user.id
              ? "assistant"
              : "user",
        };
      });
    const messages = await ai.messages.create({
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Required key format for SDK.
      max_tokens:  5000,
      messages:    context,
      model:       "claude-sonnet-4-20250514",
      system:      `${personality} Provide a response to the user that continues the story. The user's name is ${message.author.displayName}`,
      temperature: 1,
    });

    const response = messages.content.find((messageInner) => {
      return messageInner.type === "text";
    });

    await message.channel.send(
      response?.text ?? "There was an error. Please try again later.",
    );

    if (!response) {
      await logger.log("info", `No response from AI, here's the payload: ${JSON.stringify(messages)}`);
    }

    await calculateCost(messages.usage, message.author.username);
  } catch (error) {
    await logger.error("message event", error as Error);
    const button = new ButtonBuilder().
      setLabel("Need help?").
      setStyle(ButtonStyle.Link).
      setURL("https://chat.nhcarrigan.com");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await message.reply({
      components: [ row ],
      content:    error instanceof Error
        ? error.message
        : "Something went wrong.",
    });
  }
};
