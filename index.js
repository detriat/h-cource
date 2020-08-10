import Koa from 'koa';
import Apollo from 'apollo-server-koa'

import SpaceXAPI from './sources/SpaceXAPI.js';

const { ApolloServer, gql } = Apollo;
const PORT = 5000;

const typeDefs = gql`
    type Query {
        dragon(id: ID!): Dragon
        dragons: [Dragon]
    }

    type Dragon {
        id: ID!
        name: String
        type: String
        active: Boolean
        first_flight: String
        thrusters: [DragonThruster]
        wikipedia: String
        description: String
    }

    type DragonThruster {
        type: String
        amount: Int
        pods: Int
        fuel_1: String
        fuel_2: String
    }
`;

const resolvers = {
    Query: {
        dragon: async (_, { id }, {dataSources}) => {
            return dataSources.spaceXAPI.getDragon(id);
        },
        dragons: async (_source, _args, {dataSources}) => {
            return dataSources.spaceXAPI.getDragons();
        }
    }
};

const app = new Koa();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            spaceXAPI: new SpaceXAPI()
        };
    }
});

app
    .use(server.getMiddleware())
    .listen({ port: PORT }, async () => {
        console.log(`Server is up and ready at http://localhost:${PORT}`);
        console.log(`GraphQL path http://localhost:${PORT}${server.graphqlPath}`);
    });
