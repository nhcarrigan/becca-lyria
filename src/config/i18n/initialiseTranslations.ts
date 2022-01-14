import { init } from "i18next";

import enGbResponses from "./en-GB/responses.json";
import enGbSass from "./en-GB/sass.json";

/**
 * Function to initialise the i18n plugin, loading the responses.
 */
export const initialiseTranslations = async (): Promise<void> => {
  await init({
    fallbackLng: "en-GB",
    ns: ["responses", "sass"],
    returnObjects: true,
    resources: {
      "en-GB": {
        responses: enGbResponses,
        sass: enGbSass,
      },
    },
  });
};
