/* eslint-disable jsdoc/no-undefined-types */
import * as Sentry from "@sentry/node";
import {
  CommandInteraction,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
import { Types } from "mongoose";

import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaLogHandler } from "./beccaLogHandler";
import { customSubstring } from "./customSubstring";

/**
 * Takes the error object generated within the code, passes it to Sentry and logs the
 * information in the console. Then, generates an error ID, builds an error embed, and sends
 * that to the debug hook. Finally, returns the error ID to be passed to the user if applicable.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} context The string explaining where this error was thrown.
 * @param {unknown} err The standard error object (generated in a catch statement).
 * @param {string | undefined} guild The name of the guild that triggered the issue.
 * @param {Message | undefined} message Optional message that triggered the issue.
 * @param { CommandInteraction | ContextMenuInteraction | undefined } interaction Optional interaction that triggered the issue.
 * @returns {Types.ObjectId} A unique ID for the error.
 */
export const beccaErrorHandler = async (
  Becca: BeccaLyria,
  context: string,
  err: unknown,
  guild?: string,
  message?: Message,
  interaction?: CommandInteraction | ContextMenuCommandInteraction
): Promise<Types.ObjectId> => {
  const error = err as Error;
  beccaLogHandler.log("error", `There was an error in the ${context}:`);
  beccaLogHandler.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );

  Sentry.captureException(error);

  const errorId = new Types.ObjectId();
  const errorEmbed = new EmbedBuilder();
  errorEmbed.setTitle(
    `${context} error ${guild ? "in " + guild : "from an unknown source"}.`
  );
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setDescription(customSubstring(error.message, 2000));
  errorEmbed.addFields([
    {
      name: "Stack Trace:",
      value: `\`\`\`\n${customSubstring(error.stack || "null", 1000)}\n\`\`\``,
    },
    { name: "Error ID:", value: errorId.toHexString() },
  ]);
  errorEmbed.setTimestamp();
  if (message) {
    errorEmbed.addFields([
      {
        name: "Message Content:",
        value: customSubstring(message.content, 1000),
      },
    ]);
  }

  if (interaction) {
    errorEmbed.addFields([
      {
        name: "Interaction Details",
        value: customSubstring(
          `${interaction.commandName} ${
            interaction.isChatInputCommand()
              ? interaction.options.getSubcommand() || ""
              : ""
          }`,
          1000
        ),
      },
      {
        name: "Interaction Options",
        value: customSubstring(
          interaction.options.data[0].options
            ?.map((o) => `\`${o.name}\`: ${o.value}`)
            .join(", ") || "no options",
          1000
        ),
      },
    ]);
  }
  await Becca.debugHook.send({ embeds: [errorEmbed] });

  return errorId;
};
