import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Message, MessageEmbed } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { CommandData } from "../../interfaces/commands/CommandData";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to unregister a command.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiUnregisterCommand = async (
  Becca: BeccaLyria,
  message: Message
) => {
  try {
    // Naomi unregister <command>
    const [, , target] = message.content.split(" ");

    const targetCommand = Becca.commands.find((el) => el.data.name === target);

    if (!targetCommand) {
      await message.reply("I cannot seem to find that spell.");
      return;
    }

    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandData[];

    const command = commands.find((el) => el.name === targetCommand.data.name);

    if (!command) {
      await message.reply("That spell does not appear to be prepared.");
      return;
    }

    await rest.delete(
      `${Routes.applicationCommands(Becca.configs.id)}/${command.id}`
    );

    const confirm = new MessageEmbed();
    confirm.setTitle(`${command.name} forgotten!`);
    confirm.setDescription(command.description);

    if (command.options) {
      for (const option of command.options) {
        confirm.addField(option.name, option.description, true);
      }
    }

    await message.reply({ embeds: [confirm] });
    await Becca.debugHook.send(
      `Hey <@!${Becca.configs.ownerId}>, the ${command.name} command was unregistered.`
    );
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "unregister command",
      err,
      message.guild?.name,
      message
    );
  }
};
