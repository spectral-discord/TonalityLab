export const schema = gql`
  type User {
    id: Int!
    apiToken: String!
    name: String
    tunings: [Tuning]!
    spectra: [Spectrum]!
    sets: [Set]!
  }

  type Query {
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    name: String
  }

  input UpdateUserInput {
    name: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
