---
title: Becca Lyria
---

Becca Lyria (hereinafter the "Application") is an AI-powered Discord bot that provides an interactive text-based role-playing game experience through direct messages. The bot utilizes Anthropic's Claude AI to create dynamic, personalized RPG adventures for users.

## 1. User Documentation

This section is for those interacting with a live instance of the Application.

### Overview

Becca Lyria is a user-installable Discord bot that transforms your DMs into an immersive text-based RPG experience. Acting as a wise mage named Becca with a cold and calculating personality, the bot serves as your personal dungeon master, weaving interactive stories that adapt to your choices and actions.

### Getting Started

1. **Installation**: [Add Becca Lyria to your Discord account](https://discord.com/oauth2/authorize?client_id=1343341112437248041)
2. **Subscription**: The bot requires an active subscription to use its features
3. **Start Playing**: Use the `/start` command to begin your adventure

### Available Commands

- **`/start`** - Start a new RPG scenario. Becca will create a fresh adventure and send it to your DMs
- **`/about`** - Learn more about the bot, including version information and useful links
- **`/clear`** - Clear your current adventure history to start fresh

### How to Play

1. Send Becca a `/start` command to begin a new adventure
2. Once the story begins in your DMs, simply respond naturally to continue the narrative
3. The bot maintains conversation history (up to 20 messages) to provide context-aware responses
4. Use `/clear` to reset your adventure history when you want to start over
5. The bot supports free-form text adventures - you can attempt any action you can imagine

### Features

- **AI-Powered Storytelling**: Powered by Claude 3.5 Sonnet for rich, dynamic narratives
- **Conversation Memory**: Maintains context from recent messages for coherent storytelling
- **Free-Form Gameplay**: No restrictive multiple choice options - express your actions naturally
- **Personalized Experience**: The bot adapts to your playstyle and incorporates your Discord display name
- **Privacy-Focused**: All gameplay happens in private DMs

### Subscription Model

Becca Lyria operates on a premium subscription model through Discord's monetization system. Users must have an active subscription to access the bot's RPG features.

## 2. Technical Documentation

This section is for those interested in running their own instance of the Application.

### Architecture Overview

Becca Lyria is built as a modern Discord bot using TypeScript and several key technologies:

**Core Technologies:**
- **Node.js/TypeScript**: Main runtime and development language
- **Discord.js**: Discord API interaction library
- **Anthropic SDK**: Integration with Claude AI models
- **Fastify**: Web server for health monitoring
- **PNPM**: Package management

**AI Integration:**
- **Provider**: Anthropic Claude (claude-3-5-sonnet-latest for conversations, claude-sonnet-4-20250514 for story starts)
- **Context Management**: Maintains up to 20 messages of conversation history
- **Personality System**: Configurable personality traits for consistent character behavior

### Project Structure

```
src/
├── index.ts              # Main entry point and Discord client setup
├── commands/             # Slash command definitions
│   ├── about.ts
│   ├── clear.ts
│   └── start.ts
├── config/
│   └── personality.ts    # AI personality configuration
├── events/
│   └── message.ts        # Direct message event handling
├── modules/              # Command implementation logic
│   ├── about.ts
│   ├── clear.ts
│   └── start.ts
├── server/
│   └── serve.ts          # Health monitoring web server
└── utils/                # Utility functions
    ├── ai.ts             # Anthropic client configuration
    ├── calculateCost.ts  # Usage cost tracking
    ├── isSubscribed.ts   # Subscription verification
    ├── logger.ts         # Logging utility
    └── replyToError.ts   # Error handling
```

### Environment Variables

The application requires several environment variables:

- `DISCORD_TOKEN`: Discord bot token
- `AI_TOKEN`: Anthropic API key
- `LOG_TOKEN`: Logging service token (optional)

### Key Features Implementation

**Subscription System:**
- Integrates with Discord's premium features
- SKU ID: `1343347225698500744`
- Entitlement checking for both interactions and messages
- Special bypass for bot owner (ID: `465650873650118659`)

**Conversation Management:**
- Fetches last 20 messages from DM channel
- Supports history clearing with special `<Clear History>` marker
- Converts message history to Anthropic's message format
- Maintains role context (user vs assistant)

**Error Handling:**
- Comprehensive error logging with custom logger
- Graceful error responses to users
- Unhandled rejection and exception catching

**Cost Tracking:**
- Monitors AI usage with token counting
- Calculates costs based on Anthropic pricing (input: $3/1M tokens, output: $15/1M tokens)
- Logs usage statistics per user

### Development Setup

1. **Prerequisites**: Node.js, PNPM
2. **Installation**: `pnpm install`
3. **Build**: `pnpm run build`
4. **Development**: Configure environment variables in `dev.env`
5. **Production**: Configure environment variables in `prod.env`
6. **Start**: `pnpm start` (requires 1Password CLI for env injection)

### Deployment Considerations

- Web server runs on port 5010 for health checks
- Requires Discord bot permissions for DMs and message content
- Needs stable Anthropic API access
- Logging integration with nhcarrigan logging service

## 3. Legal Documentation

:::note
This section is coming soon!
:::

This section is for expansions to our legal policies specific to the Application.

## 4. Contributing Documentation

This section is for documentation related to contributing to the Application's codebase.

### Development Standards

**Code Quality:**
- TypeScript with strict configuration
- ESLint with @nhcarrigan/eslint-config
- Maximum function length limits enforced
- Comprehensive JSDoc documentation required

**Testing:**
- Vitest framework configured
- Istanbul coverage reporting
- Currently no tests implemented (placeholder exists)

**Licensing:**
- Licensed under Naomi's Public License
- Copyright held by Naomi Carrigan
- See LICENSE.md for full terms

### Contribution Process

1. **Issues**: Report bugs and request features through GitHub issues
2. **Pull Requests**: Fork, develop, and submit PRs for review
3. **Code Review**: All changes require review before merging
4. **Guidelines**: Follow established [contributing guidelines](CONTRIBUTING.md)
5. **Conduct**: Adhere to [Code of Conduct](CODE_OF_CONDUCT.md)

### Development Workflow

**Commands:**
- `pnpm run build`: Compile TypeScript to production JavaScript
- `pnpm run lint`: Run ESLint with zero warnings tolerance
- `pnpm run test`: Run test suite (currently placeholder)
- `pnpm start`: Start production build with environment injection

**Architecture Patterns:**
- Event-driven Discord bot architecture
- Modular command system with separate definition and implementation
- Utility-first approach for common functionality
- Separation of concerns between commands, events, and business logic

### Contact Information

- **Chat Server**: [http://chat.nhcarrigan.com](http://chat.nhcarrigan.com)
- **Email**: contact@nhcarrigan.com
- **Source Code**: [https://git.nhcarrigan.com/nhcarrigan/becca-lyria](https://git.nhcarrigan.com/nhcarrigan/becca-lyria)
- **Documentation**: [https://docs.nhcarrigan.com/](https://docs.nhcarrigan.com/)
