/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { defaultServer } from "../../config/database/defaultServer";
import { allowedTLDs, deniedTLDs } from "../../config/listeners/linkRegex";
import { ListenerHandler } from "../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Detects links in a message and responds accordingly.
 */
export const automodLinks: ListenerHandler = async (Becca, message, config) => {
  try {
    let blockedLinks = 0;
    let allowedLinks = 0;
    const contentWithoutCode = message.content.replace(
      /`{3}\w*\n[^`]*`{3}/g,
      ""
    );

    if (config.allowed_links.length) {
      for (const str of config.allowed_links) {
        const regex = new RegExp(str, "ig");
        allowedLinks += (contentWithoutCode.match(regex) || []).length;
      }
    }

    if (config.automod_roles.length) {
      for (const role of config.automod_roles) {
        if (message.member?.roles.cache.find((r) => r.id === role)) {
          return;
        }
      }
    }

    const linkRegex = new RegExp(
      `(([a-z]+:\\/\\/)?(([a-z0-9-]+\\.)+((?!${allowedTLDs.join(
        "|"
        // eslint-disable-next-line no-useless-escape
      )})[a-z]{3,4}|${deniedTLDs.join("|")})))(:[0-9]{1,5})?[^\s\n]*`,
      "ig"
    );

    blockedLinks += (contentWithoutCode.match(linkRegex) || []).length;
    if (blockedLinks > 0 && blockedLinks !== allowedLinks) {
      if (message.deletable) {
        await message.delete();
      }
      const linkEmbed = new MessageEmbed();
      linkEmbed.setTitle("Invalid Link Detected!");
      linkEmbed.setDescription(
        (config.link_message || defaultServer.link_message).replace(
          /\{@username\}/g,
          `<@!${message.author.id}>`
        )
      );
      linkEmbed.setColor(Becca.colours.error);
      linkEmbed.setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      });
      linkEmbed.setFooter(
        "Like the bot? Donate: https://donate.nhcarrigan.com",
        "https://cdn.nhcarrigan.com/profile-transparent.png"
      );
      const warning = await message.channel.send({ embeds: [linkEmbed] });

      const dmEmbed = new MessageEmbed();
      dmEmbed.setTitle("Your message has been deleted...");
      dmEmbed.setURL(warning.url);
      dmEmbed.setDescription(
        "Here's the contents of the deleted message: \n```\n" +
          message.content +
          "```"
      );
      dmEmbed.setColor(Becca.colours.error);
      dmEmbed.addField("Server", message.guild?.name || "unknown");
      dmEmbed.addField("Channel", message.channel.toString());
      dmEmbed.addField("Reason", "Blocked Link detected");

      await message.author.send({ embeds: [dmEmbed] }).catch(() => null);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "links automodder",
      err,
      message.guild?.name,
      message
    );
  }
};
