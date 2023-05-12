export type TConfigKey = "environment" | "telegram.bot.token" | "chatgpt.api.key"

export interface IConfigService {
  get(key: TConfigKey): string
  has(key: TConfigKey): boolean
}