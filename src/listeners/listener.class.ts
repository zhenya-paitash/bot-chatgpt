import { Telegraf } from 'telegraf'
import { IBotContext } from "../context/context.interface.js";

export abstract class Listener {
  constructor(public bot: Telegraf<IBotContext>) {}
  abstract handle(): void
}