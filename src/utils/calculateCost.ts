/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { logger } from "./logger.js";
import type { Usage } from "@anthropic-ai/sdk/resources/index.js";

/**
 * Calculates the cost of a command run by a user, and sends to
 * our logging service.
 * @param usage -- The usage payload from Anthropic.
 * @param uuid -- The Discord ID of the user who ran the command.
 */
export const calculateCost = async(
  usage: Usage,
  uuid: string,
): Promise<void> => {
  const inputCost = usage.input_tokens * (3 / 1_000_000);
  const outputCost = usage.output_tokens * (15 / 1_000_000);
  const totalCost = inputCost + outputCost;
  await logger.log(
    "info",
    `User ${uuid} used the bot, which accepted ${usage.input_tokens.toString()} and generated ${usage.output_tokens.toString()}.
    
    Total cost: ${totalCost.toLocaleString("en-GB", {
      currency: "USD",
      style:    "currency",
    })}`,
  );
};
