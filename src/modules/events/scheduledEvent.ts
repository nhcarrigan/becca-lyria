import { ChannelType } from "discord.js";
import { getFixedT } from "i18next";
import { Document } from "mongoose";

import ScheduledEventModel from "../../database/models/ScheduledEventModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { ScheduledEvent } from "../../interfaces/database/ScheduledEvent";

const createTimeout = (
  Becca: BeccaLyria,
  { member, targetChannel, lang, message, time, _id }: ScheduledEvent
) => {
  Becca.timeOuts[_id] = setTimeout(async () => {
    const channel = await Becca.channels.fetch(targetChannel);
    const t = getFixedT(lang);
    if (
      channel &&
      (channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildNews)
    ) {
      await channel.send({
        content: t("commands:community.schedule.post", {
          id: `<@${member}>`,
          message,
        }),
        allowedMentions: {
          users: [member],
        },
      });
    }
    await ScheduledEventModel.deleteOne({ _id: _id });
    delete Becca.timeOuts[_id];
  }, time - Date.now());
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 * @param {Omit<ScheduledEvent, keyof Document>} rawEvent Raw scheduled event data to be placed into the database and the scheduler.
 */
export const createEvent = async (
  Becca: BeccaLyria,
  rawEvent: Omit<ScheduledEvent, keyof Document>
) => {
  const dbEvent = await ScheduledEventModel.create(rawEvent);
  createTimeout(Becca, dbEvent);
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 */
export const loadEvents = async (Becca: BeccaLyria) => {
  const events = await ScheduledEventModel.find();
  for (const event of events) {
    if (Date.now() > event.time) {
      await ScheduledEventModel.deleteOne({ _id: event._id });
    } else {
      createTimeout(Becca, event);
    }
  }
};
