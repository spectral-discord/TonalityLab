export const schema = gql`
  type Set {
    id: String!
    author: User!
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
    spectra: [Spectrum]!
    tunings: [Tuning]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    sets: [Set!]! @requireAuth
    set(id: String!): Set @requireAuth
  }

  input CreateSetInput {
    authorId: Int!
    public: Boolean!
    name: String
    description: String
    tson: String!
  }

  input UpdateSetInput {
    authorId: Int
    public: Boolean
    name: String
    description: String
    tson: String
  }

  type Mutation {
    createSet(input: CreateSetInput!): Set! @requireAuth
    updateSet(id: String!, input: UpdateSetInput!): Set! @requireAuth
    deleteSet(id: String!): Set! @requireAuth
  }
`