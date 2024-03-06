//indexes
CREATE VECTOR INDEX text_similarity IF NOT EXISTS
FOR (n:User)
ON (n.embedding)
OPTIONS {indexConfig: {
 `vector.dimensions`: 1536,
 `vector.similarity_function`: 'cosine'
}}