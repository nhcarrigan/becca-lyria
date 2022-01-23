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
      await interaction.editReply(t("commands:emote.use.optout"));
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

    let result = t("commands:emote.use.null");
    const user = `<@!${target.id}>`;

    switch (action) {
      case "hug":
        targetData.hug++;
        result = t("commands:emote.use.hug", { user, count: targetData.hug });
        break;
      case "kiss":
        targetData.kiss++;
        result = t("commands:emote.use.kiss", { user, total: targetData.kiss });
        break;
      case "pat":
        targetData.pat++;
        result = t("commands:emote.use.pat", { user, total: targetData.pat });
        break;
      case "boop":
        targetData.boop++;
        result = t("commands:emote.use.boop", { user, total: targetData.boop });
        break;
      case "smack":
        targetData.smack++;
        result = t("commands:emote.use.smack", {
          user,
          total: targetData.smack,
          item: getRandomValue(smackList),
        });
        break;
      case "throw":
        targetData.throw++;
        result = t("commands:emote.use.throw", {
          user,
          total: targetData.throw,
          item: getRandomValue(throwList),
        });
        break;
      case "uwu":
        targetData.uwu++;
        result = t("commands:emote.use.uwu", { user, total: targetData.uwu });
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
      embeds: [errorEmbedGenerator(Becca, "emote use", errorId, t)],
    });
  }
};
