import * as dotenv from 'dotenv'
import gql from 'graphql-tag';

if (!process.env.OPENAI_KEY) {
    console.log("no OPENAI_KEY")
    dotenv.config({path:process.cwd()+'/../.env'})
}

const openai_api_url=process.env.OPENAI_URL;
const openai_api_header_content_type="application/json";
const openai_api_header_auth="Bearer " + process.env.OPENAI_KEY;
const openai_embedding_model="text-embedding-ada-002";

const typeDefs = gql`

enum Gender {
    male
    female
}

interface Friended @relationshipProperties {
    confirmed: Boolean!
    greetings: String
    directChatID: String   
    initiator: String!  
}

type Good {
    user: User!  @relationship(type: "DID", direction: IN)
    fund: Fund @relationship(type: "TO", direction: OUT)
    date: DateTime! @timestamp(operations: [CREATE])
    sum: Int
}

type User {
    uid: String! @unique
    name: String
    name_id: String @unique
    img: String
    city: String
    location: Point
    cityID: Int
    birthday: Date
    gender: Gender
    privateProfile: Boolean 
    displayGroups: Boolean
    groups: [Group!]! @relationship(type: "MEMBER_OF", direction: OUT)
    friends: [User!]! @relationship(type: "FRIENDED", properties: "Friended", direction: OUT)
    friended: [User!]! @relationship(type: "FRIENDED", properties: "Friended", direction: IN)
    goodDeed: [Good!]! @relationship(type: "DID", direction: OUT)
    goodDeedTime: DateTime
    embedding: [Float!]
    embeddingCreationTime: DateTime
    embedding_source: String
    approved: Boolean 
    registrationDate: DateTime! @timestamp(operations: [CREATE])
    score(uid: String!): Float!
        @cypher(
            statement: """
            MATCH (u:User)
            WHERE u.uid = $uid
            RETURN gds.similarity.cosine(u.embedding, this.embedding) as cosine
            """,
            columnName: "cosine"
        )
}


type Group {
    groupID: ID! @id @unique
    groupName: String!
    date: DateTime! @timestamp(operations: [CREATE])
    creatorUid: String
    private: Boolean @default(value: false)
    directChat: Boolean @default(value: false)
    users(first: Int = 20, offset: Int = 0): [User!]!  
        @relationship(type: "MEMBER_OF", direction: IN)
}

type Fund {
    fundID: ID! @id @unique
    name: String!
    description: String!
    site: String
    picture: String
    goods: [Good!]! @relationship(type: "TO", direction: IN)
    country: String!
}

type SimilarUser {
    name: String!
    uid: String!
    img: String
    city: String
    location: Point
    cityID: Int
    birthday: Date
    gender: Gender
    score: Float!    
}

type Query{
    similarUsers(uid: String!): [SimilarUser]
        @cypher (
            statement: """
                MATCH (u:User)
                WHERE u.uid = $uid
                CALL db.index.vector.queryNodes('text_similarity', 20, u.embedding)
                YIELD node AS similarUser, score
                WHERE (NOT (similarUser.uid = $uid)) AND (similarUser.name IS NOT NULL)
                RETURN similarUser{.*, score} as result
            """,
            columnName: "result"
        )
}

type Mutation {
    setEmbedding(uid: String!, text: String!): User  
        @cypher (
            statement: """
                MATCH (u:User)
                WHERE u.uid = $uid
                CALL {
                    WITH u 
                    WITH u,
                        apoc.convert.toJson(
                            {
                                model: "${openai_embedding_model}",
                                input: $text
                            }
                        ) AS payload
                    CALL apoc.load.jsonParams(
                        "${openai_api_url}",
                        {
                            \`Content-Type\`:"${openai_api_header_content_type}",
                            Authorization:"${openai_api_header_auth}"
                        },
                        payload
                    ) YIELD value
                    CALL db.create.setNodeVectorProperty(u, 'embedding', value.data[0].embedding)
                    SET u.embeddingCreationTime = datetime()
                    SET u.embedding_source = $text
                } 
                RETURN u AS user
            """,
            columnName: "user"
        )
}

`;

// SET u.embedding = value.data[0].embedding

// type SetEmbeddingResponse {
//     "Similar to HTTP status code, represents the status of mutation"
//     code: Int!
//     "Indicates whether the mutation was successful"
//     success: Boolean!
//     "Human-readable message for the UI"
//     message: String!
//     "Newly updated user after a successful mutation"
//     user: User
// }

//     // frienders: [User!]! @relationship(type: "FRIENDED", direction: IN)

export default typeDefs;