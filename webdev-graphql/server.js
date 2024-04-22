import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import { books } from "./src/constants/index.js";
const app = express();
/* now we goona create a root query scope essentially this is just going to be the root query that everything is going to pull down from 
here 👇 our root query is just this single helloWorld object and we can only query from this helloWorld object the messages field  */
/* const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({      
      message: {
        type: GraphQLString,        
        resolve: () => "Hello World",
      },
    }),
  }),
}); */

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represent a book written by an author",
  fields: () => ({
    //we dont need to supply a resolve for our ID since we have an object that already has an ID property it will pull that ID property directly from that object
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
  }),
});
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
  }),
});

/* so now that we have our root query type which is using our book type we just need to create a schema and then use that schema  */

const schema = new GraphQLSchema({
  query: RootQueryType,
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
