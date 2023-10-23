export const schema = gql`
  type Set {
    id: String!
    author: User!
    authorId: Int!
    private: Boolean!
    name: String
    description: String
    tson: String!
    spectra: [Spectrum]!
    tunings: [Tuning]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    sets: [Set!]! @skipAuth
    set(id: String!): Set @skipAuth
  }

  input CreateSetInput {
    authorId: Int!
    private: Boolean!
    name: String
    description: String
    tson: String!
  }

  input UpdateSetInput {
    private: Boolean
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
