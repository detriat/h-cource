import Koa from 'koa';
import Apollo from 'apollo-server-koa';
import p from 'phin';

const { ApolloServer, gql } = Apollo;

const PORT = 5000;
const SXAPI_BASE_URL = 'https://api.spacexdata.com/v3';

const getJSON = p.defaults({ parse: 'json' })

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
        dragon: async (_, { id }) => {
            let result = await getJSON(`${SXAPI_BASE_URL}/dragons/${id}`);

            return result.body;
        },
        dragons: async () => {
            // TODO: Implement this resolver
            return null;
        }
    }
};

const app = new Koa();
const server = new ApolloServer({ typeDefs, resolvers });

app
    .use(server.getMiddleware())
    .listen({ port: PORT }, async () => {
        console.log(`Server is up and ready at http://localhost:${PORT}`);
        console.log(`GraphQL path http://localhost:${PORT}${server.graphqlPath}`);
    });
