import { WebhookClient } from "discord.js";

/**
 * Handles processing all of Becca's analytics.
 *
 * @class
 */
export class Analytics {
  private readonly _secret: string;
  private readonly _url = "https://analytics.beccalyria.com";
  private readonly _errorHook: WebhookClient;

  /**
   * @param {string} secret The endpoint auth secret.
   * @param {WebhookClient} errors The error webhook.
   * @public
   */
  constructor(secret: string, errors: WebhookClient) {
    this._secret = secret;
    this._errorHook = errors;
  }

  /**
   * Constructs and sends the request to the analytics server.
   *
   * @param {string} endpoint The endpoint to hit.
   * @param {object} body The payload to send.
   * @private
   * @async
   */
  private async makeRequest(endpoint: string, body: object): Promise<void> {
    const result = await fetch(`${this._url}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this._secret,
      },
      body: JSON.stringify(body),
    });
    if (result.status !== 200) {
      const parsed = await result.json();
      const { message } = parsed;
      this._errorHook.send({
        content: `Analytics error: ${message}\nEndpoint: ${endpoint}\nBody:\n\`\`\`json\n${JSON.stringify(
          body,
          null,
          2
        )}\n\`\`\``,
      });
    }
  }

  /**
   * Sends a request to update the number of guilds Becca
   * is in.
   *
   * This should run daily at midnight. Do not call this
   * elsewhere.
   *
   * @param {number} count The number of guilds Becca is in.
   * @async
   * @private
   */
  private async updateGuildCount(count: number): Promise<void> {
    await this.makeRequest("guilds", { count });
  }

  /**
   * Sends a request to update the number of members Becca
   * is serving.
   *
   * This should run daily at midnight. Do not call this
   * elsewhere.
   *
   * @param {number} count The number of members Becca sees.
   * @returns {object} The response from the analytics server.
   * @async
   * @private
   */
  private async updateMemberCount(count: number): Promise<void> {
    await this.makeRequest("members", { count });
  }

  /**
   * Utility to update the counts that should run on a daily
   * CRON.
   *
   * @param {number} guildCount The number of guilds Becca is in.
   * @param {number} memberCount The number of members Becca serves.
   */
  public async updateDailyCounts(
    guildCount: number,
    memberCount: number
  ): Promise<void> {
    await this.updateGuildCount(guildCount);
    await this.updateMemberCount(memberCount);
  }

  /**
   * Sends a request to notify the analytics server of an error.
   *
   * @param {boolean} handled If the error was caught by the error handler.
   * @async
   * @public
   */
  public async updateErrorCount(handled: boolean): Promise<void> {
    await this.makeRequest("errors", { handled });
  }

  /**
   * Sends a request to notify the analytics server of a
   * gateway event.
   *
   * @param {string} event The type of gateway event.
   * @async
   * @public
   */
  public async updateEventCount(event: string): Promise<void> {
    await this.makeRequest("events", { event });
  }

  /**
   * Sends a request to notify the analytics server of a
   * command use.
   *
   * @param {string} command The command name.
   * @param {string | null} subcommandGroup The subcommand group name.
   * @param {string | null} subcommand The subcommand name.
   * @async
   * @public
   */
  public async updateCommandCount(
    command: string,
    subcommandGroup: string | null,
    subcommand: string | null
  ): Promise<void> {
    await this.makeRequest("commands", {
      command,
      subcommandGroup,
      subcommand,
    });
  }
}
