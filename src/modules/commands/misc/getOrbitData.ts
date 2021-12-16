import axios from "axios";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import {
  OrbitData,
  OrbitMember,
} from "../../../interfaces/commands/misc/Orbit";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 *  Handles aggregating the orbit member data.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {OrbitMember[]} Array of orbit member data.
 */
export const getOrbitData = async (
  Becca: BeccaLyria
): Promise<OrbitMember[]> => {
  try {
    const parsed: OrbitMember[] = [];
    let data = await axios.get<OrbitData>(
      "https://app.orbit.love/api/v1/nhcarrigan/members?sort=love&items=100",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Becca.configs.orbitKey}`,
        },
      }
    );
    parsed.push(...data.data.data);

    while (data.data.links.next) {
      data = await axios.get<OrbitData>(data.data.links.next, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Becca.configs.orbitKey}`,
        },
      });
      parsed.push(...data.data.data);
    }

    return parsed;
  } catch (err) {
    await beccaErrorHandler(Becca, "get orbit data", err);
    return [];
  }
};
