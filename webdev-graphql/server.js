import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";
import { authors, books } from "./src/constants/index.js";
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
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    /* since our actual array of data doesnt have an author field we need to specify a custom resolve for how we get this author  */
    author: {
      type: AuthorType,
      /* the resolve function takes as a first param a parent property which in our case is just going to be a book so this author is inside of this book type so this is going to get the book passed in the first param that is being queried for this field and we could check when this author ID is equal to the book author ID  */
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represent an author of a book ",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "Single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of Authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "Single author",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutations",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

/* so now that we have our root query type which is using our book type we just need to create a schema and then use that schema  */

const schema = new GraphQLSchema({
  query: RootQueryType,
  /* we want to create a new object type which is going to be just like our route query type but this is going to be our route mutation type becouse our schema actually takes a mutation , so we are gonna pass it our route mutation type  */
  mutation: RootMutationType,
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
