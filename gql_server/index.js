import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import pkg from '@neo4j/graphql-plugin-auth';
const { Neo4jGraphQLAuthJWTPlugin } = pkg;
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv'
// const resolvers = require("./resolvers"); 
import typeDefs from "./schema.js"
// import resolvers from "./resolvers.js"
var host = "";

if (!process.env.JWT_SECRET){
  dotenv.config({path:process.cwd()+'/../.env'})
  host = "127.0.0.1" 
} else {
  host = process.env.NEO4_HOST
}

//const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

//const host = process.env.HOST ? "neo4j" : "127.0.0.1"

console.log("neo4 host", host, "user", process.env.NEO4_USER, process.env.NEO4_PASS)

const driver = neo4j.driver(
  `bolt://${host}:7687`,
  neo4j.auth.basic(process.env.NEO4_USER, process.env.NEO4_PASS)
);

// Передача определений типов GraphQL и соединения с БД при создании экземпляра Neo4jGraphQL
console.log(typeDefs)
const neoSchema = new Neo4jGraphQL({ typeDefs, 
                                      // resolvers,
                                      driver,
                                      plugins: {
                                        auth: new Neo4jGraphQLAuthJWTPlugin({
                                          secret: process.env.JWT_SECRET,
                                          }),
                                        },
                                    });

const server = new ApolloServer({
  schema: await neoSchema.getSchema(),
  context: async ({ req }) => {
    const { authorization } = req.headers

    const token = authorization ? authorization.split(' ')[1] : undefined
    console.log("token", token)

    // this example uses firebaseAuth, but any decoded JWT object can be used here.
    // the shape of the decodedIdToken can be found here: 
    // https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken
    try {
      const decodedIdToken = await firebase.auth().verifyIdToken(token)
      console.log("decodedIdToken", decodedIdToken)
      const newJWT = jwt.sign(decodedIdToken, process.env.JWT_SECRET)
      req.headers.authorization = `Bearer ${newJWT}`     
    } catch (err) {    
      req.headers.authorization = ''
    }
    return { req, driver, ogm }
  }
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ req }),
  listen: { port: 4000 },
});

console.log(`🚀 Apollo server ready at ${url}`);



    
// const ApolloServer = require('apollo-server');
// // Создание экземпляра сервера
// const server = new ApolloServer({
//     typeDefs, // Определения наших типов
//     resolvers, // Наши функции разрешения
//     context: { db } // db – это наш фиктивный объект данных, внедренный в контекст. Этот объект будет доступен в каждой функции разрешения
// });

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });
// console.log(`🚀  Server ready at: ${url}`);