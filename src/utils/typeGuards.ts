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
