//clear existing issues by calling remove() with an empty filter which
// will match al documents
db.issues.remove({});


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

  //initialize the collection by calling insertMany() on a collection called issues
db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted',count, 'issues');

//include a collection called counters and populate it with one document for the counter for issues
//initialize the counter's value to the count of inserted documents
db.counters.remove({_id:'issues'});
db.counters.insert({_id: 'issues', current: count});

db.issues.createIndex({id:1},{unique: true});
db.issues.createIndex({status:1});
db.issues.createIndex({owner:1});
db.issues.createIndex({created:1});
