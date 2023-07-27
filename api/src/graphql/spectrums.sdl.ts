export const schema = gql`
  type Spectrum {
    id: String!
    author: User!
    authorId: Int!
    private: Boolean!
    name: String
    description: String
    tson: String!
    sets: [Set]!
    tunings: [Tuning]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    spectrums: [Spectrum!]! @skipAuth
    spectrum(id: String!): Spectrum @skipAuth
  }

  input CreateSpectrumInput {
    authorId: Int!
    private: Boolean!
    name: String
    description: String
    tson: String!
  }

  input UpdateSpectrumInput {
    private: Boolean
    name: String
    description: String
    tson: String
  }

  type Mutation {
    createSpectrum(input: CreateSpectrumInput!): Spectrum! @requireAuth
    updateSpectrum(id: String!, input: UpdateSpectrumInput!): Spectrum! @requireAuth
    deleteSpectrum(id: String!): Spectrum! @requireAuth
  }
`
