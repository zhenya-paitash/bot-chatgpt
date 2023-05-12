import 'colors'
import { Telegraf } from 'telegraf'
import LocalSession from 'telegraf-session-local'
import { configService } from './config/config.service.js'
import { IConfigService } from './config/config.interface.js'
import { IBotContext } from './context/context.interface.js'
import { Command, StartCommand, HelpCommand } from './commands/index.js'
import { Listener, TextListener, VoiceListener } from './listeners/index.js'
import { authMiddleware } from './middlewares/auth.middleware.js'
import { ResetCommand } from './commands/reset.command.js'

console.log(`Application environment: ${configService.get('environment')}`.cyan)

class Bot {
  private readonly bot: Telegraf<IBotContext>
  private commands: Command[] = []
  private listeners: Listener[] = []

  /**
   * This is a constructor function that initializes a Telegraf bot with a token
   * from a configuration service, sets up a local session database, and uses an
   * authentication middleware.
   * @param {IConfigService} configService - An interface that provides access to
   * configuration values, such as the Telegram bot token.
   */
  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("telegram.bot.token"))
    this.bot.use(new LocalSession({ database: './config/sessions.json' }).middleware())
    this.bot.use(authMiddleware())
  }

  /**
   * This function initializes bot commands and listeners for a Telegram bot in
   * TypeScript.
   */
  init() {
    // INITIALIZE BOT COMMANDS
    this.commands = [
      new StartCommand(this.bot),
      new HelpCommand(this.bot),
      new ResetCommand(this.bot),
    ]
    this.bot.telegram.setMyCommands(
      this.commands.map(command => {
        command.handle()
        return command.command
      })
    )

    // INITIALIZE LISTENERS
    this.listeners = [
      new TextListener(this.bot),
      new VoiceListener(this.bot),
    ]
    this.listeners.forEach(listener => listener.handle())

    // INITIALIZE BOT
    this.bot.launch()
  }

  /**
   * The function stops the bot and throws an error with the event that caused the
   * application to exit.
   * @param {string} event - The "event" parameter is a string that represents the
   * reason for stopping the application. It is used to provide additional
   * information about the cause of the application exit.
   */
  stop(event: string): void {
    this.bot.stop()
    const error = `Application exit with event: ${event}`
    throw new Error(error)
  }
}

/* The code creates a new instance of the `Bot` class, passing in a `configService`
object as a parameter. It then calls the `init()` method on the `bot` object,
which initializes the bot commands and listeners, and launches the bot. */
const bot = new Bot(configService)
bot.init()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))