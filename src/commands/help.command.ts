import { Telegraf } from 'telegraf'
import { BotCommand } from 'telegraf/types';
import { IBotContext } from "../context/context.interface.js";
import { Command } from "./command.class.js";

export class HelpCommand extends Command {
  command: BotCommand = { command: '/help', description: 'HELP' }

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
   * This function registers a command handler for the `/help` command in a
   * Telegraf bot and replies with the JSON representation of the received message.
   */
  handle(): void {
    /* `this.bot.help()` is a method provided by the Telegraf library that
    registers a command handler for the `/help` command. The callback function
    passed to `this.bot.help()` is executed when the `/help` command is received
    by the bot. */
    this.bot.help(async ctx => {
      await ctx.reply(JSON.stringify(ctx.message, null, 2))
    })
  }
}