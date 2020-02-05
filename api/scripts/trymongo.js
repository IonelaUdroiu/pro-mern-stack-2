require('dotenv').config();
//import object MongoClient from the driver
const {MongoClient} = require('mongodb');


//local installation URL
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

function testWithCallbacks(callback) {
    console.log('\n--- testWithCallbacks ---');

    //create a new client object using a url that identifies a database to connect to
    const client = new MongoClient(url,{useNewUrlParser: true});

    //call the connect method on the object created, this is asynchronous method and needs a callback to receive the result of the connection
    //THe call back takes in 2 arguments: an error and the result. The result is the client object itself
    //Withing the callback, a coonnection to the database can be obtained by calling the db method of the client object
    //The callback function is called when the operation succeeeds
    client.connect(function(err,client) {
        if(err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB URL', url);

        const db = client.db();
        const collection = db.collection('employees');
        
        const employee = {id:1, name: 'A. Callback', age:23};

        //insert a new employee document and a callback
        collection.insertOne(employee,function(err,result) {
            if(err) {
                client.close();
                callback(err);
                return;
            }
            //the created ID is returned as part of the result object in the property called insertedId
            console.log('Result of insert: \n', result.insertedId);
        
            //within the callback of the insert operation, we are reding back the inserted document, using the ID of the result
            //_id is the auto-generated MOngoDB ID
            collection.find({_id:result.insertedId})
            .toArray(function(err,docs) {
                if(err) {
                    //within each callback as a result of each of the operations, on an error, we need to:
                    // close the connection to the server, 
                    //call the callback and 
                    //return from the call so that no more operations are performed
                    client.close();
                    callback(err);
                    return;
                }
                console.log('Result of find: \n', docs);
                //close the connection to the server
                client.close();
                callback(err);


            });
        });
    });
}

async function testWithAsync() {
    console.log('\n--- testWithASYNC ---');
    const client = new MongoClient(url,{useNewUrlParser:true});
    try {
        await client.connect();
        console.log('Connected to MongoDB url', url);
        const db = client.db();
        const collection = db.collection('employees');

        const employee = {id: 2, name: 'B. Async', age: 16};
        //the result of the call, which was originally the second argument of the callback, 
        //can directly be assigned to a variable like a return value from the function call
        const result = await collection.insertOne(employee);
        console.log('Result of insert:\n', result.insertedId);

        const docs = await collection.find({_id: result.insertedId})
            .toArray();
            console.log('Result of find: \n', docs);
    } catch (err) {
        console.log(err);
    } finally{
        client.close();
    }
}

testWithCallbacks(function(err) {
    if(err) {
        console.log(err);
    }
    testWithAsync();
});
        //    console.log('Result of insert: \n', result.insertedId);

