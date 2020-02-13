"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IssueTable;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IssueRow(_ref) {
  var issue = _ref.issue;
  return _react.default.createElement("tr", null, _react.default.createElement("td", null, issue.id), _react.default.createElement("td", null, issue.status), _react.default.createElement("td", null, issue.owner), _react.default.createElement("td", null, issue.created.toDateString()), _react.default.createElement("td", null, issue.effort), _react.default.createElement("td", null, issue.due ? issue.due.toDateString() : ''), _react.default.createElement("td", null, issue.title));
}

function IssueTable(_ref2) {
  var issues = _ref2.issues;
  var issueRows = issues.map(function (issue) {
    return _react.default.createElement(IssueRow, {
      key: issue.id,
      issue: issue
    });
  });
  return _react.default.createElement("table", {
    className: "bordered-table"
  }, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("th", null, "ID"), _react.default.createElement("th", null, "Status"), _react.default.createElement("th", null, "Owner"), _react.default.createElement("th", null, "Created"), _react.default.createElement("th", null, "Effort"), _react.default.createElement("th", null, "Due Date"), _react.default.createElement("th", null, "Title"))), _react.default.createElement("tbody", null, issueRows));
}