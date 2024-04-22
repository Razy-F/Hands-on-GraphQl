import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
const app = express();
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({
      /* now graphQl knows that our Hello World object has a message filed and that message filed is going to return a string */
      message: {
        type: GraphQLString,
        /* lastely we needed to tell graphQl where to get this message from so in our case we just want to give it a static message of 'hello world' and this going to use the resolve section of this object which is just going to be a function that tells graphQl where to get the information from */
        resolve: () => "Hello World",
      },
    }),
  }),
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(5000, () => {
  console.log("Server running");
});
