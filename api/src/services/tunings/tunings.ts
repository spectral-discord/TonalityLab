import type { QueryResolvers, MutationResolvers, TuningRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const tunings: QueryResolvers['tunings'] = () => {
  return db.tuning.findMany()
}

export const tuning: QueryResolvers['tuning'] = ({ id }) => {
  return db.tuning.findUnique({
    where: { id }
  })
}

export const createTuning: MutationResolvers['createTuning'] = ({ input }) => {
  return db.tuning.create({
    data: input
  })
}

export const updateTuning: MutationResolvers['updateTuning'] = ({ id, input }) => {
  return db.tuning.update({
    data: input,
    where: { id }
  })
}

export const deleteTuning: MutationResolvers['deleteTuning'] = ({ id }) => {
  return db.tuning.delete({
    where: { id }
  })
}

export const Tuning: TuningRelationResolvers = {
  author: (_obj, { root }) => {
    return db.tuning.findUnique({ where: { id: root?.id } }).author()
  },
  sets: (_obj, { root }) => {
    return db.tuning.findUnique({ where: { id: root?.id } }).sets()
  },
  spectra: (_obj, { root }) => {
    return db.tuning.findUnique({ where: { id: root?.id } }).spectra()
  }
}
