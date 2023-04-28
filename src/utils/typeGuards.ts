import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";

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
