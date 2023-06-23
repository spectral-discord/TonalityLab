import type { QueryResolvers, MutationResolvers, SpectrumRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const spectrums: QueryResolvers['spectrums'] = () => {
  return db.spectrum.findMany()
}

export const spectrum: QueryResolvers['spectrum'] = ({ id }) => {
  return db.spectrum.findUnique({
    where: { id }
  })
}

export const createSpectrum: MutationResolvers['createSpectrum'] = ({ input }) => {
  return db.spectrum.create({
    data: input
  })
}

export const updateSpectrum: MutationResolvers['updateSpectrum'] = ({ id, input }) => {
  return db.spectrum.update({
    data: input,
    where: { id }
  })
}

export const deleteSpectrum: MutationResolvers['deleteSpectrum'] = ({ id }) => {
  return db.spectrum.delete({
    where: { id }
  })
}

export const Spectrum: SpectrumRelationResolvers = {
  author: (_obj, { root }) => {
    return db.spectrum.findUnique({ where: { id: root?.id } }).author()
  },
  sets: (_obj, { root }) => {
    return db.spectrum.findUnique({ where: { id: root?.id } }).sets()
  },
  tunings: (_obj, { root }) => {
    return db.spectrum.findUnique({ where: { id: root?.id } }).tunings()
  }
}
