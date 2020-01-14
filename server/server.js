            //import graphql schema
            const fs = require('fs');
            //import express module
            const express = require('express');
            //require apollo server
            const { ApolloServer, UserInputError } = require('apollo-server-express');
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
                const dateValue = new Date(value);
                return isNaN(dateValue) ? undefined : dateValue;
              },
              parseLiteral(ast) {
                if(ast.kind == Kind.STRING) {
                  const value = new Date (ast.value);             
                  return isNaN(value) ?  undefined : value;
                } 
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

            //resolvers
            function setAboutMessage( _, { message}) {
              return aboutMessage = message;
            }

            function issueList() {
              return issuesDB;
            }

            function issueValidate(issue) {
              const errors = [];
              if (issue.title.length < 3) {
                errors.push('Field "title" must be at least 3 characters long.')
              }
              if(issue.status == 'Assigned' && !issue.owner) {
                errors.push('Field "owner" is required when status is "Assigned".')
              }
              //throw and error with UserInputError class
              if(errors.length > 0) {
                throw new UserInputError('Invalid input(s)', { errors });
              }
            }

            //resolvers
            function issueAdd(_, { issue }) {
              issueValidate(issue);
              issue.created = new Date();
              issue.id = issuesDB.length + 1;
          //    if(issue.status == undefined) //issue.status = 'New';
              issuesDB.push(issue);
              return issue;
            }

            const server = new ApolloServer({
              typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
              resolvers,
              formatError: error => {
                console.log(error);
                return error;
              },
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