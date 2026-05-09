import type { Context } from 'koishi'
import { Argv, Schema } from 'koishi'

export const name = 'parrot'

export interface Config {}
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware((session, next) => next(async () => {
    const content = session.content || ''
    const argv = Argv.parse(content)

    for (const arg of argv.tokens || []) {
      const { inters } = arg
      const output: string[] = []
      for (let i = 0; i < inters.length; ++i) {
        const execution = await session.execute(inters[i], true)
        const transformed = await session.transform(execution)
        output.push(transformed.join(''))
      }
      for (let i = inters.length - 1; i >= 0; --i) {
        const { pos } = inters[i]
        arg.content = arg.content.slice(0, pos) + output[i] + arg.content.slice(pos)
      }
      arg.inters = []
    }

    return Argv.stringify(argv)
  }))
}
