import { Document } from "mongoose";

export interface Currency extends Document {
  userId: string;
  currencyTotal: number;
  dailyClaimed: number;
  weeklyClaimed: number;
  monthlyClaimed: number;
  slotsPlayed: number;
  twentyOnePlayed: number;
}

export const testCurrency: Omit<Currency, keyof Document> = {
  userId: "test",
  currencyTotal: 0,
  dailyClaimed: 0,
  weeklyClaimed: 0,
  monthlyClaimed: 0,
  slotsPlayed: 0,
  twentyOnePlayed: 0,
};
