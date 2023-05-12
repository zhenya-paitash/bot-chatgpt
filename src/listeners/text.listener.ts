import { Telegraf } from 'telegraf'
import { IBotContext } from "../context/context.interface.js";
import { Listener } from "./listener.class.js";
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { openaiService } from './services/openai.service.js';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export class TextListener extends Listener {
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
   * This function handles incoming text messages, sends them to an OpenAI service
   * for processing, and replies with the response.
   */
  handle(): void {
    this.bot.on(message('text'), async ctx => {
      // await ctx.reply(JSON.stringify(ctx.message, null, 2))

      try {
        await ctx.reply(code(`Сообщение принято. Жду ответа от сервера...`))
        // OPENAI SERVICE: send text and get response
        ctx.session.messages.push({ role: ChatCompletionRequestMessageRoleEnum.User, content: ctx.message.text })
        const response = await openaiService.chat(ctx.session.messages)
        ctx.session.messages.push({ role: ChatCompletionRequestMessageRoleEnum.Assistant, content: response.content })
        // SEND RESULT
        await ctx.reply(response.content)
      } catch (e: Error | any) {
        console.log(e.message)
        ctx.reply(code(`Возникла непредвиденная ошибка\n${e.message}`))
      }
    })
  }
}