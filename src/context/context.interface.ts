import { ChatCompletionRequestMessage } from 'openai'
import { Context } from 'telegraf'

export interface IBotSession {
  date: number
  user: {
    first_name?: string
    last_name?: string
    username?: string
    language_code?: string
    is_premium?: boolean
    is_bot?: boolean
  }
  messages: ChatCompletionRequestMessage[]
}

export interface IBotContext extends Context {
  session: IBotSession
}