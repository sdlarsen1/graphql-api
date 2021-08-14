import express from 'express';
import graphqlHTTP from 'express-graphql';
import {makeExecutableSchema} from 'graphql-tools';
import {ProductsService} from './product/product.service';
import {UsersService} from './user/user.service';

const app: express.Application = express();
const port = 3000;

/**
 * Tutorial taken from
 * https://www.toptal.com/graphql/graphql-nodejs-api
 */

/**
 * Create server here
 * https://www.apollographql.com/blog/graphql/examples/building-a-graphql-server/
 */

// The definition of our schema of what we can expect from queries and mutations
let typeDefs: any = [`
  type Query {
    hello: String
  }
     
  type Mutation {
    hello(message: String) : String
  }
`];

let helloMessage: String = 'World!';

// Instead of the expectation of fields or required parameters,
// here we define the functions and behaviors of how should the queries and mutations would work
let resolvers = {
    // The “gets” that we want to read from the server
    Query: {
        hello: () => helloMessage
    },
    // Our requests that are going to affect any data that we have on our own server
    Mutation: {
        hello: (_: any, helloData: any) => {
            helloMessage = helloData.message;
            return helloMessage;
        }
    }
};

// Create new service instance
const productService = new ProductsService();
const userService = new UsersService();

// Extend typeDefs
typeDefs += productService.configTypeDefs();
typeDefs += userService.configTypeDefs();

// Confidure resolvers
productService.configResolvers(resolvers);
userService.configResolvers(resolvers);


app.use(
    '/graphql',
    graphqlHTTP({
        schema: makeExecutableSchema({typeDefs, resolvers}),
        graphiql: true
    })
);
app.listen(port, () => console.log(`Node Graphql API listening on port ${port}!`));
