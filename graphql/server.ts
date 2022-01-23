import {ApolloServer, gql} from 'apollo-server-micro'
import * as resolvers from './resolvers'

const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    description: String!
    icon_url: String!
    users: [User!]!
  }

  type User {
    id: Int!
    name: String!
    bio: String!
    avatar_url: String!
    fellowship: String!
    projects: [Project!]!
  }

  type Announcement {
    id: Int!
    fellowship: String!
    title: String!
    body: String!
  }

  union News = User | Project | Announcement

  type NewsEdge {
    node: News!
  }

  type NewsPageInfo {
    endCursor: [Int!]
    hasNextPage: Boolean!
  }

  type NewsPaginated {
    edges: [NewsEdge!]
    pageInfo: NewsPageInfo!
  }

  type Query {
    project(id: Int!): Project!
    user(id: Int!): User!
    news(forFellowship: String!, after: [Int!]): NewsPaginated
  }
`;

export const server = new ApolloServer({typeDefs, resolvers})
