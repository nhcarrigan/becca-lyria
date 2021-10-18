export const updatesSinceLastRelease: string[] = [
  "- Refactored type definitions",
  "- Added tests to validate database schemas",
  "- Separated the moderation log into its own config, allowing for more granular control over event logs",
  "- Added an endpoint to the server to get the global stats",
  "- Migrated link detection out of config and into a separate automod system",
  "- Added profanity filter to the automod system",
  "- Updated the hash generation for this command to run once on load",
  "- Added a `/becca emote` command to return a random emote",
  "- Merged the thanks listener into sass mode, removing the `thanks` config",
];

export const nextScheduledRelease = "<t:1635174000:F>";
