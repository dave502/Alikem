

// const resolvers = {
//     Mutation: {
//         // set text embedding to user
//         setEmbedding: async (_, {id, text}, context, info) => {
//             //console.log("obj", obj);
//             //console.log("id", id);
//             console.log("context", context);
//             //console.log("info", info);
//         //   const user = dataSources.userAPI.setEmbedding(id, text);

//         //   return {
//         //     code: 200,
//         //     success: true,
//         //     message: `Successfully added embedding for user ${id}`,
//         //     user,
//         //   };
//         },
//     },
  
  
// //   Mutation: {
// //     login: async (_, { email }, { dataSources }) => {
// //       const user = await dataSources.userAPI.findOrCreateUser({ email });
// //       if (user) {
// //         user.token = Buffer.from(email).toString('base64');
// //         return user;
// //       }
// //     },
// //   },
// }

// export default resolvers;