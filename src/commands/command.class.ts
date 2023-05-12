import { Telegraf } from 'telegraf'
import { BotCommand } from 'telegraf/types'
import { IBotContext } from "../context/context.interface.js";

export abstract class Command {
  abstract command: BotCommand
  constructor(public bot: Telegraf<IBotContext>) {}
  abstract handle(): void
}