import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js";

export const automodSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("automod_channels")
    .setDescription("Add or remove a channel from automod.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("no_automod_channels")
    .setDescription("Add or remove a channel from automod's ignore list.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("automod_roles")
    .setDescription("Add or remove a role from the automod exemption list.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("allowed_links")
    .setDescription("Add or remove a regex to test for allowed links.")
    .addStringOption((option) =>
      option
        .setName("regex")
        .setDescription("The regex to match against links")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("link_message")
    .setDescription("Set a custom message to be sent when a link is deleted.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("profanity_message")
    .setDescription(
      "Set a custom message to be sent when profanity is deleted."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("antiphish")
    .setDescription("Set the action to take when a phishing link is detected.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
        .addChoices(
          { name: "Do nothing when a scam link is detected.", value: "none" },
          { name: "Mute the user for 24 hours.", value: "mute" },
          { name: "Kick the user.", value: "kick" },
          { name: "Ban the user.", value: "ban" }
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("links")
    .setDescription("Toggle Link Detection")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Enable/Disable the setting.")
        .setRequired(true)
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
    ),
  new SlashCommandSubcommandBuilder()
    .setName("profanity")
    .setDescription("Toggle Profanity Detection")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Enable/Disable the setting.")
        .setRequired(true)
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
    ),
];

export const configSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("suggestion_channel")
    .setDescription("Set where suggestions should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put suggestions in.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("hearts")
    .setDescription("Add/remove a user from the list of heart reactions.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to toggle.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("blocked")
    .setDescription(
      "Add/remove a user from the list of users who cannot interact with Becca"
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to toggle.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("appeal_link")
    .setDescription("Set a link for your server's ban appeal form.")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The link to include in ban messages.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("sass_mode")
    .setDescription("Toggle Becca's sass mode.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn sass on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("emote_channels")
    .setDescription("Add/remove a channel on the list of emote-only channels.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to toggle emote-only mode in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("report_channel")
    .setDescription("Set where message reports should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to put reports in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ticket_category")
    .setDescription("The category where new tickets should be opened.")
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription("The category to open new tickets in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ticket_log_channel")
    .setDescription("The channel where closed tickets should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel where tickets should be logged.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("ticket_role")
    .setDescription("The role to be added to each new ticket.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to add.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("starboard_emote")
    .setDescription("The emote to track for your starboard.")
    .addStringOption((option) =>
      option
        .setName("emote")
        .setDescription("The emote to listen for.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("starboard_channel")
    .setDescription("Set where successful starboard messages should be posted.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to post in.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("starboard_threshold")
    .setDescription(
      "Set how many reactions are necessary before a message is posted to the starboard."
    )
    .addIntegerOption((option) =>
      option
        .setName("reactions")
        .setDescription("The number of reactions to require.")
        .setRequired(true)
        .setMinValue(1)
    ),
];

export const levelsSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("levels")
    .setDescription("Turn the level system on or off.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn levels on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_channel")
    .setDescription("Set where level + role messages should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_roles")
    .setDescription("Add or remove a level-based role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("The level to assign the role.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_style")
    .setDescription("Set the style of level/role messages.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("The style to use.")
        .addChoices(
          { name: "text", value: "text" },
          { name: "embed", value: "embed" }
        )
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_message")
    .setDescription("Set a custom message to be sent when someone levels up.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("role_message")
    .setDescription(
      "Set a custom message to be sent when someone earns a level role."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("initial_xp")
    .setDescription("Set a value for how much XP a user starts with.")
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("The XP to award when someone joins.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_ignore")
    .setDescription("Add or remove a channel from the levels ignore list.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_decay")
    .setDescription(
      "Set the percentage at which experience should reduce every day."
    )
    .addNumberOption((option) =>
      option
        .setName("percent")
        .setDescription("The daily decay percentage.")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
];

export const logSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("message_events")
    .setDescription("Set where message edits/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("voice_events")
    .setDescription("Set where voice chat leaves/joins/mutes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("thread_events")
    .setDescription("Set where thread create/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("member_events")
    .setDescription("Set where member updates should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("moderation_events")
    .setDescription("Set where moderation actions should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
];

export const welcomeSubcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("welcome_channel")
    .setDescription("Set the channel where welcome messages are sent.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to use.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("depart_channel")
    .setDescription("Set the channel where goodbye messages are sent.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to use.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("custom_welcome")
    .setDescription(
      "Set a custom message to be sent when someone joins the server."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("leave_message")
    .setDescription(
      "Set a custom message to be sent when someone leaves the server."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("join_role")
    .setDescription("Set a role to be assigned when someone joins.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("welcome_style")
    .setDescription("Toggle the style between text or embed.")
    .addStringOption((option) =>
      option
        .setName("style")
        .setDescription("The style of message to send.")
        .setRequired(true)
        .setChoices(
          { name: "embed", value: "embed" },
          { name: "text", value: "text" }
        )
    ),
];
