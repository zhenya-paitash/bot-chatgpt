
import { IBotContext } from "../context/context.interface.js"

/**
 * This is a TypeScript function that sets the user and date in the session context
 * of a bot message.
 * @returns The `authMiddleware` function returns a middleware function that takes
 * in `ctx` (an object representing the context of the bot) and `next` (a function
 * that calls the next middleware in the chain). If `ctx.message` is falsy, the
 * `next` function is called and the middleware chain continues. Otherwise, the
 * `user` and `date` properties of the `session`
 */
export const authMiddleware = () => (ctx: IBotContext, next: (() => Promise<void>)) => {
  if (!ctx.message) {
    return next()
  }

  ctx.session.user = ctx.message.from
  ctx.session.date = ctx.message.date
  return next()
}
