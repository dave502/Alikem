import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { readFileSync } from 'fs';


const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic(process.env.NEO4_USER, process.env.NEO4_PASS)
);

// Передача определений типов GraphQL и соединения с БД при создании экземпляра Neo4jGraphQL
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
  schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ req }),
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);



    
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