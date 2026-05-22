import type { Context } from 'koishi'
import { Argv, Schema } from 'koishi'

export const name = 'parrot'

export interface Config {
  name: string
}
export const Config: Schema<Config> = Schema.object({
  name: Schema.string().default('echo').description('执行命令。'),
})

export function apply(ctx: Context, config: Config) {
  ctx.middleware((session, next) => next(async () => {
    if (session.event._data?.t === 'GROUP_MESSAGE_CREATE')
      return
    const content = session.content || ''
    const argv = Argv.parse(content)
    Object.assign(argv, config)
    await session.execute(argv)
  }))
}
