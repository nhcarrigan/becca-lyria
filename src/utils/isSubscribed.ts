/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";

/**
 * Checks if a user has an active entitlement (subscription) for the bot.
 * If they do not, it responds to the interaction with a button to subscribe.
 * @param interaction -- The interaction payload from Discord.
 * @returns A boolean indicating whether the user is subscribed.
 */
const isSubscribedInteraction = async(
  interaction: ChatInputCommandInteraction,
): Promise<boolean> => {
  const isEntitled = interaction.entitlements.find((entitlement) => {
    return entitlement.userId === interaction.user.id && entitlement.isActive();
  });

  if (!isEntitled && interaction.user.id !== "465650873650118659") {
    const subscribeButton = new ButtonBuilder().
      setStyle(ButtonStyle.Premium).
      setSKUId("1343347225698500744");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      subscribeButton,
    );
    await interaction.editReply({
      components: [ row ],
      content:    "You must be subscribed to use this feature.",
    });
    return false;
  }
  return true;
};

/**
 * Checks if a user has an active entitlement (subscription) for the bot.
 * If they do not, it responds to the message with a button to subscribe.
 * @param message -- The message payload from Discord.
 * @returns A boolean indicating whether the user is subscribed.
 */
const isSubscribedMessage = async(
  message: Message,
): Promise<boolean> => {
  if (message.author.id === "465650873650118659") {
    return true;
  }
  const subscribeButton = new ButtonBuilder().
    setStyle(ButtonStyle.Premium).
    setSKUId("1343347225698500744");
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    subscribeButton,
  );
  await message.client.application.entitlements.fetch();
  const isEntitled = message.client.application.entitlements.cache.find(
    (entitlement) => {
      return entitlement.userId === message.author.id && entitlement.isActive();
    },
  );

  if (!isEntitled) {
    await message.reply({
      components: [ row ],
      content:    "You must be subscribed to use this feature.",
    });
    return false;
  }
  return true;
};

export { isSubscribedInteraction, isSubscribedMessage };
