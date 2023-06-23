export const schema = gql`
  type Tuning {
    id: String!
    author: User!
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
    sets: [Set]!
    spectra: [Spectrum]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    tunings: [Tuning!]! @requireAuth
    tuning(id: String!): Tuning @requireAuth
  }

  input CreateTuningInput {
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
  }

  input UpdateTuningInput {
    authorId: Int
    public: Boolean
    name: String
    description: String
    tson: String
  }

  type Mutation {
    createTuning(input: CreateTuningInput!): Tuning! @requireAuth
    updateTuning(id: String!, input: UpdateTuningInput!): Tuning! @requireAuth
    deleteTuning(id: String!): Tuning! @requireAuth
  }
`
