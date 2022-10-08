import { randomUUID } from "crypto";

import { ObjectId } from "bson";
import { ChannelType } from "discord.js";
import { getFixedT } from "i18next";

import ScheduledEventModel from "../../database/models/ScheduledEventModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import {
  ScheduledEvent,
  RawScheduledEvent,
} from "../../interfaces/database/ScheduledEvent";

interface DBEvent extends ScheduledEvent {
  _id: ObjectId;
}

const timeOuts: {
  [uuid: string]: NodeJS.Timeout;
} = {};

const createTimeout = (
  Becca: BeccaLyria,
  { member, targetChannel, lang, message, time, _id }: DBEvent
) => {
  const id = randomUUID();
  timeOuts[id] = setTimeout(async () => {
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
    delete timeOuts[id];
  }, time - Date.now());
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 * @param {RawScheduledEvent} rawEvent Raw scheduled event data to be placed into the database and the scheduler.
 */
const createEvent = async (Becca: BeccaLyria, rawEvent: RawScheduledEvent) => {
  const dbEvent = await ScheduledEventModel.create(rawEvent);
  createTimeout(Becca, dbEvent);
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 */
const loadEvents = async (Becca: BeccaLyria) => {
  const events = await ScheduledEventModel.find();
  for (const event of events) {
    if (Date.now() > event.time) {
      await ScheduledEventModel.deleteOne({ _id: event._id });
    } else {
      createTimeout(Becca, event);
    }
  }
};

export { timeOuts, createEvent, loadEvents };
