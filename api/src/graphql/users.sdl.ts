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
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    apiToken: String!
    name: String
  }

  input UpdateUserInput {
    apiToken: String
    name: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`