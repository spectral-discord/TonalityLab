import type { Tuning } from '@prisma/client'

import { tunings, tuning, createTuning, updateTuning, deleteTuning } from './tunings'
import type { StandardScenario } from './tunings.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tunings', () => {
  scenario('returns all tunings', async (scenario: StandardScenario) => {
    const result = await tunings()

    expect(result.length).toEqual(Object.keys(scenario.tuning).length)
  })

  scenario('returns a single tuning', async (scenario: StandardScenario) => {
    const result = await tuning({ id: scenario.tuning.one.id })

    expect(result).toEqual(scenario.tuning.one)
  })

  scenario('creates a tuning', async (scenario: StandardScenario) => {
    const result = await createTuning({
      input: { authorId: scenario.tuning.two.authorId, tson: 'String', updatedAt: '2023-05-31T17:25:19.406Z' }
    })

    expect(result.authorId).toEqual(scenario.tuning.two.authorId)
    expect(result.tson).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-05-31T17:25:19.406Z'))
  })

  scenario('updates a tuning', async (scenario: StandardScenario) => {
    const original = (await tuning({ id: scenario.tuning.one.id })) as Tuning
    const result = await updateTuning({
      id: original.id,
      input: { tson: 'String2' }
    })

    expect(result.tson).toEqual('String2')
  })

  scenario('deletes a tuning', async (scenario: StandardScenario) => {
    const original = (await deleteTuning({ id: scenario.tuning.one.id })) as Tuning
    const result = await tuning({ id: original.id })

    expect(result).toEqual(null)
  })
})
