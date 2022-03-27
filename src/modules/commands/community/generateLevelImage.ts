import { MessageAttachment } from "discord.js";
import nodeHtmlToImage from "node-html-to-image";

/**
 * Parses the given HTML string into an image.
 *
 * @param {string} html The HTML string to parse.
 * @returns {MessageAttachment} An image attachment for Discord.
 */
export const generateLevelImage = async (html: string) => {
  const img = (await nodeHtmlToImage({
    html,
    selector: ".user",
    transparent: true,
  })) as Buffer;

  const attachment = new MessageAttachment(img, "level.png");

  return attachment;
};
