import { MessageEmbed, VoiceState } from "discord.js";

import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs when a member's voice state changes (such as they enter a voice channel,
 * leave a voice channel, or move between voice channels).
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {VoiceState} oldState The member's voice state before the update.
 * @param {VoiceState} newState The member's voice state after the update.
 */
export const voiceStateUpdate = async (
  Becca: BeccaInt,
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> => {
  try {
    const voiceEmbed = new MessageEmbed();
    voiceEmbed.setTimestamp();
    voiceEmbed.setFooter(`ID: ${oldState.id}`);

    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      voiceEmbed.setTitle("Member switched channels!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has moved from <#${oldState.channelId}> to <#${newState.channelId}>.`
      );
      voiceEmbed.setColor(Becca.colours.warning);
    }

    if (oldState.channelId && !newState.channelId) {
      voiceEmbed.setTitle("Member left voice channel!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has left the <#${oldState.channelId}> channel.`
      );
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (!oldState.channelId && newState.channelId) {
      voiceEmbed.setTitle("Member joined voice channel!");
      voiceEmbed.setDescription(
        `<@!${oldState.id}> has joined the <#${newState.channelId}> channel.`
      );
      voiceEmbed.setColor(Becca.colours.success);
    }

    if (!oldState.mute && newState.mute) {
      voiceEmbed.setTitle("Member voice muted!");
      voiceEmbed.setDescription(
        `<@!${newState.id}> has been voice ${newState.selfMute ? "self muted" : "server muted"}.`
      );
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (oldState.mute && !newState.mute) {
      voiceEmbed.setTitle("Member voice unmuted!");
      voiceEmbed.setDescription(
        `<@!${newState.id}> has been voice ${oldState.selfMute ? "self unmuted" : "server unmuted"}.`
      );
      voiceEmbed.setColor(Becca.colours.success);
    }

    if (!oldState.deaf && newState.deaf) {
      voiceEmbed.setTitle("Member voice deafened!");
      voiceEmbed.setDescription(
        `<@!${newState.id}> has been voice ${newState.selfDeaf ? "self deafened" : "server deafened"}.`
      );
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (oldState.deaf && !newState.deaf) {
      voiceEmbed.setTitle("Member voice undeafened!");
      voiceEmbed.setDescription(
        `<@!${newState.id}> has been voice ${oldState.selfDeaf ? "self undeafened" : "server undeafened"}.`
      );
      voiceEmbed.setColor(Becca.colours.success);
    }

    await sendLogEmbed(Becca, oldState.guild, voiceEmbed);
  } catch (err) {
    beccaErrorHandler(Becca, "voice state update listener", err);
  }
};
