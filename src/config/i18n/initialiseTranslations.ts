import { init } from "i18next";

import enGbContexts from "./en-GB/contexts.json";
import enGbDefaults from "./en-GB/defaults.json";
import enGbEvents from "./en-GB/events.json";
import enGbListeners from "./en-GB/listeners.json";
import enGbResponses from "./en-GB/responses.json";
import enGbSass from "./en-GB/sass.json";

/**
 * Function to initialise the i18n plugin, loading the responses.
 */
export const initialiseTranslations = async (): Promise<void> => {
  await init({
    fallbackLng: "en-GB",
    ns: ["responses", "sass", "defaults", "contexts", "events", "listeners"],
    returnObjects: true,
    resources: {
      "en-GB": {
        contexts: enGbContexts,
        defaults: enGbDefaults,
        events: enGbEvents,
        listeners: enGbListeners,
        responses: enGbResponses,
        sass: enGbSass,
      },
    },
  });
};
