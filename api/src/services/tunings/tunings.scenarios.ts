import type { Prisma, Tuning } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.TuningCreateArgs>({
  tuning: {
    one: { data: { tson: 'String', updatedAt: '2023-05-31T17:25:19.421Z', author: { create: {} } } },
    two: { data: { tson: 'String', updatedAt: '2023-05-31T17:25:19.421Z', author: { create: {} } } }
  }
})

export type StandardScenario = ScenarioData<Tuning, 'tuning'>
