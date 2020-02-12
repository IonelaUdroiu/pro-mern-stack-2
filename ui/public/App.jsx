/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

{/*const initialIssues = [
  {
    id: 1, status:'New', owner:'Ravan', effort:5, 
    created: new Date('2018-08-15'), due: undefined,
    title: 'Error in console when clicking Add',
  },
  {

    id: 2, status:'Assigned', owner:'Eddie', effort:14, 
    created: new Date('2018-08-16'), due: new Date('2018-08-30'),
    title: 'Missing bottom border on panel',
  }
];

const sampleIssue = {
  status: 'New', owner: 'Pieta',
  title: 'Completion data should be optional',
};*/}

/* globals React ReactDOM PropTypes */


const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver (key, value) {
    if(dateRegex.test(value)) return new Date(value);
    return value;
}

class BorderWrap extends React.Component {
  render() {
    const borderedStyle = {border: "1px solid red", padding: 6};
    return(
      <div style={borderedStyle}>
        {this.props.children}
      </div>
    );
  }
}

// eslint-disable-next-line react/prefer-stateless-function

class IssueFilter extends React.Component {
  render() {
    return (
      <div>Placeholder for the issue filter.</div>
    );
  }
}

function IssueRow(props) {
    const issue = props.issue;
    return (
      <tr>
        <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.toDateString()}</td>
       {/* <td>{issue.created}</td>*/}
        <td>{issue.effort}</td>
        {/*<td>{issue.due}</td>*/}
        <td>{issue.due ? issue.due.toDateString() : ''}</td>
        <td>{issue.title}</td>
      </tr>
     
    );
  }

function IssueTable(props) {

      const issueRows = props.issues.map(issue => 
      <IssueRow key={issue.id} issue={issue} />
      );

    return (
   
      <table className="bordered-table">
        <thead style={{display: "table-header-group"}}>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Effort</th>
              <th>Due Date</th>
              <th>Title</th>
            </tr>
        </thead>
          <tbody>
            {issueRows}
          </tbody>
      </table>
    );
  }

class IssueAdd extends React.Component {

  constructor() {
    super();
    {/*this.state = {issues: initialIssues};*/}
    {/*this.state = {issues: []};*/}
   {/* setTimeout(() => {*/}
      {/*this.createIssue(sampleIssue);*/}
     {/* this.props.createIssue(sampleIssue);*/}
   {/* }, 2000);*/}
   this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
  //    status: 'New',
      due: new Date(new Date().getTime() + 1000*60*60*24*10),
    }
    this.props.createIssue(issue);
    form.owner.value="";
    form.title.value="";
  }

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="owner" placeholder="Owner"/>
        <input type="text" name="title" placeholder="Title"/>
        <button>Add</button>
      </form>      
    );
  }
}

//nsuring that IssueAdd is passed a createIssue function. 
//We’ll need to define an IssueAdd.propTypes object, with createIssue as a key and
// PropTypes.func.isRequired as its type.
IssueAdd.propTypes = {                  
  createIssue: PropTypes.func.isRequired,                  
};

async function graphQLFetch (query, variables = {}) {
  try {
 //    const response = await fetch('http://localhost:3000/graphql', {
        const response = await fetch(window.ENV.UI_API_ENDPOINT, {

        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
     });

     const body = await response.text();
     const result = JSON.parse(body, jsonDateReviver);
 
     if(result.errors) {
         const error = result.errors[0];
         if(error.extensions.code == 'BAD_USER_INPUT') {
                //the error code can be found with "errors.extension.code"
          const details = error.extensions.exception.errors.join('\n');
          alert(`${error.message}:\n ${details}`);
      } else {
          alert(`${error.extensions.code}: ${error.message}`);
      }
     }
     return result.data;

  }   catch (e) {
     alert(`Error in sending data to server: ${e.message}`);
  }
 }

//class HelloWorld extends React.Component {
class IssueList extends React.Component {

  constructor() {
    super();
    this.state = {issues: []};
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
 //   setTimeout(() => {
 //     this.setState({issues: initialIssues});
  //  }, 500);
  const query = `query {
    issueList {
        id title status owner 
        created effort due
    }
  }`;

//  const response = await fetch('/graphql', {
//    method: 'POST',
//    headers: {'Content-Type': 'application/json'},
//    body: JSON.stringify({ query })
//  });

 // const result = await response.json();

//  const body = await response.text();
//  const result = JSON.parse(body, jsonDateReviver);
//  this.setState({ issues: result.data.issueList });

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList});
    }

  }
  
  async createIssue(issue) {
//    issue.id = this.state.issues.length + 1;
//    issue.created = new Date();
//    const newIssueList = this.state.issues.slice();
//    newIssueList.push(issue);
//    this.setState({issues: newIssueList});

//    const query = `mutation {
//      issueAdd(issue: {
//        title: "${issue.title}",
//        owner: "${issue.owner}",
//        due: "${issue.due.toISOString()}",
//      }) {
//        id
//      }
//    }`;

    const query = `mutation issueAdd($issue: IssueInputs!){
      issueAdd(issue: $issue) {
        id
      }
      
    }`;

//    const response = await fetch('/graphql', {
//      method: 'POST',
//      headers: { 'Content-Type': 'application/json'},
//      body: JSON.stringify({ query, variables: { issue } })
//    });
//    this.loadData();

    const data = await graphQLFetch(query, {issue});
    if (data) {
        this.loadData();
    }
  }

  render() {
//const continents = ['Africa','America','Asia','Australia','Europe'];
//const helloContinents = Array.from(continents, c => `Hello ${c}!`);
//const message = helloContinents.join('');
 
    return(
           // const element = React.createElement('div',{title: 'Outer div'},
             //                   React.createElement('h1',null,'Hello World!')
               //                 );
           //    const element = (
              //  <div title="Outer div">
              //      <h1>{message}</h1>
              //  </div>
        //  ); 
      //  ReactDOM.render(element, document.getElementById('content'));
      <React.Fragment>

        <h1>Issue Tracker</h1>
        <IssueFilter />
          <hr />
        <BorderWrap>
          <IssueTable issues={this.state.issues}/>
        </BorderWrap>  
          <hr />
        <IssueAdd createIssue={this.createIssue}/>  
 
      </React.Fragment>
      );
  }
}

//create an instance of the HelloWorld class
//const element = <HelloWorld />;
const element = <IssueList />;

ReactDOM.render(element, document.getElementById('content'));
