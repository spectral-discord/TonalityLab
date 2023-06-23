import type { Prisma, Spectrum } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SpectrumCreateArgs>({
  spectrum: {
    one: { data: { tson: 'String', updatedAt: '2023-06-22T21:59:24.452Z', author: { create: {} } } },
    two: { data: { tson: 'String', updatedAt: '2023-06-22T21:59:24.452Z', author: { create: {} } } }
  }
})

export type StandardScenario = ScenarioData<Spectrum, 'spectrum'>
