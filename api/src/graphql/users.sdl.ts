export const schema = gql`
  type User {
    id: Int!
    name: String
    tunings: [Tuning]!
    spectra: [Spectrum]!
    sets: [Set]!
  }

  type Query {
    user(id: Int!): User @skipAuth
  }

  input CreateUserInput {
    name: String
  }

  input UpdateUserInput {
    name: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @skipAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
