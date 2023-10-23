import type { Prisma, Set } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SetCreateArgs>({
  set: {
    one: { data: { tson: 'String', updatedAt: '2023-06-22T21:59:14.831Z', author: { create: {} } } },
    two: { data: { tson: 'String', updatedAt: '2023-06-22T21:59:14.831Z', author: { create: {} } } }
  }
})

export type StandardScenario = ScenarioData<Set, 'set'>
