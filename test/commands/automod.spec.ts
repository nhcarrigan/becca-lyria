import { assert } from "chai";
import {
  APIApplicationCommandChannelOption,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandStringOption,
  ChannelType,
} from "discord.js";

import { automod } from "../../src/commands/automod";
import { CommandDataHelper } from "../__helpers__/CommandDataHelper";

suite.only("automod command", () => {
  const command = new CommandDataHelper(automod.data.toJSON());
  const subcommandGroups = command.subcommandGroups;
  const subcommands = command.subcommands;
  test("is defined", () => {
    assert.isDefined(automod, "automod is not defined");
    assert.isDefined(automod.data, "data property is missing");
    assert.isObject(automod.data, "data property is not an object");
    assert.isDefined(automod.run, "run property is missing");
    assert.isFunction(automod.run, "run property is not a function");
  });

  test("has correct data", () => {
    assert.equal(automod.data.name, "automod");
    assert.equal(automod.data.description, "Manages the automod config");
    assert.isFalse(automod.data.dm_permission);
    assert.lengthOf(subcommandGroups, 3);
    assert.lengthOf(subcommands, 9);
  });

  test("has 'set' subcommand group", () => {
    const target = command.getSpecificGroup("set");
    assert.exists(target, "Subcommand group 'set' is missing.");
    assert.equal(target?.description, "Set a specific automod setting.");
    const targetSubs = command.getSubcommandsForGroup("set");
    assert.lengthOf(targetSubs, 9);
  });

  test("has 'reset' subcommand group", () => {
    const target = command.getSpecificGroup("reset");
    assert.exists(target, "Subcommand group 'reset' is missing.");
    assert.equal(target?.description, "Clear the value of a specific setting.");
    const targetSubs = command.getSubcommandsForGroup("reset");
    assert.lengthOf(targetSubs, 9);
  });

  test("has 'view' subcommand group", () => {
    const target = command.getSpecificGroup("view");
    assert.exists(target, "Subcommand group 'view' is missing.");
    assert.equal(target?.description, "View your automod settings.");
    const targetSubs = command.getSubcommandsForGroup("view");
    assert.lengthOf(targetSubs, 9);
  });

  test("has 'automod_channels' subcommand", () => {
    const target = command.getSpecificSubcommand("automod_channels");
    assert.exists(target, "Subcommand 'automod_channels' is missing.");
    assert.equal(target?.description, "Add or remove a channel from automod.");
    assert.lengthOf(target?.options || [], 1);
    const firstOption =
      command.getSubcommandOption<APIApplicationCommandChannelOption>(
        "automod_channels",
        0
      );
    assert.exists(firstOption, "Option 'channel' is missing.");
    assert.equal(firstOption?.name, "channel");
    assert.equal(firstOption?.description, "The channel to edit.");
    assert.isTrue(firstOption?.required);
    assert.sameDeepMembers(firstOption?.channel_types || [], [
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.PublicThread,
      ChannelType.GuildForum,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
    ]);
  });

  test("has 'no_automod_channels' subcommand", () => {
    const target = command.getSpecificSubcommand("no_automod_channels");
    assert.exists(target, "Subcommand 'no_automod_channels' is missing.");
    assert.equal(
      target?.description,
      "Add or remove a channel from automod's ignore list."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption =
      command.getSubcommandOption<APIApplicationCommandChannelOption>(
        "automod_channels",
        0
      );
    assert.exists(firstOption, "Option 'channel' is missing.");
    assert.equal(firstOption?.name, "channel");
    assert.equal(firstOption?.description, "The channel to edit.");
    assert.isTrue(firstOption?.required);
    assert.sameDeepMembers(firstOption?.channel_types || [], [
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.PublicThread,
      ChannelType.GuildForum,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
    ]);
  });

  test("has 'automod_roles' subcommand", () => {
    const target = command.getSpecificSubcommand("automod_roles");
    assert.exists(target);
    assert.equal(
      target?.description,
      "Add or remove a role from the automod exemption list."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption = command.getSubcommandOption("automod_roles", 0);
    assert.exists(firstOption, "Option 'role' is missing.");
    assert.equal(firstOption?.name, "role");
    assert.equal(firstOption?.description, "The role to edit.");
    assert.isTrue(firstOption?.required);
  });

  test("has 'allowed_links' subcommand", () => {
    const target = command.getSpecificSubcommand("allowed_links");
    assert.exists(target);
    assert.equal(
      target?.description,
      "Add or remove a regex to test for allowed links."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption = command.getSubcommandOption("allowed_links", 0);
    assert.exists(firstOption, "Option 'regex' is missing.");
    assert.equal(firstOption?.name, "regex");
    assert.equal(firstOption?.description, "The regex to match against links");
    assert.isTrue(firstOption?.required);
  });

  test("has 'link_message' subcommand", () => {
    const target = command.getSpecificSubcommand("link_message");
    assert.exists(target);
    assert.equal(
      target?.description,
      "Set a custom message to be sent when a link is deleted."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption = command.getSubcommandOption("link_message", 0);
    assert.exists(firstOption, "Option 'message' is missing.");
    assert.equal(firstOption?.name, "message");
    assert.equal(firstOption?.description, "The message to send.");
    assert.isTrue(firstOption?.required);
  });

  test("has 'profanity_message' subcommand", () => {
    const target = command.getSpecificSubcommand("profanity_message");
    assert.exists(target);
    assert.equal(
      target?.description,
      "Set a custom message to be sent when profanity is deleted."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption = command.getSubcommandOption("profanity_message", 0);
    assert.exists(firstOption, "Option 'message' is missing.");
    assert.equal(firstOption?.name, "message");
    assert.equal(firstOption?.description, "The message to send.");
    assert.isTrue(firstOption?.required);
  });

  test("has 'antiphish' subcommnad", () => {
    const target = command.getSpecificSubcommand("antiphish");
    assert.exists(target, "Subcommand 'antiphish' is missing.");
    assert.equal(
      target?.description,
      "Set the action to take when a phishing link is detected."
    );
    assert.lengthOf(target?.options || [], 1);
    const firstOption =
      command.getSubcommandOption<APIApplicationCommandStringOption>(
        "antiphish",
        0
      );
    assert.exists(firstOption, "Option 'action' is missing.");
    assert.equal(firstOption?.name, "action");
    assert.equal(firstOption?.description, "The action to take.");
    assert.isTrue(firstOption?.required);
    const choices =
      // @ts-expect-error This is expected because of the type def.
      firstOption?.choices as APIApplicationCommandOptionChoice<string>[];
    const none = choices.find((choice) => choice.value === "none");
    const mute = choices.find((choice) => choice.value === "mute");
    const kick = choices.find((choice) => choice.value === "kick");
    const ban = choices.find((choice) => choice.value === "ban");
    assert.exists(none, "Option with value 'none' is missing.");
    assert.exists(mute, "Option with value 'mute' is missing.");
    assert.exists(kick, "Option with value 'kick' is missing.");
    assert.exists(ban, "Option with value 'ban' is missing.");
    assert.equal(none?.name, "Do nothing when a scam link is detected.");
    assert.equal(mute?.name, "Mute the user for 24 hours.");
    assert.equal(kick?.name, "Kick the user.");
    assert.equal(ban?.name, "Ban the user.");
  });

  test("has 'links' subcommand", () => {
    const target = command.getSpecificSubcommand("links");
    assert.exists(target, "Subcommand 'links' is missing.");
    assert.equal(target?.description, "Toggle Link Detection");
    assert.lengthOf(target?.options || [], 1);
    const firstOption =
      command.getSubcommandOption<APIApplicationCommandStringOption>(
        "links",
        0
      );
    assert.exists(firstOption, "Option 'toggle' is missing.");
    assert.equal(firstOption?.name, "toggle");
    assert.equal(firstOption?.description, "Enable/Disable the setting.");
    assert.isTrue(firstOption?.required);
    const choices =
      // @ts-expect-error This is expected because of the type def.
      firstOption?.choices as APIApplicationCommandOptionChoice<string>[];
    const enable = choices.find((choice) => choice.value === "on");
    const disable = choices.find((choice) => choice.value === "off");
    assert.exists(enable, "Option with value 'on' is missing.");
    assert.exists(disable, "Option with value 'off' is missing.");
    assert.equal(enable?.name, "on");
    assert.equal(disable?.name, "off");
  });

  test("has 'profanity' subcommand", () => {
    const target = command.getSpecificSubcommand("profanity");
    assert.exists(target, "Subcommand 'profanity' is missing.");
    assert.equal(target?.description, "Toggle Profanity Detection");
    assert.lengthOf(target?.options || [], 1);
    const firstOption =
      command.getSubcommandOption<APIApplicationCommandStringOption>(
        "profanity",
        0
      );
    assert.exists(firstOption, "Option 'toggle' is missing.");
    assert.equal(firstOption?.name, "toggle");
    assert.equal(firstOption?.description, "Enable/Disable the setting.");
    assert.isTrue(firstOption?.required);
    const choices =
      // @ts-expect-error This is expected because of the type def.
      firstOption?.choices as APIApplicationCommandOptionChoice<string>[];
    const enable = choices.find((choice) => choice.value === "on");
    const disable = choices.find((choice) => choice.value === "off");
    assert.exists(enable, "Option with value 'on' is missing.");
    assert.exists(disable, "Option with value 'off' is missing.");
    assert.equal(enable?.name, "on");
    assert.equal(disable?.name, "off");
  });
});
