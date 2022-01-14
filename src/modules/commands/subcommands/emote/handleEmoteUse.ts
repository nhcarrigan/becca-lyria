/* eslint-disable jsdoc/require-param */
import {
  EmoteAction,
  smackList,
  throwList,
} from "../../../../config/commands/emoteData";
import { EmoteOptOut } from "../../../../config/optout/EmoteOptOut";
import EmoteCountModel from "../../../../database/models/EmoteCountModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Handles the logic for using an emote.
 */
export const handleEmoteUse: CommandHandler = async (Becca, interaction, t) => {
  try {
    const action = interaction.options.getString("emote", true) as EmoteAction;
    const target = interaction.options.getUser("target", true);

    if (EmoteOptOut.includes(target.id)) {
      await interaction.editReply(
        "This member has opted out of the emote system."
      );
      return;
    }

    if (target.id === interaction.user.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noEmoteSelf")),
      });
      return;
    }

    if (target.id === Becca.configs.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noEmoteBecca")),
      });
      return;
    }

    const targetData =
      (await EmoteCountModel.findOne({ userId: target.id })) ||
      (await EmoteCountModel.create({
        userId: target.id,
        userName: target.username,
        avatar: target.displayAvatarURL(),
        hug: 0,
        kiss: 0,
        pat: 0,
        boop: 0,
        smack: 0,
        throw: 0,
        uwu: 0,
      }));

    let result = "oh no there should have been something here!";

    switch (action) {
      case "hug":
        targetData.hug++;
        result = `You gave <@!${target.id}> a big hug! They have been hugged ${targetData.hug} times!`;
        break;
      case "kiss":
        targetData.kiss++;
        result = `You gave <@!${target.id}> a kiss on the cheek! They have been kissed ${targetData.kiss} times!`;
        break;
      case "pat":
        targetData.pat++;
        result = `You gave <@!${target.id}> a gentle pat on the head! They have been patted ${targetData.pat} times!`;
        break;
      case "boop":
        targetData.boop++;
        result = `You boop <@!${target.id}> on the nose! They have been booped ${targetData.boop} times.`;
        break;
      case "smack":
        targetData.smack++;
        result = `You smack <@!${target.id}> with ${getRandomValue(
          smackList
        )}! They have been smacked ${targetData.smack} times.`;
        break;
      case "throw":
        targetData.throw++;
        result = `You throw ${getRandomValue(throwList)} at <@!${
          target.id
        }>! They have had ${targetData.throw} things thrown at them.`;
        break;
      case "uwu":
        targetData.uwu++;
        result = `Youwu makey-wakey an UwU face at <@!${target.id}>. They have been given ${targetData.uwu} UwU faces. Teehee!`;
        break;
    }

    targetData.userName = target.username;
    targetData.avatar = target.displayAvatarURL();
    await targetData.save();

    await interaction.editReply({ content: result });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote use command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote use", errorId)],
    });
  }
};
