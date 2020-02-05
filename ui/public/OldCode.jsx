class IssueRow extends React.Component {
  render() {
    {/*const style = this.props.rowStyle;*/}
    {/*const otherStyle = {border: "1px solid orange", padding: 4};*/}
    const issue = this.props.issue;
    return (
     
      <tr>
          {/*<td style={otherStyle}>{this.props.issue_id}</td>*/}
          {/*<td style={style}>{this.props.issue_title}</td>*/}
        {/* <td style={style}>{this.props.children}</td>*/}
        <td>{issue.id}</td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.toDateString()}</td>
        <td>{issue.effort}</td>
        <td>{issue.due ? issue.due.toDateString() : ''}</td>
        <td>{issue.title}</td>
      </tr>
     
    );
  }
}

class IssueTable extends React.Component {

    render() {
      {/*const rowStyle = {border: "1px solid green", padding: 4};*/}
      {/*const issueRows = issues.map(issue => <IssueRow rowStyle={rowStyle} issue={issue} />);*/}
      {/*const issueRows = issues.map(issue => <IssueRow key={issue.id} issue={issue} />);*/}
      {/*const issueRows = this.state.issues.map(issue => */}
        const issueRows = this.props.issues.map(issue => 
        <IssueRow key={issue.id} issue={issue} />
        );
  
      return (
     
        <table className="bordered-table">
        {/*<table style={{borderCollapse: "collapse"}}>*/}
        <thread style={{display: "table-header-group"}}>
            <tr>
              {/*<th style = {rowStyle}>ID</th>*/}
              {/*<th style = {rowStyle}>Title</th>*/}
              <th>ID</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Effort</th>
              <th>Due Date</th>
              <th>Title</th>
            </tr>
         </thread>
          <tbody>
  
            {/*<IssueRow rowStyle={rowStyle} issue_id={1}
              issue_title="Error in console when clicking Add" />*/}
            {/*<IssueRow rowStyle={rowStyle} issue_id={1}>Error in console when clicking Add</IssueRow>*/}
            {/* <IssueRow rowStyle={rowStyle} issue_id={2}
              issue_title="MIssing bottom border on panel" />*/}
            {/*<IssueRow rowStyle={rowStyle} issue_id={2}>
              <div>
                Missing <b>bottom</b> border on panel
              </div>
            </IssueRow>*/}
  
            {issueRows}
          
          </tbody>
        </table>
      );
    }
  }