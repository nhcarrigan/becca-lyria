import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { ChannelType } from "discord.js";
import ScheduledEventModel from "../../database/models/ScheduledEventModel";
import { ScheduledEvent, RawScheduledEvent } from "../../interfaces/database/ScheduledEvent";
import { ObjectId } from "bson";
import { getFixedT } from "i18next";
import e from "express";

interface DBEvent extends ScheduledEvent {
  _id: ObjectId;
};

export const timeOuts: {
  [uuid: string]: NodeJS.Timeout
} = {};

const createTimeout = (Becca: BeccaLyria, { member, targetChannel, lang, message, time, _id }: DBEvent) => {
  const id = crypto.randomUUID();
  timeOuts[id] = setTimeout(async () => {
    const channel = await Becca.channels.fetch(targetChannel);
    const t = getFixedT(lang);
    if (channel && (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews)) {
      await channel.send({
        content: t("commands:community.schedule.post", {
          id: `<@!${member}`,
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

export const createEvent = async (Becca: BeccaLyria, rawEvent: RawScheduledEvent) => {
  const dbEvent = await ScheduledEventModel.create(rawEvent);
  createTimeout(Becca, dbEvent);
};

export const loadEvents = async (Becca: BeccaLyria) => {
  const events = await ScheduledEventModel.find();
  for (const event of events) {
    if(Date.now() > event.time) {
      await ScheduledEventModel.deleteOne({ _id: event._id });
    } else {
      createTimeout(Becca, event);
    }
  }
};