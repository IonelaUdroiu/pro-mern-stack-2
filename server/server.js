            //import graphql schema
            const fs = require('fs');
            //import express module
            const express = require('express');
            //require apollo server
            const { ApolloServer } = require('apollo-server-express');
            //a scalar type resolver needs to be an object of the class GraphQLScalarType, defined in the package graphql-tools
            const { GraphQLScalarType } = require('graphql');
            //the kind property indicates the type of the token that the parser found, which can be a float, an integer, or a string
            const { Kind } = require('graphql/language');

  

            let aboutMessage = "Issue Tracked API v1.0";

            const issuesDB = [
              {
                id: 1, status:'New', owner:'Ravan', effort:5, 
                created: new Date('2018-08-15'), due: undefined,
                title: 'Error in console when clicking Add',
              },
              {
            
                id: 2, status:'Assigned', owner:'Eddie', effort:14, 
                created: new Date('2018-08-16'), due: new Date('2018-08-30'),
                title: 'Missing bottom border on panel',
              },
            ];

            const GraphQLDate = new GraphQLScalarType({ 

              name: 'GraphQLDate',
              description: 'A Date() type in GraphQL as a scalar',
    
              //convert a date value to a string
              serialize(value) {
                  return value.toISOString();
              },
              parseValue(value) {
                return new Date(value);
              },
              parseLiteral(ast) {
                return (ast.kind == Kind.STRING) ? new Date (ast.value) : undefined;
              },
            });

            const resolvers = {
              Query: {
                  about: () => aboutMessage,
                  issueList,
              },
              Mutation: {
                  setAboutMessage,
                  issueAdd,
              },
              GraphQLDate,
            };

            function setAboutMessage( _, { message}) {
              return aboutMessage = message;
            }

            function issueAdd(_, { issue }) {
              issue.created = new Date();
              issue.id = issuesDB.length + 1;
              if(issue.status == undefined) issue.status = 'New';
              issuesDB.push(issue);
              return issue;
            }

            function issueList() {
              return issuesDB;
            }

            const server = new ApolloServer({
              typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
              resolvers,
            });

            //instantiate express app
            const app = express();
            //create middleware function to match the request URL with a directory specified by thre parametere
            const fileServerMiddleware = express.static('public');
            //mount the static middleware on the application to use it
            app.use('/',fileServerMiddleware);

            //
            server.applyMiddleware({ app, path: '/graphql'});

            app.listen(3000, function() {
              console.log('App started on port 3000');
            })