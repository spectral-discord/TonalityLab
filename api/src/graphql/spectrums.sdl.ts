export const schema = gql`
  type Spectrum {
    id: String!
    author: User!
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
    sets: [Set]!
    tunings: [Tuning]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    spectrums: [Spectrum!]!
    spectrum(id: String!): Spectrum
  }

  input CreateSpectrumInput {
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
  }

  input UpdateSpectrumInput {
    public: Boolean
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
