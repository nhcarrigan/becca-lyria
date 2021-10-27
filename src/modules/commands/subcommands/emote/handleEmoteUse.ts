/* eslint-disable jsdoc/require-param */
import {
  EmoteAction,
  smackList,
  throwList,
} from "../../../../config/commands/emoteData";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Handles the logic for using an emote.
 */
export const handleEmoteUse: CommandHandler = async (Becca, interaction) => {
  try {
    const action = interaction.options.getString("emote", true) as EmoteAction;
    const target = interaction.options.getUser("target", true);

    if (target.id === interaction.user.id) {
      await interaction.editReply({ content: "No." });
      return;
    }

    if (target.id === Becca.configs.id) {
      await interaction.editReply({ content: "No." });
      return;
    }

    const targetData = "database here pls";

    let result = "oh no there should have been something here!";

    switch (action) {
      case "hug":
        result = `You gave <@!${target.id}> a big hug! They have been hugged 0 times!`;
        break;
      case "kiss":
        result = `You gave <@!${target.id}> a kiss on the cheek! They have been kissed 0 times!`;
        break;
      case "pat":
        result = `You gave <@!${target.id}> a gentle pat on the head! They have been patted 0 times!`;
        break;
      case "boop":
        result = `You boop <@!${target.id}> on the nose! They have been booped 0 times.`;
        break;
      case "smack":
        result = `You smack <@!${target.id}> with ${getRandomValue(
          smackList
        )}! They have been smacked 0 times.`;
        break;
      case "throw":
        result = `You throw ${getRandomValue(throwList)} at <@!${
          target.id
        }>! They have had 0 things thrown at them.`;
        break;
      case "uwu":
        result = `Youwu makey-wakey an UwU face at <@!${target.id}>. They have been given 0 UwU faces. Teehee!`;
        break;
    }

    await interaction.editReply({ content: result });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote use command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote use", errorId)],
    });
  }
};
