import { model, Schema } from "mongoose";

import { Currency } from "../../interfaces/database/Currency";

export const CurrencySchema = new Schema({
  userId: String,
  currencyTotal: Number,
  dailyClaimed: Number,
  weeklyClaimed: Number,
  monthlyClaimed: Number,
  slotsPlayed: {
    type: Number,
    default: 0,
  },
  twentyOnePlayed: {
    type: Number,
    default: 0,
  },
});

export default model<Currency>("currency", CurrencySchema);
