import { Telegraf } from 'telegraf'
import { BotCommand } from 'telegraf/types';
import { IBotContext } from "../context/context.interface.js";
import { Command } from "./command.class.js";

export class StartCommand extends Command {
  command: BotCommand = { command: '/start', description: 'START' }

  /**
   * This is a constructor function that extends the functionality of a Telegraf
   * bot.
   * @param bot - The "bot" parameter is an instance of the Telegraf class, which
   * is a framework for building Telegram bots using Node.js. It provides a set of
   * methods and middleware for handling incoming messages and sending responses
   * back to the user. The "bot" instance is passed to the constructor of the class
   * that
   */
  constructor(bot: Telegraf<IBotContext>) {
    super(bot)
  }

  /**
   * This function sets up a handler for a bot that starts a session and replies
   * with a JSON stringified version of the message received.
   */
  handle(): void {
    this.bot.start(async ctx => {
      ctx.session.user = ctx.message.from
      await ctx.reply(JSON.stringify(ctx.message, null, 2))
    })
  }
}