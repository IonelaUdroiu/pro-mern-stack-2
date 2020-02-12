            //import graphql schema
            const fs = require('fs');
            //require dotenv
            require('dotenv').config();
            //import express module
            const express = require('express');
            //require apollo server
            const { ApolloServer, UserInputError } = require('apollo-server-express');
            //a scalar type resolver needs to be an object of the class GraphQLScalarType, defined in the package graphql-tools
            const { GraphQLScalarType } = require('graphql');
            //the kind property indicates the type of the token that the parser found, which can be a float, an integer, or a string
            const { Kind } = require('graphql/language');
            //import object MongoClient from the driver
            const {MongoClient} = require('mongodb');

            //local installation URL
            const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

            //store the connection to the database in a global variable
            // so that we can reuse the connection for many operations which 
            //will be triggered from withing API calls
            let db;

            let aboutMessage = "Issue Tracked API v1.0";

      //      const issuesDB = [
      //        {
      //          id: 1, status:'New', owner:'Ravan', effort:5, 
      //          created: new Date('2018-08-15'), due: undefined,
      //          title: 'Error in console when clicking Add',
      //        },
      //        {
      //      
      //          id: 2, status:'Assigned', owner:'Eddie', effort:14, 
      //          created: new Date('2018-08-16'), due: new Date('2018-08-30'),
      //          title: 'Missing bottom border on panel',
      //        },
      //      ];

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

            async function issueList() {
              //use the connection to the database set up in the global variable db to
              // retrieve a list of issues by calling the find() method on the issues collection
              const issues = await db.collection('issues').find({}).toArray();
             // return issuesDB;
             return issues;
            }

          
            async function getNextSequence(name) {
              //findOneAndUpdate updates a counter and returns the updatd value
              const result = await db.collection('counters').findOneAndUpdate (
                //the id is set to the name of the counter
                {_id: name},
                //increments the current value, the filed current holds the current value of the counter
                {$inc:{current:1}},
                //this is the option in node.js for returning the current or new value
                {returnOriginal: false},
              );
              return result.value.current;
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
            async function issueAdd(_, { issue }) {
              issueValidate(issue);
              issue.created = new Date();
          //    issue.id = issuesDB.length + 1;
          //generate a new id and set it to the supplied issue object in the resolver issueAdd()
              issue.id= await getNextSequence('issues');
          //write the collection called issues using insertOne()
              const result = await db.collection('issues').insertOne(issue);
              //read back the newly created issue using findOne()
              const savedIssue = await db.collection('issues')
                                  .findOne({_id: result.insertedId});
              return savedIssue;                    
          //    if(issue.status == undefined) //issue.status = 'New';
          //    issuesDB.push(issue);
          //    return issue;
            }

            //this function will connect to the database and initialize the global variable db
            async function connectToDb() {
              const client = new MongoClient(url,{useNewUrlParser:true});
              await client.connect();
              console.log('Connected to MOngoDB at', url);
              db=client.db();
            }

            const server = new ApolloServer({
              typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
              resolvers,
              formatError: error => {
                console.log(error);
                return error;
              },
            });

            //instantiate express app
            const app = express();
            //make the application safe from malicious cross-site attack
            const enableCors = (process.env.ENABLE_CORS || 'true') == 'true';                                  
            console.log('CORS setting:', enableCors);
            //create middleware function to match the request URL with a directory specified by thre parametere
         //   const fileServerMiddleware = express.static('public');
            //mount the static middleware on the application to use it
            //app.use('/',fileServerMiddleware);
            //start the express application (code emoved when app was split between api and ui)
          //  app.use(express.static('public'));
            
            //
            server.applyMiddleware({ app, path: '/graphql'});

            const port = process.env.API_SERVER_PORT || 3000;

            (async function() {
              try{
                //since await cannot be used in the main section of the program, 
                //we have to enclose it within an async function and execute that function immediately
                await connectToDb();
                app.listen(port, function() {
                  console.log(`API started on port ${port}`);
                });
              } catch(err) {
                console.log('ERROR:', err);
              }
            })();

            