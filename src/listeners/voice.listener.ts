import { Telegraf } from 'telegraf'
import { IBotContext } from "../context/context.interface.js";
import { Listener } from "./listener.class.js";
import { message } from 'telegraf/filters';
import { oggService } from './services/ogg.service.js';
import { openaiService } from './services/openai.service.js'
import { code } from 'telegraf/format';
import { ChatCompletionRequestMessageRoleEnum } from 'openai'

export class VoiceListener extends Listener {
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
   * This function handles voice messages, converts them to mp3, transcribes them
   * using OpenAI, and sends a response back to the user.
   */
  handle(): void {
    this.bot.on(message('voice'), async ctx => {
      // await ctx.reply(JSON.stringify(ctx.message.voice, null, 2))
        
      // ? openai get max file size 25MB. But it's only ogg file size. MP3 size > ogg size
      if (Number(ctx.message.voice.file_size) > 15_000_000) {
        const message = `Sorry, but voice file is too heavy`
        return ctx.reply(message)
      }

      try {
        await ctx.reply(code(`Сообщение принято. Жду ответа от сервера...`))
        const link: URL = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const filename = String(ctx.message.from.id)
        // OGG CONVERTER SERVICE: convert to dowload ogg file & convert to mp3
        const pathOgg: string = await oggService.download(link.href, filename)
        const pathMp3: string = await oggService.toMp3(pathOgg, filename)
        // OPENAI SERVICE: get text from mp3
        const text: string = await openaiService.transcription(pathMp3)
        await ctx.reply(code(`Ваш запрос:\n"${text}"`))
        // OPENAI SERVICE: send text and get response
        ctx.session.messages.push({ role: ChatCompletionRequestMessageRoleEnum.User, content: text })
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