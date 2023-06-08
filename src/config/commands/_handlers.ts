import { defaultHandler } from "../../commands/subcommands/_handlers/_defaultHandler";
import { settingsHandler } from "../../commands/subcommands/_handlers/settingsHandler";
import { CommandHandler } from "../../interfaces/commands/CommandHandler";
import { CommandName } from "../../interfaces/commands/CommandName";

export const CommandHandlers: { [key in CommandName]: CommandHandler } = {
  automod: settingsHandler("automod"),
  becca: defaultHandler("becca"),
  code: defaultHandler("code"),
  community: defaultHandler("community"),
  config: settingsHandler("config"),
  currency: settingsHandler("currency"),
  emote: defaultHandler("emote"),
  games: defaultHandler("games"),
  levels: settingsHandler("levels"),
  log: settingsHandler("log"),
  manage: defaultHandler("manage"),
  misc: defaultHandler("misc"),
  mod: defaultHandler("mod"),
  optOut: defaultHandler("optOut"),
  post: defaultHandler("post"),
  reactionrole: defaultHandler("reactionrole"),
  support: defaultHandler("support"),
  triggers: defaultHandler("triggers"),
  userconfig: defaultHandler("userconfig"),
  welcome: defaultHandler("welcome"),
};

export const SubcommandHandlers = {};
