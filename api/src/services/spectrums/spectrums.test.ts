import type { Spectrum } from '@prisma/client'

import { spectrums, spectrum, createSpectrum, updateSpectrum, deleteSpectrum } from './spectrums'
import type { StandardScenario } from './spectrums.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('spectrums', () => {
  scenario('returns all spectrums', async (scenario: StandardScenario) => {
    const result = await spectrums()

    expect(result.length).toEqual(Object.keys(scenario.spectrum).length)
  })

  scenario('returns a single spectrum', async (scenario: StandardScenario) => {
    const result = await spectrum({ id: scenario.spectrum.one.id })

    expect(result).toEqual(scenario.spectrum.one)
  })

  scenario('creates a spectrum', async (scenario: StandardScenario) => {
    const result = await createSpectrum({
      input: { authorId: scenario.spectrum.two.authorId, tson: 'String', updatedAt: '2023-06-22T21:59:24.422Z' }
    })

    expect(result.authorId).toEqual(scenario.spectrum.two.authorId)
    expect(result.tson).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-06-22T21:59:24.422Z'))
  })

  scenario('updates a spectrum', async (scenario: StandardScenario) => {
    const original = (await spectrum({ id: scenario.spectrum.one.id })) as Spectrum
    const result = await updateSpectrum({
      id: original.id,
      input: { tson: 'String2' }
    })

    expect(result.tson).toEqual('String2')
  })

  scenario('deletes a spectrum', async (scenario: StandardScenario) => {
    const original = (await deleteSpectrum({ id: scenario.spectrum.one.id })) as Spectrum
    const result = await spectrum({ id: original.id })

    expect(result).toEqual(null)
  })
})
