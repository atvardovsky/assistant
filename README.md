# AI Assistant Telegram Bot

A NestJS-based Telegram bot that integrates with OpenAI's Assistant API to provide intelligent conversational responses. The bot maintains conversation context per user using Redis for thread persistence.

## Features

- 🤖 **OpenAI Assistant Integration** - Leverages OpenAI's Assistant API for intelligent responses
- 💬 **Telegram Bot** - Full-featured Telegram bot using Telegraf
- 🔄 **Conversation Persistence** - Maintains conversation threads per user with Redis
- 📝 **Markdown Support** - Formatted responses with Telegram markdown and emojis
- 🏗️ **Modular Architecture** - Clean separation of concerns with NestJS modules

## Architecture

```
src/
├── openai/              # OpenAI Assistant API integration
│   ├── openai.module.ts
│   └── openai.service.ts
├── telegram/            # Telegram bot implementation
│   ├── telegram.module.ts
│   └── telegram.service.ts
├── app.module.ts        # Root application module
├── app.controller.ts    # Basic HTTP endpoint
├── app.service.ts       # Application service
└── main.ts             # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Redis server running locally or remotely
- OpenAI API key
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- OpenAI Assistant ID

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
ASSISTANT_ID=your-openai-assistant-id

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

### Getting Your Credentials

1. **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **OpenAI Assistant ID**: Create an assistant in [OpenAI Playground](https://platform.openai.com/playground) and copy its ID
3. **Telegram Bot Token**: Message [@BotFather](https://t.me/botfather) on Telegram and create a new bot

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## Usage

1. Start the application
2. Open Telegram and find your bot
3. Send any text message to the bot
4. The bot will forward your message to the OpenAI assistant and reply with the response
5. Conversation context is maintained per user automatically

## How It Works

1. **Message Reception**: User sends a message via Telegram
2. **User Identification**: Bot extracts user ID and retrieves/creates an OpenAI thread
3. **Thread Persistence**: Thread ID is stored in Redis for future conversations
4. **OpenAI Processing**: Message is sent to OpenAI Assistant API
5. **Response Retrieval**: Bot polls for completion and retrieves the response
6. **Reply**: Response is sent back to the user on Telegram

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Code Quality

```bash
# Lint
npm run lint

# Format code
npm run format
```

## API Endpoints

- `GET /` - Health check endpoint returning "Hello World!"

The application runs on port **3030** by default.

## Technology Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Bot Library**: Telegraf 4.x
- **AI Integration**: OpenAI Node.js SDK 4.x
- **Data Store**: Redis 4.x
- **HTTP Client**: Axios (via @nestjs/axios)
- **WebSockets**: Socket.io (via @nestjs/platform-socket.io)

## Project Structure

- **OpenAI Module**: Manages OpenAI client initialization, thread creation, message sending, and response polling
- **Telegram Module**: Handles Telegram bot setup, message reception, and response forwarding
- **Config Module**: Global configuration management using @nestjs/config
- **Redis**: Stores user-to-thread mappings for conversation continuity

## Development

### Adding New Features

1. Create a new module: `nest generate module feature-name`
2. Add services: `nest generate service feature-name`
3. Import the module in `app.module.ts`

### Environment Variables

All configuration is managed through environment variables loaded via `@nestjs/config`. Add new variables to your `.env` file and access them using `ConfigService`.

## Troubleshooting

### Redis Connection Issues
- Ensure Redis server is running: `redis-cli ping` should return `PONG`
- Check Redis connection settings if using remote server

### Bot Not Responding
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check bot is not blocked by user
- Ensure OpenAI API key is valid

### OpenAI Errors
- Verify `OPENAI_API_KEY` has sufficient credits
- Check `ASSISTANT_ID` is valid and accessible
- Review OpenAI API status at [status.openai.com](https://status.openai.com)

## License

UNLICENSED - Private project

## Contributing

This is a private project. For questions or contributions, contact the repository owner.

---

Built with [NestJS](https://nestjs.com/) | Powered by [OpenAI](https://openai.com/) | Chat via [Telegram](https://telegram.org/)
