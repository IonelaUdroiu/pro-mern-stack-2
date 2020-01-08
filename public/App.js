const continents = ['Africa', 'America', 'Asia', 'Australia', 'Europe'];
const helloContinents = Array.from(continents, function (c) {
  return `Hello ${c}!`;
});
const message = helloContinents.join(''); // const element = React.createElement('div',{title: 'Outer div'},
//                   React.createElement('h1',null,'Hello World!')
//                 );

const element = React.createElement("div", {
  title: "Outer div"
}, React.createElement("h1", null, message));
ReactDOM.render(element, document.getElementById('content'));