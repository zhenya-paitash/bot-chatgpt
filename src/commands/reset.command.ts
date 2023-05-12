import { Telegraf } from 'telegraf'
import { BotCommand } from 'telegraf/types';
import { IBotContext } from "../context/context.interface.js";
import { Command } from "./command.class.js";
import { code } from 'telegraf/format';

export class ResetCommand extends Command {
  command: BotCommand = { command: '/reset', description: 'Обновить контекст общения с ChatGPT' }

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
   * This function resets the context of communication for a bot in a TypeScript
   * environment.
   */
  handle(): void {
    this.bot.command('reset', async ctx => {
      ctx.session.messages = []
      await ctx.reply(code('Контекст общения обновлен.\nМожете начать новую беседу'))
    })
  }
}