import type { Context } from 'koishi'
import { Argv, Schema } from 'koishi'

export const name = 'parrot'

export interface Config {
  name: string
  probability: number
}
export const Config: Schema<Config> = Schema.object({
  name: Schema.string().default('echo').description('执行命令。'),
  probability: Schema.number().default(0.05).description('复读的概率。'),
})

export function apply(ctx: Context, config: Config) {
  ctx.middleware((session, next) => next(async () => {
    if (session.stripped.atSelf || Math.random() > config.probability) {
      const content = session.content || ''
      const argv = Argv.parse(content)
      Object.assign(argv, config)
      await session.execute(argv)
    }
  }))
}
