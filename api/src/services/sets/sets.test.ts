import type { Set } from '@prisma/client'

import { sets, set, createSet, updateSet, deleteSet } from './sets'
import type { StandardScenario } from './sets.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('sets', () => {
  scenario('returns all sets', async (scenario: StandardScenario) => {
    const result = await sets()

    expect(result.length).toEqual(Object.keys(scenario.set).length)
  })

  scenario('returns a single set', async (scenario: StandardScenario) => {
    const result = await set({ id: scenario.set.one.id })

    expect(result).toEqual(scenario.set.one)
  })

  scenario('creates a set', async (scenario: StandardScenario) => {
    const result = await createSet({
      input: { authorId: scenario.set.two.authorId, tson: 'String', updatedAt: '2023-06-22T21:59:14.792Z' }
    })

    expect(result.authorId).toEqual(scenario.set.two.authorId)
    expect(result.tson).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-06-22T21:59:14.792Z'))
  })

  scenario('updates a set', async (scenario: StandardScenario) => {
    const original = (await set({ id: scenario.set.one.id })) as Set
    const result = await updateSet({
      id: original.id,
      input: { tson: 'String2' }
    })

    expect(result.tson).toEqual('String2')
  })

  scenario('deletes a set', async (scenario: StandardScenario) => {
    const original = (await deleteSet({ id: scenario.set.one.id })) as Set
    const result = await set({ id: original.id })

    expect(result).toEqual(null)
  })
})
