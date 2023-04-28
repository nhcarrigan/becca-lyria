import { EmoteAction } from "../config/commands/emoteData";
import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";

/**
 * Confirms that a string is a valid moderation action.
 *
 * @param {string} action The string to test.
 * @returns {boolean} If the string matches the ModerationActions type.
 */
export const isModerationAction = (
  action: string
): action is ModerationActions => {
  const actions: { [key in ModerationActions]: string } = {
    ban: "ban",
    kick: "kick",
    mute: "mute",
    unban: "unban",
    unmute: "unmute",
    warn: "warn",
  };
  return Object.keys(actions).includes(action);
};

/**
 * Confirms that az string is a valid emote action.
 *
 * @param {string} emote The string to test.
 * @returns {boolean} If the string matches the EmoteAction type.
 */
export const isEmoteAction = (emote: string): emote is EmoteAction => {
  const actions: { [key in EmoteAction]: string } = {
    hug: "hug",
    kiss: "kiss",
    smack: "smack",
    boop: "boop",
    throw: "throw",
    pat: "pat",
    uwu: "uwu",
  };
  return Object.keys(actions).includes(emote);
};
